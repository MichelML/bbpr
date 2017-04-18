#!/usr/bin/env node
const terminalOptions = require('./lib/terminal-options')
const configFile = require('./lib/config-file')

if (terminalOptions.hasConfigFlag() && terminalOptions.isResetConfigRequested()) {
  configFile.resetConfig()
} else if (terminalOptions.hasConfigFlag() && terminalOptions.isAllTrueConfigRequested()) {
  configFile.setAllTrueConfig()
} else if (terminalOptions.hasConfigFlag() && terminalOptions.isTailoredConfigRequested() && terminalOptions.isRemoteConfigRequested()) {
  configFile.setRemoteConfig(terminalOptions.getTailoredConfigFilePath())
} else if (terminalOptions.hasConfigFlag() && terminalOptions.isTailoredConfigRequested()) {
  configFile.setTailoredConfig(terminalOptions.getTailoredConfigFilePath())
} else if (terminalOptions.hasConfigFlag()) {
  configFile.openConfig()
} else {
  require('./pull-request')()
}
