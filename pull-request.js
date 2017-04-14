require('colors')
const co = require('co')
const config = require('./bbpr.config')
const hg = require('./lib/hg')
const outputError = require('./lib/output-error')
const pr = require('./lib/pr')
const prompt = require('./lib/prompt')
const shell = require('shelljs')
const strings = require('./lib/strings')

function startInfoRetrieval () {
  co(function * () {
    showInfoRetrievalHeader()

    yield * prompt.promptUser()
    yield * prompt.promptPassword()
    yield * prompt.promptDestinationBranch()
    yield * prompt.promptTitle()
    yield * prompt.promptDescription()
    yield * prompt.promptDemo()
    yield * prompt.promptReviewers()

    yield * prompt.promptIsAllInfoCorrect()
  })
    .catch(outputError)
}

function showInfoRetrievalHeader () {
  console.log(strings.pullRequestInfoRetrieval.bold)
  console.log('(press ctrl-c to quit at any time)'.gray)
}

module.exports = function startPullRequestProcess () {
  startInfoRetrieval()
  prompt.pullRequestInfoEmitter.on('info:redo', () => {
    hasRestarted = true
    startInfoRetrieval()
  })

  prompt.pullRequestInfoEmitter.on('info:complete', () => {
    console.log(strings.preparingPullRequest.bold)
    const postRequest = pr.buildPullRequest(
      prompt.info.pullRequestTitle,
      prompt.info.pullRequestDescription,
      prompt.info.destinationBranch,
      prompt.info.allReviewers,
      prompt.info.usernameBitBucket,
      prompt.info.passwordBitBucket
    )

    console.log(strings.creatingRemoteBranch.bold)
    shell.exec(
      `hg push https://${prompt.info.usernameBitBucket}:${prompt.info.passwordBitBucket}@bitbucket.org/${config.organization.name}/${hg.getRepositoryName()} --new-branch -b ${hg.getCurrentBranchName()}`,
      () => pr.sendPullRequest(postRequest)
    )
  })
}
