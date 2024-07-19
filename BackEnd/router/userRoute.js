const express = require('express');
const router = express.Router();
const {
    createUser,
    sendOtp,
    login,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateUser,
    uploadImage,
    getAllUser,
    updateUserByAdmin,
    deleteUser
} = require('../controller/userController');
const { auth, isAdmin } = require('../middleware/auth');
const { log } = require('../middleware/log');

// Public Routes
router.route("/otp").post(sendOtp);
router.route("/createUser").post(createUser);
router.route("/login").post(login);
// router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

// Authenticated User Routes
router.route("/me").get(auth, log, getUserDetails);
router.route("/password/update").put(auth, log, updatePassword);
router.route("/update/me").put(auth, log, updateUser);
router.route("/upload/image").put(auth, log, uploadImage);

// Admin Routes
router.route("/admin/users").get(auth, log, isAdmin, getAllUser);
router.route("/admin/user/:id")
    .put(auth, log, isAdmin, updateUserByAdmin)
    .delete(auth, log, isAdmin, deleteUser);

module.exports = router; 
