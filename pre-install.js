#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const pathToNodeModules = [1, 2].reduce(pathToNode => pathToNode.substr(0, pathToNode.lastIndexOf('/')), path.resolve())

const destPath = path.join(pathToNodeModules, 'bbpr.backup.config.js')
const srcPath = path.join(pathToNodeModules, 'bbpr/bbpr.config.js')

function backupConfig () {
  if (fs.existsSync(srcPath)) {
    const fileContent = fs.readFileSync(srcPath, 'utf8')
    fs.writeFileSync(destPath, fileContent)
  }
}

if (require.main === module) {
  backupConfig()
}

module.exports = {
  backupConfig,
  destPath,
  pathToNodeModules,
  srcPath
}
