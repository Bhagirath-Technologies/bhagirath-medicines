const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema(
    {
        typeName: {
            type: String,
            require: true,
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

module.exports = mongoose.model("Type", typeSchema);