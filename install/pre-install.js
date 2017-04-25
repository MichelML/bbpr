#!/ usr/bin/env node
const fs = require('fs')

fs.stat('bbpr.config.js', makeConfigBackup)

function makeConfigBackup (error) {
  if (!error) {
    fs.writeFileSync('../bbpr.config.backup.js', fs.readFileSync('bbpr.config.js', 'utf-8'))
  }
}
