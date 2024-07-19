const crypto = require('crypto');

exports.hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(40).toString('hex');
        crypto.pbkdf2(password, salt, 250, 52, "sha512", (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve({ password: derivedKey.toString('hex'), salt: salt });
            }
        });
    });
};

exports.verifyPassword = async (password, hashPassword, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 250, 52, "sha512", (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve(derivedKey.toString('hex') === hashPassword);
            }
        });
    });
};
