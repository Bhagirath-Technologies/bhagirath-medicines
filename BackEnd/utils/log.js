// const fs = require('fs');

// function logReqRes(filename) {
//     return (req, res, next) => {
//         fs.appendFile(
//             filename,
//             `\n${new Date().toLocaleString()}:${req.ip} ${req.method}: ${req.path}\n`,
//             (err, data) => {
//                 next();
//             }
//         );
//     };
// }

// module.exports = {
//     logReqRes,
// }

//=====================================================================================================================================

const fs = require('fs');
const path = require('path');

// Function to log messages to a file
function logMessage(message) {
    // const logFilePath = path.join(__dirname, 'logs', 'user-activities.log');
    const logFilePath = path.join(__dirname, '..', 'logs', 'user-activities.log'); // Adjusted path
    const logMessage = `\n${new Date().toLocaleString()} ${message}\n`;


    // Ensure the log directory exists
    fs.mkdir(path.dirname(logFilePath), { recursive: true }, (err) => {
        if (err) {
            console.log(`Error creating directory: ${err}`);
        }
    });

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, 'utf8', (err) => {
        if (err) {
            console.log(`Error creating file: ${err}`);
        }
    });
}

function getUserAgentInfo(userAgent) {
    let device = 'Unknown Device';
    let browser = 'Unknown Browser';

    if (userAgent) {
        // Basic device detection
        if (userAgent.includes('Windows')) {
            device = 'Windows';
        } else if (userAgent.includes('Macintosh')) {
            device = 'Mac';
        } else if (userAgent.includes('Linux')) {
            device = 'Linux';
        } else if (userAgent.includes('Android')) {
            device = 'Android';
        } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
            device = 'iOS';
        }

        // Basic browser detection
        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
        } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            browser = 'Internet Explorer';
        }
    }

    return { device, browser };
}

module.exports = {
    logMessage,
    getUserAgentInfo
}
