require('colors')
const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')
const globalVars = require('./normalize-config').globalVars
const configStrings = require('./strings').config
const open = require('./open')
const path = require('path')
const prompt = require('co-prompt')
const shell = require('shelljs')
const {getConfigFlag, terminalOptionFlags} = require('./terminal-options')
const configPath = getConfigFlag() === terminalOptionFlags.configLocal ? '.' : __dirname.replace(/lib$/, '')
const configFile = path.join(configPath, 'bbpr.config.js')

function openConfig () {
  if (globalVars && globalVars.openFileCommand && typeof globalVars.openFileCommand === 'string') {
    if (shell.exec(`${globalVars.openFileCommand} ${configFile}`).stderr) {
      open(configFile)
    }
  } else {
    open(configFile)
  }
}

function resetConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(path.join(configPath, 'config_presets', 'reset.js'), configFile)
    }

    process.exit()
  })
}

function setAllTrueConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(path.join(configPath, 'config_presets', 'all-true.js'), configFile)
    }

    process.exit()
  })
}

function setTailoredConfig (pathToFile) {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(pathToFile, configFile)
    }

    process.exit()
  })
}

function setRemoteConfig (pathToFile) {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      fetch(pathToFile)
      .then(res => res.text())
      .then(resText => {
        fs.writeFileSync(configFile, resText)
        process.exit()
      })
      .catch(e => {
        console.log(e)
        process.exit(1)
      })
    }
  })
}

module.exports = {
  openConfig,
  resetConfig,
  setAllTrueConfig,
  setTailoredConfig,
  setRemoteConfig
}
