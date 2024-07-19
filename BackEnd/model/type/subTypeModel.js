const mongoose = require('mongoose');

const subTypeSchema = new mongoose.Schema(
    {
        parentTypeId: {
            type: mongoose.Schema.ObjectId,
            ref: "Type",
            required: true,
        },
        subTypeName: {
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

module.exports = mongoose.model("SubType", subTypeSchema);