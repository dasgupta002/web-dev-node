const crypto = require('crypto');

const hashing = (text) => {
    return crypto.createHmac('sha256', 'secret key')
                 .update(text)
                 .digest('hex');
}

module.exports = { hashing };