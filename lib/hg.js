const errors = require('./strings').errors
const EventEmitter = require('events')
const fs = require('fs')
const outputError = require('./output-error')
const shell = require('shelljs')
const temp = 'temp.txt'

exports.emitter = new EventEmitter();

exports.getCurrentBranchName = (() => {
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

exports.getRepositoryName = (() => {
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
  shell.exec(`hg branch > ${temp}`);
}

function writeRepositoryUrlToTempFile () {
  shell.exec(`hg path default > ${temp}`)
}

function readBranchNameFromTempFile () {
  returnfs.readFileSync(temp, {
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
