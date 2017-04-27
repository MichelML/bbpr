#!/ usr/bin/env node
const fs = require('fs')
const path = require('path')
const pathToNodeModules = [1, 2].reduce(pathToNode => pathToNode.substr(0, pathToNode.lastIndexOf('/')), path.resolve())
const srcPath = path.join(pathToNodeModules, 'bbpr/bbpr.config.js')
const destPath = path.join(pathToNodeModules, 'bbpr.backup.config.js')

if (fs.existsSync(srcPath)) {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'))
}
