const terminalOptionFlags = {
  configLocal: '-l',
  configGlobal: '-g',
  init: 'init'
}

function getProcessArgV () {
  return process.argv
}

function getTailoredConfigFilePath () {
  return getProcessArgV()[getProcessArgV().indexOf(getConfigFlag()) + 1]
}

function getConfigFlag () {
  if (getProcessArgV().includes(terminalOptionFlags.configLocal)) return terminalOptionFlags.configLocal
  if (getProcessArgV().includes(terminalOptionFlags.configGlobal)) return terminalOptionFlags.configGlobal
  return ''
}

function getInitFlag () {
  return getProcessArgV().includes(terminalOptionFlags.init) || ''
}

function isResetConfigRequested () {
  return getConfigFlag() && getProcessArgV()[getProcessArgV().indexOf(getConfigFlag()) + 1] === 'reset'
}

function isAllTrueConfigRequested () {
  return getConfigFlag() && getProcessArgV()[getProcessArgV().indexOf(getConfigFlag()) + 1] === 'allTrue'
}

function isTailoredConfigRequested () {
  return getConfigFlag() && /\.js$/.test(getProcessArgV()[getProcessArgV().indexOf(getConfigFlag()) + 1])
}

function isRemoteConfigRequested () {
  const remotePath = getProcessArgV()[getProcessArgV().indexOf(getConfigFlag()) + 1]
  return getConfigFlag() && (remotePath.search(/https?:\/\//) === 0)
}

module.exports = {
  getConfigFlag,
  getInitFlag,
  getProcessArgV,
  getTailoredConfigFilePath,
  isResetConfigRequested,
  isAllTrueConfigRequested,
  isTailoredConfigRequested,
  isRemoteConfigRequested,
  terminalOptionFlags
}
