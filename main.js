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
const presentInfoReview = require('./lib/present-info')
const pr = require('./lib/pr')
const pullRequestInfoEmitter = new EventEmitter()
const prompt = require('co-prompt')
const reviewers = require('./lib/reviewers')
const shell = require('shelljs')

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
  console.log('\nPREPARING PULL REQUEST\n'.bold)
  const postRequest = pr.buildPullRequest(
    pullRequestTitle,
    pullRequestDescription,
    destinationBranch,
    allReviewers,
    usernameBitBucket,
    passwordBitBucket
  )

  console.log('Making sure your current branch exists remotely...'.bold)
  shell.exec(
    `hg push https://${usernameBitBucket}:${passwordBitBucket}@bitbucket.org/${config.organization.name}/${hg.getRepositoryName()} --new-branch -b ${hg.getCurrentBranchName()}`,
    () => pr.sendPullRequest(postRequest)
  )
})

function startInfoRetrieval () {
  co(function * () {
    console.log('\nPULL REQUEST INFORMATION RETRIEVAL'.bold)
    console.log('(press ctrl-c to quit at any time)'.gray)

    usernameBitBucket = config.user.name || ''
    if (usernameBitBucket) {
      console.log(`${'bitbucket username: \n'.green}${usernameBitBucket.bold.underline}`)
    } else {
      usernameBitBucket = yield prompt(`bitbucket username: \n`.green)
      if (!usernameBitBucket) {
        throw (new Error(errors.username))
      }
    }

    if (config.user.password === null || !config.user.cachePwd) {
      passwordBitBucket = yield prompt.password('bitbucket password: \n'.green)
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

    destinationBranch = yield prompt('destination branch (press enter to choose your default branch): \n'.green)
    destinationBranch = destinationBranch || config.branches.dest.default
    if (!destinationBranch) {
      throw (new Error(errors.destinationBranch))
    }

    pullRequestTitle = yield prompt('pull request title: \n'.green)
    pullRequestTitle = pullRequestTitle || ''

    pullRequestDescription = yield prompt.multiline('pull request description (add an empty line to complete the description): '.green)
    pullRequestDescription = pullRequestDescription || ''

    if (config.demo.shouldPrompt) {
      let needADemo = yield prompt.confirm('does your pull request need a demo (y/n)? '.yellow)
      if (needADemo) {
        pullRequestDescription += pullRequestDescription ? '\n\n' : ''
        pullRequestDescription += `demo link (wait for the build to be green before reviewing and/or testing the demo):\n`

        let demoHash = yield prompt('\nhash pointing to your demo, press enter if none (ex: #devdailyratlab/content/sources/):\n'.green)
        let repoNameForDemo = hg.getRepositoryName().split('-')
        repoNameForDemo = repoNameForDemo.length === 2
          ? repoNameForDemo.join('-')
          : `${repoNameForDemo[0]}-${repoNameForDemo[1][0]}${repoNameForDemo[2][0]}`

        let demoLink = `${config.demo.basePath}/${repoNameForDemo}/${hg.getCurrentBranchName()}/?dev#${demoHash ? hash.cleanHash(demoHash) : ''}`
        pullRequestDescription += demoLink

        if (config.demo.shouldPromptDescription) {
          let demoSpecifications = yield prompt.multiline('describe what should be tested (add an empty line to complete the description): '.green)
          pullRequestDescription += demoSpecifications ? `\n\n${demoSpecifications}` : ''
        }
      }
    }

    // reviewers handling
    if (config.reviewers.potential.length) {
      let needAdditionalReviewers = yield prompt.confirm('does your pull request need additional reviewers (y/n)? '.yellow)
      if (needAdditionalReviewers) {
        console.log(`\nPotential additional reviewers by username:\n`.bold + `${config.reviewers.potential.join('\n')}`)
        additionalReviewers = yield prompt("\nadd each additional reviewer's username seperated with a comma (ex: firstuser,seconduser)): \n".green)
        additionalReviewers = reviewers.retrieveAddedReviewers(additionalReviewers)
      }
    }
    allReviewers = reviewers.getAllReviewers(additionalReviewers, usernameBitBucket)

    // present info review to user
    presentInfoReview(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, usernameBitBucket)

    // prompt information confirmation
    let isAllInfoCorrect = yield prompt.confirm('Above is your pull request summary. Is all the information correct (y/n)? '.bold.cyan)
    process.stdin.pause()
    if (!isAllInfoCorrect) {
      console.log('\nRESTARTING PULL REQUEST INFORMATION RETRIEVAL'.gray)
      pullRequestInfoEmitter.emit('info:redo')
    } else {
      pullRequestInfoEmitter.emit('info:complete')
    }
  })
    .catch(outputError)
}
