#!/usr/bin/env node
require('colors')
const co = require('co')
const config = require('./bbpr.config.json')
const crypt = require('./lib/crypt')
const errors = require('./lib/strings').errors
const EventEmitter = require('events')
const hash = require('./lib/hash')
const hg = require('./lib/hg')
const outputError = require('./lib/output-error')
const pr = require('./lib/pr')
const presentInfoReview = require('./lib/present-info')
const promptStrings = require('./lib/strings').prompt
const pullRequestInfoEmitter = new EventEmitter()
const prompt = require('co-prompt')
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

startInfoRetrieval()
pullRequestInfoEmitter.on('info:redo', () => {
  hasRestarted = true
  startInfoRetrieval()
})

pullRequestInfoEmitter.on('info:complete', () => {
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

function startInfoRetrieval() {
  co(function* () {
    showInfoRetrievalHeader()

    yield* promptUser()
    yield* promptPassword()
    yield* promptDestinationBranch()
    yield* promptTitle()
    yield* promptDescription()
    yield* promptDemo()
    yield* promptReviewers()

    yield* isAllInfoCorrect()
  })
    .catch(outputError)
}

function showInfoRetrievalHeader() {
  console.log(strings.pullRequestInfoRetrieval.bold)
  console.log('(press ctrl-c to quit at any time)'.gray)
}

function* promptUser() {
  usernameBitBucket = config.user.name
  if (usernameBitBucket) {
    console.log(`${promptStrings.bitBucketUserName.green}${usernameBitBucket.bold.underline}`)
  } else {
    usernameBitBucket = yield prompt(promptStrings.bitBucketUserName.green)
    if (!usernameBitBucket) {
      throw (new Error(errors.username))
    }
  }
}

function* promptPassword() {
  if (config.user.password === null || !config.user.cachePwd) {
    passwordBitBucket = yield prompt.password(promptStrings.bitBucketPassword.green)
    if (config.user.cachePwd) {
      const pwd = crypt.crypt(passwordBitBucket)
      crypt.cachePwd(pwd)
    }
  } else if (!config.user.name && config.user.cachePwd) {
    throw (new Error(errors.cachePassword))
  } else if (config.user.cachePwd && !(typeof config.user.password === 'string')) {
    throw (new Error(errors.unknownPasswordType))
  } else {
    if (!hasRestarted) {
      passwordBitBucket = crypt.decrypt(config.user.password)
    }
  }
}

function* promptDestinationBranch() {
  destinationBranch = yield prompt(promptStrings.destinationBranch.green)
  destinationBranch = destinationBranch || config.branches.dest.default
  if (!destinationBranch) {
    throw (new Error(errors.destinationBranch))
  }
}

function* promptTitle() {
  pullRequestTitle = yield prompt(promptStrings.pullRequestTitle.green)
  pullRequestTitle = pullRequestTitle || ''
}

function* promptDescription() {
  pullRequestDescription = yield prompt.multiline(promptStrings.pullRequestDescription.green)
  pullRequestDescription = pullRequestDescription || ''
}

function* promptDemo() {
  if (config.demo.shouldPrompt) {
    let needADemo = yield prompt.confirm(promptStrings.needADemo.yellow)
    if (needADemo) {
      pullRequestDescription += pullRequestDescription ? '\n\n' : ''
      pullRequestDescription += promptStrings.demoLinkIntro

      let demoHash = yield prompt(promptStrings.demoHash.green)
      let repoNameForDemo = hg.getRepositoryName().split('-')
      repoNameForDemo = repoNameForDemo.length === 2
        ? repoNameForDemo.join('-')
        : `${repoNameForDemo[0]}-${repoNameForDemo[1][0]}${repoNameForDemo[2][0]}`

      let demoLink = `${config.demo.basePath}/${repoNameForDemo}/${hg.getCurrentBranchName()}/?dev#${demoHash ? hash.cleanHash(demoHash) : ''}`
      pullRequestDescription += demoLink

      if (config.demo.shouldPromptDescription) {
        let demoSpecifications = yield prompt.multiline(promptStrings.demoSpecifications.green)
        pullRequestDescription += demoSpecifications ? `\n\n${demoSpecifications}` : ''
      }
    }
  }
}

function* promptReviewers() {
  if (config.reviewers.potential.length) {
    let needAdditionalReviewers = yield prompt.confirm(promptStrings.needReviewers.yellow)
    if (needAdditionalReviewers) {
      console.log(promptStrings.additionalReviewers.bold + `${config.reviewers.potential.join('\n')}`)
      additionalReviewers = yield prompt(promptDescriptions.additionalReviewersSpecifications.green)
      additionalReviewers = reviewers.retrieveAddedReviewers(additionalReviewers)
    }
  }
  allReviewers = reviewers.getAllReviewers(additionalReviewers, usernameBitBucket)
}

function* isAllInfoCorrect() {
  presentInfoReview(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, usernameBitBucket)

  let isAllInfoCorrect = yield prompt.confirm(promptStrings.isAllInfoCorrect.bold.cyan)
  process.stdin.pause()
  if (!isAllInfoCorrect) {
    console.log(strings.pullRequestRestartingInfoRetrieval.gray)
    pullRequestInfoEmitter.emit('info:redo')
  } else {
    pullRequestInfoEmitter.emit('info:complete')
  }
}