#!/ usr/bin/env node
const fs = require('fs')
const backupConfig = require('./pre-install')

if (backupConfig) fs.writeFileSync(`${__dirname}/bbpr.config.js`, backupConfig)
