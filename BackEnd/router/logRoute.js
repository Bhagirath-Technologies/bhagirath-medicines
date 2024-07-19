const express = require('express');
const { getLogFile } = require('../controller/readLogFileController');

const { auth, isAdmin } = require('../middleware/auth');
const { log } = require('../middleware/log');

const router = express.Router();

// Admin Routes for Log 
router.route("/admin/logs").get(auth, log, isAdmin, getLogFile);

module.exports = router;