#!/ usr/bin/env node
const fs = require('fs')

fs.stat('config.backup.js', rewriteConfigBackup)

function rewriteConfigBackup (error) {
  if (!error) {
    fs.writeFileSync('bbpr.config.js', fs.readFileSync('config.backup.js', 'utf-8'))
    fs.unlinkSync('config.backup.js')
  }
}
