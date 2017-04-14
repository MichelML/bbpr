require('colors')
const co = require('co')
const config = require('../bbpr.config')
const crypt = require('./crypt')
const errors = require('./strings').errors
const EventEmitter = require('events')
const hg = require('./hg')
const pullRequestInfoEmitter = new EventEmitter()
const prompt = require('co-prompt')
const promptStrings = require('./strings').prompt

function * promptUser (usernameBitBucket) {
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

function * promptPassword (passwordBitBucket, hasRestarted) {
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
  } else if (!hasRestarted) {
    passwordBitBucket = crypt.decrypt(config.user.password)
  }
}

function * promptDestinationBranch (destinationBranch) {
  destinationBranch = yield prompt(promptStrings.destinationBranch.green)
  destinationBranch = destinationBranch || config.branches.dest.default
  if (!destinationBranch) {
    throw (new Error(errors.destinationBranch))
  }
}

function * promptTitle (pullRequestTitle) {
  pullRequestTitle = yield prompt(promptStrings.pullRequestTitle.green)
  pullRequestTitle = pullRequestTitle || ''
}

function * promptDescription (pullRequestDescription) {
  pullRequestDescription = yield prompt.multiline(promptStrings.pullRequestDescription.green)
  pullRequestDescription = pullRequestDescription || ''
}

function * promptDemo (pullRequestDescription) {
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

function * promptReviewers (additionalReviewers, allReviewers) {
  if (config.reviewers.potential.length) {
    let needAdditionalReviewers = yield prompt.confirm(promptStrings.needReviewers.yellow)
    if (needAdditionalReviewers) {
      console.log(promptStrings.additionalReviewers.bold + `${config.reviewers.potential.join('\n')}`)
      additionalReviewers = yield prompt(promptStrings.additionalReviewersSpecifications.green)
      additionalReviewers = reviewers.retrieveAddedReviewers(additionalReviewers)
    }
  }
  allReviewers = reviewers.getAllReviewers(additionalReviewers, usernameBitBucket)
}

function * promptIsAllInfoCorrect (destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, usernameBitBucket) {
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

module.exports = {
  promptUser,
  promptPassword,
  promptDestinationBranch,
  promptTitle,
  promptDescription,
  promptDemo,
  promptReviewers,
  promptIsAllInfoCorrect,
  pullRequestInfoEmitter
}
