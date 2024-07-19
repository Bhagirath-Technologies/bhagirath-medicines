const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        parentCategoryId: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
        },
        subCategoryName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
