const Order = require('../model/orderMedicineModel');
const Medicine = require('../model/medicinesInfoModel');

// Create order or request
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, orderItems } = req.body;

        if (!shippingAddress || !Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Shipping address and order items are required.",
            });
        }

        const medicineId = orderItems[0]["medicineId"];
        const quantity = orderItems[0]["quantity"];

        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: `Medicine with ID ${medicineId} not found.`,
            });
        }

        const order = await Order.create({
            shippingAddress,
            orderItems: [
                {
                    name: medicine.nameOfMedicine,
                    price: medicine.price,
                    quantity,
                    medicineId,
                },
            ],
            totalPrice: medicine.price * quantity,
            medicineOrderedBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            order,
            message: "Order placed successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Get All Orders or request
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('medicineOrderedBy', 'firstName lastName email')
            .populate({
                path: 'orderItems.medicineId',
                select: 'name medicineId category uses benefits',
                populate: {
                    path: 'category',
                    select: 'subCategoryName',
                    populate: {
                        path: 'parentCategoryId',
                        model: 'Category',
                        select: 'categoryName',
                    },
                },
            });

        return res.status(200).json({
            success: true,
            orders,
            message: "All orders reterived successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Get My Order or request
exports.myOrders = async (req, res) => {
    try {
        const myOrders = await Order.find({ medicineOrderedBy: req.user.id })
            .populate('medicineOrderedBy', 'firstName lastName email')
            .populate({
                path: 'orderItems.medicineId',
                select: 'name medicineId subCategoryName uses benefits',
                populate: {
                    path: 'category',
                    select: 'subCategoryName',
                    populate: {
                        path: 'parentCategoryId',
                        model: 'Category',
                        select: 'categoryName',
                    },
                }
            });

        return res.status(200).json({
            success: true,
            myOrders,
            message: "User orders retrieved successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Update Order or request
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.orderStatus === "delivered") {
            return res.status(400).json({
                success: false,
                message: "This order has already been delivered.",
            });
        }

        if (req.body.status === "delivered") {
            order.orderItems.forEach(async (orders) => {
                try {
                    await updateStock(orders.medicineId, orders.quantity);
                    order.orderStatus = req.body.status;

                    if (req.body.status === "delivered") {
                        order.deliveryDate = Date.now();
                    }

                    await order.save({ runValidators: true });

                    return res.status(200).json({
                        success: true,
                        message: "Order status updated successfully.",
                    });
                } catch (error) {
                    return res.status(error.status).json({
                        success: false,
                        message: error.message,
                    });
                }
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

async function updateStock(id, quantity) {
    try {
        const medicine = await Medicine.findById(id);

        if (!medicine) {
            const error = new Error("Medicine not found.");
            error.status = 404;
            throw error;
        }

        if (medicine.stock < quantity) {
            const error = new Error(`Only ${medicine.stock} is available.`);
            error.status = 401;
            throw error;
        }

        if (medicine.stock < 0) {
            const error = new Error("Insufficient stock for medicine.");
            error.status = 400;
            throw error;
        }

        medicine.stock -= quantity;
        await medicine.save({ runValidators: true });
    } catch (err) {
        const error = new Error(err.message || "Error updating stock.");
        error.status = err.status || 500;
        throw error;
    }
};

// Delete Order or request
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};
