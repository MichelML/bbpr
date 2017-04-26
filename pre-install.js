#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const srcPath = path.join(__dirname, '/bbpr.config.js')
const destPath = path.join('../../', 'bbpr.backup.config.js')

if (fs.existsSync(srcPath)) {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'))
}
