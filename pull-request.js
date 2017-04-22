require('colors')
const co = require('co')
const vcs = require('./lib/vcs')
const outputError = require('./lib/output-error')
const pr = require('./lib/pr')
const prompt = require('./lib/prompt')
const strings = require('./lib/strings')

vcs.handleErrorsOnNonExistingVCSRepository()

function startInfoRetrieval () {
  co(function * () {
    showInfoRetrievalHeader()
    for (let promptStep of prompt.promptSteps) { yield * promptStep() }
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
    prompt.info.hasRestarted = true
    startInfoRetrieval()
  })

  prompt.pullRequestInfoEmitter.on('info:complete', () => {
    console.log(strings.preparingPullRequest.yellow.bold)
    const postRequest = pr.buildPullRequest(prompt.info)

    console.log(strings.creatingRemoteBranch.bold)
    vcs.createRemoteBranch(prompt.info)
    pr.sendPullRequest(postRequest)
  })
}
