const User = require('../model/userModel');
const OTP = require('../model/OTPModel');
const otpGenerator = require('otp-generator');
const sendEmail = require('../utils/sendEmail');
const emailVerification = require('../mail/templates/emailVerificationTemplate');
const resetPassword = require('../mail/templates/resetPasswordTemplate');
const crypto = require('crypto');
const Search = require('../utils/search');
const { isFileTypeSupported, destroyImageFromCloudinary, uploadToCloudinary } = require('../utils/imageUploader');

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: `Please enter your email.`,
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                success: false,
                message: `User is already registered.`,
            });
        }

        let otp, result;

        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        } while (result)

        await OTP.create({ email, otp });

        await sendEmail(
            {
                email,
                subject: `Verify your email address`,
                message: emailVerification(otp),
            }
        );

        return res.status(200).json({
            success: true,
            message: `OTP sent to ${email} successfully.`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password, confirmPassword, address, otp, role } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password must match.",
            });
        }

        if (role === "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin registration is not allowed on this route.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        // Check if OTP is valid
        const storedOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!storedOtp) {
            return res.status(400).json({
                success: false,
                message: `Invalid OTP.`,
            });
        } else if (otp !== storedOtp.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP.',
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            address,
            image: {
                public_id: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
                url: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            },
        });

        const token = user.getJWTToken();

        delete user.password;
        // user.salt = undefined;

        const expirationTime = new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
        const tokenCookie = `token=${token}; Path=/; Max-Age=${expirationTime}; SameSite=Strict; Secure;`;
        res.setHeader("Set-Cookie", tokenCookie);

        return res.status(201).json({
            success: true,
            token,
            user,
            message: "User registered successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            // message: "Internal Server Error",
            message: err.message,
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = user.getJWTToken();

        // user.password = undefined;
        delete user.password;

        const expirationTime = new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
        const tokenCookie = `token=${token}; Path=/; Max-Age=${expirationTime}; SameSite=Strict; Secure;`;
        // const tokenCookie = `token=${token}; Path=/; Max-Age=${expirationTime}; SameSite=None; Secure;`;
        res.setHeader("Set-Cookie", tokenCookie);

        return res.status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully.",
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Logout User
exports.logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "Logged Out Successful.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Get ResetPasswordToken
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Construct reset password URL
        // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/resetPassword.html?token=${resetToken}`;

        const resetPasswordUrl = `${process.env.CORS_ORIGIN}/resetPassword.html?token=${resetToken}`;

        // Generate email message
        const message = resetPassword(resetPasswordUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: `Password Recovery`,
                message,
            });

            return res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully.`,
            });

        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: `Error sending email. Please try again later.`,
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        if (!req.body.password || !req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password are required.",
            });
        } else if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match.",
            });
        }

        // Creating hash token
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset Password Token is invalid or has expired.",
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: "User retrieved successfully."
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Update User's Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory.",
            });
        } else if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match.",
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const isPasswordMatched = await user.comparePassword(currentPassword);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        user.password = newPassword;
        await user.save({ runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Update User Details
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, email, contactNumber, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// User's ImageUploader Controller
exports.uploadImage = async (req, res) => {
    try {
        const { imageFile } = req.files;

        const user = await User.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            });
        }

        // Validate file type
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        if (!isFileTypeSupported(imageFile.name, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'Unsupported file format. Please upload a JPG, JPEG, or PNG file.',
            });
        }

        // Delete the current profile image from Cloudinary
        await destroyImageFromCloudinary(user.image.public_id);

        // Upload new image to cloudinary
        const response = await uploadToCloudinary(imageFile);
        const image = { public_id: response.public_id, url: response.secure_url };

        user.image = image;
        await user.save({ runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Get All User -- Admin
exports.getAllUser = async (req, res) => {
    try {
        const search = new Search(User.find(), req.query).search();

        const users = await search.query;

        return res.status(200).json({
            success: true,
            result: users,
            message: "Users retrieved successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Update User Details -- Admin
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, address, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, contactNumber, address, role },
            { new: true, runValidators: true },
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            updatedUser,
            message: "User updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// Delete User -- Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: true,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
