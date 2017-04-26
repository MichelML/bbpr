#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const srcPath = path.join(__dirname, '/bbpr.backup.config.js')
const destPath = path.join(__dirname, '/bbpr.config.js')

if (fs.existsSync(srcPath)) {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'))
  fs.unlinkSync(srcPath)
}
