#!/usr/bin/env node
const terminalOptions = require('./lib/terminal-options')
const configFile = require('./lib/config-file')
const shell = require('shelljs')

try {
if (terminalOptions.hasConfigFlag() && terminalOptions.isResetConfigRequested()) {
    configFile.resetConfig()
} else if (terminalOptions.hasConfigFlag()) {
    configFile.openConfig()
} else {
    require('./pull-request')()
} } catch (e) {
    
}
