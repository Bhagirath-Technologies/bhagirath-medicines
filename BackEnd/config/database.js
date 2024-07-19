const mongoose = require('mongoose');

exports.connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log(`Database Connected Successfully.`);
        })
        .catch((err) => {
            console.log(`Database failed to connected.`);
            console.error(err);
            process.exit(1);
        });
};
