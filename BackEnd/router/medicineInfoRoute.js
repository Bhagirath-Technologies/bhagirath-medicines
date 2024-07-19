const express = require('express');
const {
    createMedicine,
    getAllMedicine,
    updateMedicine,
    deleteMedicine,
} = require('../controller/medicineInfoController');

const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin Routes for Medicine Management
router.route("/admin/medicines").get(auth, getAllMedicine);

router.route("/admin/medicines/create").post(auth, isAdmin, createMedicine);

router.route("/admin/medicines/:id")
    .put(auth, isAdmin, updateMedicine)
    .delete(auth, isAdmin, deleteMedicine);

module.exports = router;
