const terminalOptionFlags = {
  config: '--c'
}

function getTailoredConfigFilePath() {
  return process.argv[process.argv.indexOf(terminalOptionFlags.config) + 1]
}

function hasConfigFlag () {
  return process.argv.indexOf(terminalOptionFlags.config) > -1
}

function isResetConfigRequested () {
  return hasConfigFlag() && process.argv[process.argv.indexOf(terminalOptionFlags.config) + 1] === 'reset'
}

function isAllTrueConfigRequested () {
  return hasConfigFlag() && process.argv[process.argv.indexOf(terminalOptionFlags.config) + 1] === 'allTrue'
}

function isTailoredConfigRequested () {
  return hasConfigFlag() && /\.js$/.test(process.argv[process.argv.indexOf(terminalOptionFlags.config) + 1])
}

module.exports = {
  getTailoredConfigFilePath,
  hasConfigFlag,
  isResetConfigRequested,
  isAllTrueConfigRequested,
  isTailoredConfigRequested
}
