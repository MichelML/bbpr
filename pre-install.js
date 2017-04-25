#!/ usr/bin/env node
const fs = require('fs')

module.exports = fs.existsSync(`${__dirname}/bbpr.config.js`) ? fs.readFileSync(`${__dirname}/bbpr.config.js`, 'utf-8') : ''
