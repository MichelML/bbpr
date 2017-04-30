const outputError = require('./output-error')
const shell = require('shelljs')
const fs = require('fs')
const vcs = fs.existsSync('.git') ? 'git' : (fs.existsSync('.hg') ? 'hg' : '')
const vcsPath = shell.exec(vcs === 'git' ? 'git config --get remote.origin.url' : 'hg path default', { silent: true })
const vcsBranch = shell.exec(vcs === 'git' ? 'git rev-parse --abbrev-ref HEAD' : 'hg branch', { silent: true })
const vcsPush = (info) => (vcs === 'git'
? shell.exec(`git push origin ${getCurrentBranchName()}`, { silent: true })
: shell.exec(`hg push https://${info.pullRequestAuthor}:${info.passwordBitBucket}@bitbucket.org/${info.repositoryOwner}/${getRepositoryName()} --new-branch -b ${getCurrentBranchName()}`, { silent: true }))
const repositoryUrl = vcsPath.stdout.trim()

function createRemoteBranch (info) {
  const vcsPushResult = vcsPush(info)
  if (vcsPushResult.stderr) console.log(vcsPushResult.stderr)
}

const getCurrentBranchName = (() => {
  let currentBranch

  return () => {
    return currentBranch || (() => {
      return vcsBranch.stdout.trim()
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
  // remove git extension if git repository
  return repositoryUrl.substr(repositoryUrl.lastIndexOf('/') + 1).replace(/(\.git)$/, '')
}

function retrieveUserName (repositoryUrl) {
  const userNameStart = repositoryUrl.indexOf('://') + 3
  const userNameEnd = repositoryUrl.indexOf('@')
  return repositoryUrl.substr(userNameStart, userNameEnd - userNameStart)
}

function handleErrorsOnNonExistingVCSRepository () {
  // vcsBranch error message is more explicit, so we put it first
  if (vcsBranch.stderr) outputError(vcsBranch.stderr)
  if (vcsPath.stderr) outputError(vcsPath.stderr)
}

module.exports = {
  createRemoteBranch,
  getCurrentBranchName,
  getOrganizationName,
  getRepositoryName,
  getUserName,
  handleErrorsOnNonExistingVCSRepository,
  vcs
}
