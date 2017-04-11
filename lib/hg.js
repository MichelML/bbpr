const fs = require('fs')
const shell = require('shelljs')
const temp = `${__dirname}/temp.txt`

const getCurrentBranchName = (() => {
  let currentBranch

  return () => {
    return currentBranch || (() => {
      writeBranchNameToTempFile()
      currentBranch = readBranchNameFromTempFile()
      shell.rm(temp)
      return currentBranch
    })()
  }
})()

const getRepositoryName = (() => {
  let repositoryName

  return () => {
    return repositoryName || (() => {
      writeRepositoryUrlToTempFile()
      repositoryName = retrieveRepositoryName(readRepositoryUrlFromTempFile())
      shell.rm(temp)
      return repositoryName
    })()
  }
})()

function writeBranchNameToTempFile () {
  shell.exec(`hg branch > ${temp}`)
}

function writeRepositoryUrlToTempFile () {
  shell.exec(`hg path default > ${temp}`)
}

function readBranchNameFromTempFile () {
  return fs.readFileSync(temp, {
    encoding: 'utf-8'
  }).trim()
}

function readRepositoryUrlFromTempFile () {
  return fs.readFileSync(temp, {
    encoding: 'utf-8'
  }).trim()
}

function retrieveRepositoryName (repositoryUrl) {
  return repositoryUrl.substr(repositoryUrl.lastIndexOf('/') + 1)
}

module.exports = {
  getCurrentBranchName,
  getRepositoryName
}
