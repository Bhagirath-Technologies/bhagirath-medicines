const express = require('express');
const router = express.Router();

const { createOrder, getAllOrders, updateOrder, deleteOrder, myOrders } = require('../controller/orderController');

const { auth, isAdmin } = require('../middleware/auth');

// User Routes
router.route("/order/new").post(auth, createOrder);

router.route("/orders/me").get(auth, myOrders);

// Admin Routes
router.route("/admin/orders").get(auth, isAdmin, getAllOrders);

router.route("/admin/order/:id")
    .put(auth, isAdmin, updateOrder)
    .delete(auth, isAdmin, deleteOrder);

module.exports = router;
