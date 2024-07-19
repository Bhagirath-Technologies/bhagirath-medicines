const Medicine = require("../model/medicinesInfoModel");
const Search = require('../utils/search');

// Create Medicine 
exports.createMedicine = async (req, res) => {
    try {
        const {
            nameOfMedicine, medicineId, category, type, uses, safetyAdvice, benefits,
            sideEffects, manufacturer, manufacturingDate, expiryDate,
            stock, description, dosage, price
        } = req.body;

        if (!nameOfMedicine || !category || !type || !uses || !safetyAdvice || !benefits ||
            !sideEffects || !manufacturer || !manufacturingDate || !expiryDate ||
            !stock || !description || !dosage || !price) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const medicine = await Medicine.create({
            nameOfMedicine,
            medicineId,
            category,
            type,
            uses,
            safetyAdvice,
            benefits,
            sideEffects,
            manufacturer,
            manufacturingDate,
            expiryDate,
            stock,
            description,
            dosage,
            price,
            userId: req.user.id,
        });

        return res.status(201).json({
            success: true,
            medicine,
            message: "Medicine created successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Update Medicine 
exports.updateMedicine = async (req, res) => {
    try {
        const {
            nameOfMedicine, medicineId, category, type, uses, safetyAdvice, benefits,
            sideEffects, manufacturer, manufacturingDate, expiryDate,
            stock, description, dosage, price
        } = req.body;

        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            {
                nameOfMedicine, medicineId, category, type, uses, safetyAdvice, benefits,
                sideEffects, manufacturer, manufacturingDate, expiryDate,
                stock, description, dosage, price
            },
            { new: true, runValidators: true },
        );

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Medicine updated successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Get All Medicine
exports.getAllMedicine = async (req, res) => {
    try {
        const search = new Search(Medicine.find(), req.query).search();

        const medicines = await search.query
            .populate({ path: 'userId', select: 'firstName lastName email' })
            .populate({
                path: 'category',
                select: 'subCategoryName',
                populate: {
                    path: 'parentCategoryId',
                    model: 'Category',
                    select: 'categoryName',
                },
            })
            .populate({
                path: 'type',
                select: 'subTypeName',
                populate: {
                    path: 'parentTypeId',
                    model: 'Type',
                    select: 'typeName',
                },
            });

        return res.status(200).json({
            success: true,
            result: medicines,
            message: "All medicine retrieved successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Delete Medicine
exports.deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!deletedMedicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Medicine deleted successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};
