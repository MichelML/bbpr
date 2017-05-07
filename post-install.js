#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const pathToNodeModules = path.resolve().substr(0, path.resolve().lastIndexOf('/'))
const srcFileName = 'bbpr.backup.config.js'
const srcPath = path.join(pathToNodeModules, srcFileName)
const destPath = './bbpr.config.js'

function writeBackupConfig () {
  if (fs.existsSync(srcPath)) {
    const srcFile = fs.readFileSync(srcPath, 'utf8')
    fs.writeFileSync(destPath, srcFile)
    fs.unlinkSync(srcPath)
  }
}

if (require.main === module) {
  writeBackupConfig()
}

module.exports = {
  destPath,
  pathToNodeModules,
  srcFileName,
  srcPath,
  writeBackupConfig
}
