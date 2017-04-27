const terminalOptionFlags = {
  configLocal: '--cl',
  configGlobal: '--cg',
  init: '--init'
}

function getTailoredConfigFilePath () {
  return process.argv[process.argv.indexOf(getConfigFlag()) + 1]
}

function getConfigFlag () {
  if (process.argv.includes(terminalOptionFlags.configLocal)) return terminalOptionFlags.configLocal
  if (process.argv.includes(terminalOptionFlags.configGlobal)) return terminalOptionFlags.configGlobal
  return ''
}

function getInitFlag () {
  return process.argv.includes(terminalOptionFlags.init) || ''
}

function isResetConfigRequested () {
  return getConfigFlag() && process.argv[process.argv.indexOf(getConfigFlag()) + 1] === 'reset'
}

function isAllTrueConfigRequested () {
  return getConfigFlag() && process.argv[process.argv.indexOf(getConfigFlag()) + 1] === 'allTrue'
}

function isTailoredConfigRequested () {
  return getConfigFlag() && /\.js$/.test(process.argv[process.argv.indexOf(getConfigFlag()) + 1])
}

function isRemoteConfigRequested () {
  const remotePath = process.argv[process.argv.indexOf(getConfigFlag()) + 1]
  return getConfigFlag() && (remotePath.search(/https?:\/\//) === 0)
}

module.exports = {
  getTailoredConfigFilePath,
  getConfigFlag,
  getInitFlag,
  isResetConfigRequested,
  isAllTrueConfigRequested,
  isTailoredConfigRequested,
  isRemoteConfigRequested,
  terminalOptionFlags
}
