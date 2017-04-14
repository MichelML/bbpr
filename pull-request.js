require('colors')
const co = require('co')
const config = require('./bbpr.config')
const hash = require('./lib/hash')
const hg = require('./lib/hg')
const outputError = require('./lib/output-error')
const pr = require('./lib/pr')
const presentInfoReview = require('./lib/present-info')
const prompt = require('./lib/prompt')
const reviewers = require('./lib/reviewers')
const shell = require('shelljs')
const strings = require('./lib/strings')

let additionalReviewers = []
let allReviewers
let destinationBranch
let usernameBitBucket
let passwordBitBucket
let pullRequestTitle
let pullRequestDescription
let hasRestarted = false

function startInfoRetrieval () {
  co(function * () {
    showInfoRetrievalHeader()

    yield * prompt.promptUser(usernameBitBucket)
    yield * prompt.promptPassword(passwordBitBucket, hasRestarted)
    yield * prompt.promptDestinationBranch(destinationBranch)
    yield * prompt.promptTitle(pullRequestTitle)
    yield * prompt.promptDescription(pullRequestDescription)
    yield * prompt.promptDemo(pullRequestDescription)
    yield * prompt.promptReviewers(additionalReviewers, allReviewers)

    yield * prompt.promptIsAllInfoCorrect(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, usernameBitBucket)
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
      pullRequestTitle,
      pullRequestDescription,
      destinationBranch,
      allReviewers,
      usernameBitBucket,
      passwordBitBucket
    )

    console.log(strings.creatingRemoteBranch.bold)
    shell.exec(
      `hg push https://${usernameBitBucket}:${passwordBitBucket}@bitbucket.org/${config.organization.name}/${hg.getRepositoryName()} --new-branch -b ${hg.getCurrentBranchName()}`,
      () => pr.sendPullRequest(postRequest)
    )
  })
}
