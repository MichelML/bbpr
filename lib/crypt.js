const crypto = require('crypto')
const cipher = crypto.createCipher(require('./strings').cal, require('./strings').cp)
const decipher = crypto.createDecipher(require('./strings').cal, require('./strings').cp)
const password = require('../bbpr.config').user.password
const shell = require('shelljs')

function cachePwd (pwd) {
  shell.exec(`sed -i -n "s/password: null/password: '${pwd}'/" "${__dirname.replace(/lib$/, '')}/bbpr.config.js"`)
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
  crypt,
  decrypt
}
