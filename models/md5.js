const crypto = require('crypto');

module.exports = (password) => {
    let md5 = crypto.createHash('md5');
    let md5password = md5.update(password).digest('base64');
    return md5password;
}