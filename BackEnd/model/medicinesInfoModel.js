const mongoose = require('mongoose');

const medicineInfoSchema = new mongoose.Schema(
    {
        nameOfMedicine: {
            type: String,
            required: true,
            index: true,
        },
        medicineId: {
            type: String,
            required: true,
            unique: true,
        },
        category: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "SubCategory",
                required: true,
            },
        ],
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubType",
            required: true,
        },
        uses: {
            type: String,
            required: true
        },
        safetyAdvice: {
            type: String,
            required: true
        },
        benefits: {
            type: String,
            required: true
        },
        sideEffects: {
            type: String,
            required: true
        },
        manufacturer: {
            type: String,
            required: true
        },
        manufacturingDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        description: {
            type: String
        },
        dosage: {
            type: String
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Incomplete", "Draft", "Published", "Canceled"],
            default: "Incomplete",
        }
    },
    { timestamps: true },
);

module.exports = mongoose.model("Medicine", medicineInfoSchema);
