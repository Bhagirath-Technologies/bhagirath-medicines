const Category = require('../../model/category/categoryModel');
const SubCategory = require('../../model/category/subCategoryModel');

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: `Please enter category name.`,
            });
        }

        const existingCategory = await Category.findOne({ categoryName: new RegExp(`^${categoryName}$`, 'i') });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists.",
            });
        }

        const category = await Category.create({
            categoryName,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: false,
            category,
            message: `Category created successfully.`,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName || !req.params.id) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties.`,
            });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryName },
            { new: true, runValidators: true, },
        );

        if (!category) {
            return res.status(400).json({
                success: false,
                message: `category not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            category,
            message: "Category updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Get All Category
exports.getAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find().populate("createdBy", "firstName lastName");

        return res.status(200).json({
            success: false,
            result: allCategory,
            message: `All category retrieved successfully.`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        // Find and delete all subcategories that belong to the deleted category
        await SubCategory.deleteMany({ parentCategoryId: req.params.id });

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error.`,
        });
    }
};
