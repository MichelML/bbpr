#!/ usr/bin/env node
const fs = require('fs')

module.exports = fs.existsSync('bbpr.config.js') ? fs.readFileSync('bbpr.config.js', 'utf-8') : ''
