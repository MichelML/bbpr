const crypto = require('crypto');
const cipher = crypto.createCipher(require('./strings').cal, require('./strings').cp);
const decipher = crypto.createDecipher(require('./strings').cal, require('./strings').cp);
const password = require('../bbpr.config').user.password;
const shell = require('shelljs');

let p = ''

cipher.on('readable', () => {
    const data = cipher.read();
    if (data)
        p += data.toString('hex');
});

cipher.on('end', () => {
    shell.exec(`sed -i -n "s/password: null/password: '${p}'/" "${__dirname.replace(/lib$/,'')}/bbpr.config.js"`)
});

exports.crypt = function crypt(info) {
    cipher.write(info);
    cipher.end();
}

exports.decrypt = function decrypt() {
    let decrypted = decipher.update(password, 'hex', 'utf8');
    return decipher.final('utf8');
}
