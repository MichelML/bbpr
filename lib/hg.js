const outputError = require('./output-error')
const shell = require('shelljs')
const hgPath = shell.exec('hg path default', { silent: true })
const hgBranch = shell.exec('hg branch', { silent: true })
const repositoryUrl = hgPath.stdout.trim()

const getCurrentBranchName = (() => {
  let currentBranch

  return () => {
    return currentBranch || (() => {
      return hgBranch.stdout.trim()
    })()
  }
})()

const getOrganizationName = (() => {
  let organizationName

  return () => {
    return organizationName || (() => {
      return retrieveOrganizationName(repositoryUrl)
    })()
  }
})()

const getRepositoryName = (() => {
  let repositoryName

  return () => {
    return repositoryName || (() => {
      return retrieveRepositoryName(repositoryUrl)
    })()
  }
})()

const getUserName = (() => {
  let userName

  return () => {
    return userName || (() => {
      return retrieveUserName(repositoryUrl)
    })()
  }
})()

function retrieveOrganizationName (repositoryUrl) {
  const repositoryUrlWithoutRepositoryName = repositoryUrl.substr(0, repositoryUrl.lastIndexOf('/'))
  return repositoryUrlWithoutRepositoryName.substr(repositoryUrlWithoutRepositoryName.lastIndexOf('/') + 1)
}

function retrieveRepositoryName (repositoryUrl) {
  return repositoryUrl.substr(repositoryUrl.lastIndexOf('/') + 1)
}

function retrieveUserName (repositoryUrl) {
  const userNameStart = repositoryUrl.indexOf('://') + 3
  const userNameEnd = repositoryUrl.indexOf('@')
  return repositoryUrl.substr(userNameStart, userNameEnd - userNameStart)
}

function handleErrorsOnNonExistingHgRepository () {
  // hgBranch error message is more explicit, so we put it first
  if (hgBranch.stderr) outputError(hgBranch.stderr)
  if (hgPath.stderr) outputError(hgPath.stderr)
}

module.exports = {
  getCurrentBranchName,
  getOrganizationName,
  getRepositoryName,
  getUserName,
  handleErrorsOnNonExistingHgRepository
}
