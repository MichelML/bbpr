const terminalOptionFlags = {
  config: '--c'
}

function hasConfigFlag() {
  return process.argv.indexOf(terminalOptionFlags.config) > -1
}

function isResetConfigRequested() {
  return hasConfigFlag() && process.argv[process.argv.indexOf(terminalOptionFlags.config) + 1] === 'reset'
}

module.exports = {
  hasConfigFlag,
  isResetConfigRequested
}
