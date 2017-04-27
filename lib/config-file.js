require('colors')
const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')
const globalVars = require('./normalize-config').globalVars
const configStrings = require('./strings').config
const open = require('./open')
const outputError = require('./output-error')
const path = require('path')
const prompt = require('co-prompt')
const shell = require('shelljs')
const {getConfigFlag, terminalOptionFlags} = require('./terminal-options')
const globalPath = __dirname.replace(/lib$/, '')
const configPath = getConfigFlag() === terminalOptionFlags.configLocal ? '.' : globalPath
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
      shell.cp(path.join(globalPath, 'config_presets', 'reset.js'), configFile)
    }

    process.exit()
  })
}

function setAllTrueConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(path.join(globalPath, 'config_presets', 'all-true.js'), configFile)
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
      .catch(outputError)
    }
  })
}

function initializeLocalConfig () {
  if (fs.existsSync(path.join('.', 'bbpr.config.js'))) {
    co(function * () {
      const shouldReset = yield prompt.confirm(`${configStrings.configFileExists}`.bold)

      if (shouldReset) {
        shell.cp(path.join(globalPath, 'config_presets', 'reset.js'), './bbpr.config.js')
        console.log(configStrings.initCompleted.green)
      }
      process.exit()
    })
  } else {
    shell.cp(path.join(globalPath, 'config_presets', 'reset.js'), './bbpr.config.js')
    console.log(configStrings.initCompleted.green)
  }
}

module.exports = {
  initializeLocalConfig,
  openConfig,
  resetConfig,
  setAllTrueConfig,
  setTailoredConfig,
  setRemoteConfig
}
