const crypto = require('crypto')
const cipher = crypto.createCipher(require('./strings').cal, require('./strings').cp)
const decipher = crypto.createDecipher(require('./strings').cal, require('./strings').cp)
const fs = require('fs')

function cachePwd (pwd) {
  fs.writeFileSync(`${__dirname.replace(/lib$/, '')}/bbpr.config.js`,
    fs.readFileSync(`${__dirname.replace(/lib$/, '')}/bbpr.config.js`, 'utf-8').replace('password: null', `password: '${pwd}'`))
}

function crypt (text) {
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt (text) {
  let decrypted = decipher.update(text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  cachePwd,
  cipher,
  crypt,
  decrypt,
  decipher
}
