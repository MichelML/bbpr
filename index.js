#!/usr/bin/env node
const terminalOptions = require('./lib/terminal-options')
const configFile = require('./lib/config-file')

function bbpr () {
  if (terminalOptions.getConfigFlag() && terminalOptions.isResetConfigRequested()) {
    configFile.resetConfig()
  } else if (terminalOptions.getConfigFlag() && terminalOptions.isTailoredConfigRequested() && terminalOptions.isRemoteConfigRequested()) {
    configFile.setRemoteConfig(terminalOptions.getTailoredConfigFilePath())
  } else if (terminalOptions.getConfigFlag() && terminalOptions.isTailoredConfigRequested()) {
    configFile.setTailoredConfig(terminalOptions.getTailoredConfigFilePath())
  } else if (terminalOptions.getConfigFlag()) {
    configFile.openConfig()
  } else if (terminalOptions.getInitFlag()) {
    configFile.initializeLocalConfig()
  } else {
    require('./pull-request')()
  }
}

if (require.main === module) bbpr()

module.exports = bbpr
