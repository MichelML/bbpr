require('colors')
const str = require('./strings')
const config = require('./normalize-config')
const fetch = require('node-fetch')
const vcs = require('./vcs')
const open = require('./open')
const outputError = require('./output-error')

function sendPullRequest (postRequest) {
  console.log('Sending pull request to BitBucket remote repository...'.bold)
  fetch(postRequest.postRequestUrl, { method: 'POST', body: postRequest.postRequestJSON, headers: { 'Content-Type': 'application/json' } })
    .then((res) => res.json())
    .then((json) => {
      console.log('Pull request created successfully.'.green.bold)
      console.log('Redirecting to BitBucket...'.bold)
      setTimeout(() => open(`https://bitbucket.org/${config.organization.name}/${vcs.getRepositoryName()}/pull-requests/${json && json.id ? `${json.id}/` : ''}`), 2000)
    })
    .catch(outputError)
}

function buildPullRequest (info) {
  const postRequestJSON = getPullRequestJSON(info)
  const userNamePassword = `${info.pullRequestAuthor}:${info.passwordBitBucket}`
  const postRequestUrl = `${str.bitBucketAPIUrl.replace('{authentication}', userNamePassword)}/${info.repositoryOwner}/${vcs.getRepositoryName()}/pullrequests`

  return { postRequestUrl, postRequestJSON }
}

function getPullRequestJSON (info) {
  return JSON.stringify({
    'title': info.pullRequestTitle || '',
    'description': info.pullRequestDescription || '',
    'source': {
      'branch': {
        'name': vcs.getCurrentBranchName()
      },
      'repository': {
        'full_name': `${info.repositoryOwner}/${vcs.getRepositoryName()}`
      }
    },
    'destination': {
      'branch': {
        'name': info.destinationBranch || 'default'
      }
    },
    'reviewers': info.allReviewers,
    'close_source_branch': config.branches.source.close
  })
}

module.exports = {
  buildPullRequest,
  sendPullRequest
}
