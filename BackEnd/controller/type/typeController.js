const Type = require('../../model/type/typeModel');
const SubType = require('../../model/type/subTypeModel');

// Create Type
exports.createType = async (req, res) => {
    try {
        const { typeName } = req.body;

        if (!typeName) {
            return res.status(400).json({
                success: false,
                message: `Please enter type name.`,
            });
        }

        const existingType = await Type.findOne({ typeName: new RegExp(`^${typeName}$`, 'i') });
        if (existingType) {
            return res.status(409).json({
                success: false,
                message: "Type already exists.",
            });
        }

        const type = await Type.create({
            typeName,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: false,
            type,
            message: `Type created successfully.`,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Update Type
exports.updateType = async (req, res) => {
    try {
        const { typeName } = req.body;

        if (!typeName || !req.params.id) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const type = await Type.findByIdAndUpdate(
            req.params.id,
            { typeName },
            { new: true, runValidators: true, },
        );

        if (!type) {
            return res.status(400).json({
                success: false,
                message: `Type not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            type,
            message: "Type updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get All Type
exports.getAllType = async (req, res) => {
    try {
        const getAllTypes = await Type.find()
            .populate("createdBy", "firstName lastName");

        return res.status(200).json({
            success: false,
            result: getAllTypes,
            message: `All types retrieved successfully.`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Delete Type
exports.deleteType = async (req, res) => {
    try {
        const deletedType = await Type.findByIdAndDelete(req.params.id);

        if (!deletedType) {
            return res.status(404).json({
                success: false,
                message: "Type not found.",
            });
        }

        // Find and delete all subtypes that belong to the deleted types
        await SubType.deleteMany({ parentTypeId: req.params.id });

        return res.status(200).json({
            success: true,
            message: "Type deleted successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};
