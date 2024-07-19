const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please Enter Your Firstname."],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Please Enter Your Lastname."],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please Enter Your email."],
            unique: true,
            trim: true,
        },
        contactNumber: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password."],
            select: false,
            minLength: [8, "Password should not be less than 8 characters"],
        },
        // salt: {
        //     type: String,
        //     required: true,
        // },
        address: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: ["User", "Editor", "Reviewer", "Admin"],
            default: "User",
        },
        image: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE },
    );
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
