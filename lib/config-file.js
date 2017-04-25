require('colors')
const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')
const globalVars = require('./normalize-config').globalVars
const configStrings = require('./strings').config
const open = require('./open')
const prompt = require('co-prompt')
const shell = require('shelljs')
const {getConfigFlag, terminalOptionFlags} = require('./terminal-options')
const configPath = getConfigFlag() === terminalOptionFlags.configLocal ? '.' : __dirname.replace(/lib$/, '')

function openConfig () {
  if (globalVars && globalVars.openFileCommand && typeof globalVars.openFileCommand === 'string') {
    if (shell.exec(`${globalVars.openFileCommand} ${configPath}/bbpr.config.js`).stderr) {
      open(`${configPath}/bbpr.config.js`)
    }
  } else {
    open(`${configPath}/bbpr.config.js`)
  }
}

function resetConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      copyFile(`${__dirname.replace(/lib$/, 'config_presets')}/reset.js`, `${configPath}/bbpr.config.js`)
    }

    process.exit()
  })
}

function setAllTrueConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      copyFile(`${__dirname.replace(/lib$/, 'config_presets')}/all-true.js`, `${configPath}/bbpr.config.js`)
    }

    process.exit()
  })
}

function setTailoredConfig (pathToFile) {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      copyFile(pathToFile, `${configPath}/bbpr.config.js`)
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
        fs.writeFileSync(`${configPath}/bbpr.config.js`, resText)
        process.exit()
      })
      .catch(e => {
        console.log(e)
        process.exit(1)
      })
    }
  })
}

function copyFile (src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(dest, 'utf-8'))
}

module.exports = {
  openConfig,
  resetConfig,
  setAllTrueConfig,
  setTailoredConfig,
  setRemoteConfig
}
