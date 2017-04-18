require('colors')
const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')
const globalVars = require('./normalize-config').globalVars
const configStrings = require('./strings').config
const open = require('./open')
const prompt = require('co-prompt')
const shell = require('shelljs')

function openConfig () {
  if (globalVars && globalVars.openFileCommand && typeof globalVars.openFileCommand === 'string') {
    shell.exec(`${globalVars.openFileCommand} ${__dirname.replace(/lib$/, '')}/bbpr.config.js`)
  } else {
    open(`${__dirname.replace(/lib$/, '')}/bbpr.config.js`)
  }
}

function resetConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(`${__dirname.replace(/lib$/, 'config_preset')}/reset.js`, `${__dirname.replace(/lib$/, '')}/bbpr.config.js`)
    }

    process.exit()
  })
}

function setAllTrueConfig () {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(`${__dirname.replace(/lib$/, 'config_preset')}/all-true.js`, `${__dirname.replace(/lib$/, '')}/bbpr.config.js`)
    }

    process.exit()
  })
}

function setTailoredConfig (pathToFile) {
  co(function * () {
    console.log(`${configStrings.noBackup}`.yellow.bold)
    const shouldReset = yield prompt.confirm(`${configStrings.reset}`.bold)

    if (shouldReset) {
      shell.cp(pathToFile, `${__dirname.replace(/lib$/, '')}/bbpr.config.js`)
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
        fs.writeFileSync(`${__dirname.replace(/lib$/, '')}/bbpr.config.js`, resText)
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
