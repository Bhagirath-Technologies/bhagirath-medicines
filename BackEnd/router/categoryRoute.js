const express = require('express');
const { createCategory, updateCategory, getAllCategory, deleteCategory } = require('../controller/category/categoryController');

const { createSubCategory, updateSubCategory, getAllSubCategory, deleteSubCategory, getSingleCategoryOfSubCategory } = require('../controller/category/subCategoryController');

const { auth } = require('../middleware/auth');

const router = express.Router();

// Category Route
router.route("/categories").get(auth, getAllCategory);

router.route("/categories/create").post(auth, createCategory);

router.route("/categories/:id")
    .put(auth, updateCategory)
    .delete(auth, deleteCategory);

// Sub Category Route
router.route("/subCategories/create").post(auth, createSubCategory);

router.route("/subCategories").get(auth, getAllSubCategory);

router.route("/subCategories/:id")
    .get(auth,getSingleCategoryOfSubCategory)
    .put(auth, updateSubCategory)
    .delete(auth, deleteSubCategory);

module.exports = router;
 