const { getUserAgentInfo, logMessage } = require('../utils/log');

// Middleware to log user activities
exports.log = async (req, res, next) => {
    const user = req.user ? req.user.email : 'Anonymous';
    const userAgentInfo = getUserAgentInfo(req.headers['user-agent']);
    const device = userAgentInfo.device;
    const browser = userAgentInfo.browser;

    logMessage(`User: ${user} | Device: ${device} | Browser: ${browser} | Method: ${req.method} | URL: ${req.path} | IP: ${req.ip}`);
    next();
};