require('colors')
const co = require('co')
const config = require('./normalize-config')
const crypt = require('./crypt')
const errors = require('./strings').errors
const EventEmitter = require('events')
const presentInfoReview = require('./present-info')
const hash = require('./hash')
const hg = require('./hg')
const pullRequestInfoEmitter = new EventEmitter()
const prompt = require('co-prompt')
const promptStrings = require('./strings').prompt
const reviewers = require('./reviewers')
const strings = require('./strings')

const info = {
  additionalReviewers: [],
  allReviewers: '',
  destinationBranch: '',
  usernameBitBucketAPI: '',
  usernameBitBucket: '',
  passwordBitBucket: '',
  pullRequestTitle: '',
  pullRequestDescription: '',
  hasRestarted: false
}

function * promptUserAPI () {
  info.usernameBitBucketAPI = config.organization.name
  if (info.usernameBitBucketAPI) {
    console.log(`${promptStrings.bitBucketUserNameAPI.green}${info.usernameBitBucketAPI.bold.underline}`)
  } else {
    info.usernameBitBucketAPI = yield prompt(promptStrings.bitBucketUserNameAPI.green)
    if (!info.usernameBitBucketAPI) {
      throw (new Error(errors.usernameAPI))
    }
  }
}

function * promptUser () {
  info.usernameBitBucket = config.user.name
  if (info.usernameBitBucket) {
    console.log(`${promptStrings.bitBucketUserName.green}${info.usernameBitBucket.bold.underline}`)
  } else {
    info.usernameBitBucket = yield prompt(promptStrings.bitBucketUserName.green)
    if (!info.usernameBitBucket) {
      throw (new Error(errors.username))
    }
  }
}

function * promptPassword () {
  if ((!config.user || !config.username) && (config.user.password === null || !config.user.cachePwd)) {
    info.passwordBitBucket = yield prompt.password(promptStrings.bitBucketPassword.green)
    if (config.user && config.user.name && config.user.cachePwd) {
      const pwd = crypt.crypt(info.passwordBitBucket)
      crypt.cachePwd(pwd)
    }
  } else if (!config.user.name && config.user.cachePwd) {
    throw (new Error(errors.cachePassword))
  } else if (config.user.cachePwd && !(typeof config.user.password === 'string')) {
    throw (new Error(errors.unknownPasswordType))
  } else if (!info.hasRestarted) {
    info.passwordBitBucket = crypt.decrypt(config.user.password)
  }
}

function * promptDestinationBranch () {
  info.destinationBranch = yield prompt(promptStrings.destinationBranch.green)
  info.destinationBranc = info.destinationBranc || config.branches.dest.default
  if (!info.destinationBranc) {
    throw (new Error(errors.destinationBranch))
  }
}

function * promptTitle () {
  info.pullRequestTitle = yield prompt(promptStrings.pullRequestTitle.green)
  info.pullRequestTitle = info.pullRequestTitle || ''
}

function * promptDescription () {
  info.pullRequestDescription = yield prompt.multiline(promptStrings.pullRequestDescription.green)
  info.pullRequestDescription = info.pullRequestDescription || ''
}

function * promptDemo () {
  if (config.demo && config.demo.shouldPrompt) {
    const needADemo = yield prompt.confirm(promptStrings.needADemo.yellow)
    if (needADemo) {
      info.pullRequestDescription += info.pullRequestDescription ? '\n\n' : ''
      info.pullRequestDescription += promptStrings.demoLinkIntro

      const demoHash = yield prompt(promptStrings.demoHash.green)
      let repoNameForDemo = hg.getRepositoryName().split('-')
      repoNameForDemo = repoNameForDemo.length === 2
        ? repoNameForDemo.join('-')
        : `${repoNameForDemo[0]}-${repoNameForDemo[1][0]}${repoNameForDemo[2][0]}`

      let demoLink = `${config.demo.basePath}/${repoNameForDemo}/${hg.getCurrentBranchName()}/?dev#${demoHash ? hash.cleanHash(demoHash) : ''}`
      info.pullRequestDescription += demoLink

      if (config.demo.shouldPromptDescription) {
        const demoSpecifications = yield prompt.multiline(promptStrings.demoSpecifications.green)
        info.pullRequestDescription += demoSpecifications ? `\n\n${demoSpecifications}` : ''
      }
    }
  }
}

function * promptReviewers () {
  if (config && config.reviewers && config.reviewers.potential && config.reviewers.potential.length) {
    const needAdditionalReviewers = yield prompt.confirm(promptStrings.needReviewers.yellow)
    if (needAdditionalReviewers) {
      console.log(promptStrings.additionalReviewers.bold + `${config.reviewers.potential.join('\n')}`)
      info.additionalReviewers = yield prompt(promptStrings.additionalReviewersSpecifications.green)
      info.additionalReviewers = reviewers.retrieveAddedReviewers(info.additionalReviewers)
    }
  }
  info.allReviewers = reviewers.getAllReviewers(info.additionalReviewers, info.usernameBitBucket)
}

function * promptIsAllInfoCorrect () {
  presentInfoReview(info.destinationBranch, info.pullRequestTitle, info.pullRequestDescription, info.allReviewers, info.usernameBitBucketAPI, info.usernameBitBucket)

  const isAllInfoCorrect = yield prompt.confirm(promptStrings.isAllInfoCorrect.bold.cyan)
  process.stdin.pause()
  if (!isAllInfoCorrect) {
    console.log(strings.pullRequestRestartingInfoRetrieval.gray)
    pullRequestInfoEmitter.emit('info:redo')
  } else {
    pullRequestInfoEmitter.emit('info:complete')
  }
}

module.exports = {
  info,
  promptUserAPI,
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
