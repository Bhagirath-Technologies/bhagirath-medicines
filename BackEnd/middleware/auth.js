const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {

        const token = (req.headers.cookie && req.headers['cookie'].split('=')[1]) ||
            (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));

        // const token = (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please Login to access this resource.",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token expired or invalid",
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

exports.isEditor = async (req, res, next) => {
    try {
        if (req.user.role !== "Editor") {
            return res.status(403).json({
                success: false,
                message: `Access denied. You are not allowed to access this resource`,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

exports.isReviewer = async (req, res, next) => {
    try {
        if (req.user.role !== "Reviewer") {
            return res.status(403).json({
                success: false,
                message: `Access denied. You are not allowed to access this resource`,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: `Access denied. You are not allowed to access this resource`,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};
