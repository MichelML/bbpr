#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const pathToNodeModules = path.resolve().substr(0, path.resolve().lastIndexOf('/'))
const srcPath = path.join(pathToNodeModules, 'bbpr.backup.config.js')
const destPath = './bbpr.config.js'

if (fs.existsSync(srcPath)) {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'))
  fs.unlinkSync(srcPath)
}
