const Type = require('../../model/type/typeModel');
const SubType = require('../../model/type/subTypeModel');

// Create Sub Type
exports.createSubType = async (req, res) => {
    try {
        const { parentTypeId, subTypeName } = req.body;

        if (!subTypeName || !parentTypeId) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const checkParentType = await Type.findById(parentTypeId);
        if (!checkParentType) {
            return res.status(404).json({
                success: false,
                message: `Type not found`,
            });
        }

        const existingSubType = await SubType.findOne({ subTypeName: new RegExp(`^${subTypeName}$`, 'i') });
        if (existingSubType) {
            return res.status(409).json({
                success: false,
                message: "SubType already exists.",
            });
        }

        const subType = await SubType.create({
            parentTypeId,
            subTypeName,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: false,
            subType,
            message: `SubType created successfully.`,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Update Sub Type
exports.updateSubType = async (req, res) => {
    try {
        const { subTypeName } = req.body;

        if (!req.params.id || !subTypeName) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const updateSubType = await SubType.findOneAndUpdate(
            { _id: req.params.id },
            { subTypeName },
            { new: true, runValidators: true },
        );

        if (!updateSubType) {
            return res.status(404).json({
                success: false,
                messsage: `SubType not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            updateSubType,
            message: "SubType updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get All Sub Type
exports.getAllSubtype = async (req, res) => {
    try {
        const allSubType = await SubType.find().populate('parentTypeId', 'typeName');

        return res.status(200).json({
            success: false,
            result:allSubType,
            message: `All type retrieved successfully.`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get Specific or One Parent Type's Sub Types
exports.getSingleTypeOfSubTypes = async (req, res) => {
    try {
        const singleTypeOfSubTypes = await SubType.find({parentTypeId:req.params.id});

        if (!singleTypeOfSubTypes) {
            return res.status(404).json({
                success: false,
                message: 'Sub type not found.',
            });
        }

        return res.status(200).json({
            success: true,
            result: singleTypeOfSubTypes,
            message: "All subtype reterieved successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Delete Sub Type
exports.deleteSubType = async (req, res) => {
    try {
        const subType = await SubType.findByIdAndDelete(req.params.id);

        if (!subType) {
            return res.status(404).json({
                success: false,
                messsage: `SubType not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "SubType deleted successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};
