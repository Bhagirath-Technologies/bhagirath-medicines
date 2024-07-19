const Category = require('../../model/category/categoryModel');
const SubCategory = require('../../model/category/subCategoryModel');

// Create Sub Category
exports.createSubCategory = async (req, res) => {
    try {
        const { parentCategoryId, subCategoryName } = req.body;

        if (!parentCategoryId || !subCategoryName) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const checkParentCategory = await Category.findById(parentCategoryId);
        if (!checkParentCategory) {
            return res.status(404).json({
                success: false,
                message: `Category not found`,
            });
        }

        const existingSubCategory = await SubCategory.findOne({ subCategoryName: new RegExp(`^${subCategoryName}$`, 'i') });
        if (existingSubCategory) {
            return res.status(409).json({
                success: false,
                message: "SubCategory already exists.",
            });
        }

        const subCategory = await SubCategory.create({
            parentCategoryId,
            subCategoryName,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: false,
            subCategory,
            message: `SubCategory created successfully.`,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Update Sub Category
exports.updateSubCategory = async (req, res) => {
    try {
        const { subCategoryName } = req.body;

        if (!req.params.id || !subCategoryName) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const updateSubCategory = await SubCategory.findOneAndUpdate(
            { _id: req.params.id },
            { subCategoryName },
            { new: true, runValidators: true },
        );

        if (!updateSubCategory) {
            return res.status(404).json({
                success: false,
                messsage: `SubCategory not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            updateSubCategory,
            message: "SubCategory updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get All Sub Category
exports.getAllSubCategory = async (req, res) => {
    try {
        const allSubCategory = await SubCategory.find().populate('parentCategoryId', 'categoryName');

        return res.status(200).json({
            success: false,
            result: allSubCategory,
            message: `All category retrieved successfully.`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get Specific or One Parent Category's Sub Category
exports.getSingleCategoryOfSubCategory = async (req, res) => {
    try {
        const CategoryOfSubCategory = await SubCategory.find({ parentCategoryId: req.params.id });

        if (!CategoryOfSubCategory) {
            return res.status(404).json({
                success: false,
                message: 'Sub type not found.',
            });
        }

        return res.status(200).json({
            success: true,
            result: CategoryOfSubCategory,
            message: "All subCategories reterieved successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Delete Sub Category
exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                messsage: `SubCategory not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "SubCategory deleted successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};
