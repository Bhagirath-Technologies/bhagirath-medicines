const express = require('express');

const { createType, updateType, getAllType, deleteType } = require('../controller/type/typeController');

const { createSubType, updateSubType, getAllSubtype, deleteSubType, getSingleTypeOfSubTypes } = require('../controller/type/subTypeControlle');

const { auth } = require('../middleware/auth');

const router = express.Router();

// Type Routes
router.route("/types").get(auth, getAllType);

router.route("/types/create").post(auth, createType);

router.route("/types/:id")
    .put(auth, updateType)
    .delete(auth, deleteType);

// Sub Type Routes
router.route("/subType/create").post(auth, createSubType);

router.route("/subType").get(auth, getAllSubtype);

router.route("/subType/:id")
    .get(auth, getSingleTypeOfSubTypes)
    .put(auth, updateSubType)
    .delete(auth, deleteSubType);

module.exports = router;
