require('colors')
const co = require('co')
const config = require('./normalize-config')
const crypt = require('./crypt')
const errors = require('./strings').errors
const EventEmitter = require('events')
const presentInfoReview = require('./present-info')
const vcs = require('./vcs')
const outputError = require('./output-error')
const pullRequestInfoEmitter = new EventEmitter()
const prompt = require('co-prompt')
const promptStrings = require('./strings').prompt
const reviewers = require('./reviewers')
const strings = require('./strings')

const info = {
  sourceBranch: vcs.getCurrentBranchName(),
  additionalReviewers: [],
  allReviewers: '',
  destinationBranch: '',
  repositoryOwner: '',
  repositoryName: vcs.getRepositoryName(),
  pullRequestAuthor: '',
  passwordBitBucket: '',
  pullRequestTitle: '',
  pullRequestDescription: '',
  hasRestarted: false
}

function getAllowedPathVariables (info) {
  const allowedPathVariables = ['sourceBranch', 'destinationBranch', 'pullRequestAuthor', 'repositoryOwner', 'repositoryName']
  return Object.keys(info).reduce((allowedPathVars, key) => {
    if (allowedPathVariables.indexOf(key) > -1) allowedPathVars[key] = info[key]
    return allowedPathVars
  }, {})
}

function * promptUserAPI () {
  info.repositoryOwner = config.organization.name
  if (info.repositoryOwner) {
    console.log(`${promptStrings.pullRequestAuthor.green}${info.repositoryOwner.bold.underline}`)
  } else {
    info.repositoryOwner = yield prompt(promptStrings.pullRequestAuthor.green)
    if (!info.repositoryOwner) {
      throw (new Error(errors.usernameAPI))
    }
  }
}

function * promptUser () {
  info.pullRequestAuthor = config.user.name
  if (info.pullRequestAuthor) {
    console.log(`${promptStrings.pullRequestAuthor.green}${info.pullRequestAuthor.bold.underline}`)
  } else {
    info.pullRequestAuthor = yield prompt(promptStrings.pullRequestAuthor.green)
    if (!info.pullRequestAuthor) {
      throw (new Error(errors.username))
    }
  }
}

function * promptPassword () {
  if ((!config.user || !config.username) && (config.user.password === null || !config.user.cachePwd)) {
    info.passwordBitBucket = yield prompt.password(promptStrings.bitBucketPassword.green)
    if (config.user && config.user.cachePwd) {
      const pwd = crypt.crypt(info.passwordBitBucket)
      crypt.cachePwd(pwd)
    }
  } else if (config.user.cachePwd && !(typeof config.user.password === 'string')) {
    throw (new Error(errors.unknownPasswordType))
  } else if (!info.hasRestarted) {
    info.passwordBitBucket = crypt.decrypt(config.user.password)
  }
}

function * promptDestinationBranch () {
  info.destinationBranch = yield prompt(promptStrings.destinationBranch.green)
  info.destinationBranch = info.destinationBranch || config.branches.dest.default
}

function * promptTitle () {
  info.pullRequestTitle = yield prompt(promptStrings.pullRequestTitle.green)
  if (!info.pullRequestTitle) yield * promptTitle()
}

function * promptDescription () {
  info.pullRequestDescription = yield prompt.multiline(promptStrings.pullRequestDescription.green)
  info.pullRequestDescription = info.pullRequestDescription || ''
}
function * promptDemo () {
  if (config.demo && config.demo.shouldPrompt) {
    const needADemo = yield prompt.confirm(promptStrings.needADemo.yellow)
    if (needADemo) {
      info.pullRequestDescription += info.pullRequestDescription ? `\n\n${config.demo.demoIntro || ''}` : (config.demo.demoIntro || '')

      let demoLink
      if (!config.demo.basePath) {
        demoLink = yield prompt(promptStrings.demoLink.green)
      } else {
        demoLink = insertPathVariablesInDemoPath(config.demo.pathVariables, info, config.demo.basePath)
        console.log(promptStrings.demoLinkPreview.bold.gray)
        console.log(demoLink.bold, '\n')
        const demoExtension = yield prompt(promptStrings.demoExtension.green)
        demoLink = `${demoLink}${demoExtension}`
      }
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
  info.allReviewers = reviewers.getAllReviewers(info.additionalReviewers, info.pullRequestAuthor)
}

function * promptIsAllInfoCorrect () {
  presentInfoReview(info.destinationBranch, info.pullRequestTitle, info.pullRequestDescription, info.allReviewers, info.repositoryOwner, info.pullRequestAuthor)

  const isAllInfoCorrect = yield prompt.confirm(promptStrings.isAllInfoCorrect.bold.cyan)
  process.stdin.pause()
  if (!isAllInfoCorrect) {
    console.log(strings.pullRequestRestartingInfoRetrieval.gray)
    pullRequestInfoEmitter.emit('info:redo')
  } else {
    pullRequestInfoEmitter.emit('info:complete')
  }
}

function isValidPathVariable (pathVariable, pathVariableName, info) {
  if (!!pathVariable && getAllowedPathVariables(info)[pathVariableName]) {
    if (typeof pathVariable === 'function' && typeof pathVariable(pathVariableName) === 'string') return true
    return outputError(strings.errors.invalidPathVariable)
  }
  return false
}

function insertPathVariablesInDemoPath (pathVariables, info, demoLink) {
  return Object.keys(getAllowedPathVariables(info)).reduce((demoLinkFinal, pathVariableName) => {
    if (isValidPathVariable(pathVariables[pathVariableName], pathVariableName, info)) {
      return demoLinkFinal.replace(`{{${pathVariableName}}}`, pathVariables[pathVariableName](info[pathVariableName]))
    } else {
      return demoLinkFinal.replace(`{{${pathVariableName}}}`, info[pathVariableName])
    }
  }, demoLink)
}

const promptSteps = [
  promptUserAPI,
  promptUser,
  promptPassword,
  promptDestinationBranch,
  promptTitle,
  promptDescription,
  promptDemo,
  promptReviewers,
  promptIsAllInfoCorrect
]

module.exports = {
  info,
  promptSteps,
  pullRequestInfoEmitter
}
