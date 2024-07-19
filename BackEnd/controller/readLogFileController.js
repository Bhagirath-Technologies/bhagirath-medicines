const fs = require('fs');
const path = require('path');

exports.getLogFile = (req, res) => {

    const logFile = path.join(__dirname, '..', 'logs', 'user-activities.log');

    fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to read file.",
                error: err.message,
            });
        }

        // Send the log file content as response
        res.type('text/plain').send(data);

        // return res.status(200).json({
        //     success: true,
        //     result: data,
        //     message: "Log file reterieved successfully.",
        // });
    });
};
