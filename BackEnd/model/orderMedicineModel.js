const mongoose = require('mongoose');

const orderMedicineSchema = new mongoose.Schema(
    {
        shippingAddress: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            pinCode: {
                type: Number,
                required: true,
            },
            phoneNo: {
                type: Number,
                required: true,
            },
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                medicineId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Medicine',
                    required: true
                },
            },
        ],
        medicineOrderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        deliveryDate: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderMedicineSchema);
