require('colors')
const str = require('./strings')
const config = require('./normalize-config')
const fetch = require('node-fetch')
const hg = require('./hg')
const open = require('./open')
const outputError = require('./output-error')

function sendPullRequest (postRequest) {
  console.log('\nSending pull request to BitBucket remote repository...'.bold)
  fetch(postRequest.postRequestUrl, { method: 'POST', body: postRequest.postRequestJSON, headers: { 'Content-Type': 'application/json' } })
    .then((res) => res.json())
    .then((json) => {
      console.log('\nPull request created successfully.'.green.bold)
      console.log('\nRedirecting to BitBucket...\n'.bold)
      setTimeout(() => open(`https://bitbucket.org/${config.organization.name}/${hg.getRepositoryName()}/pull-requests/${json && json.id ? `${json.id}/` : ''}`), 2000)
    })
    .catch(outputError)
}

function buildPullRequest (info) {
  const postRequestJSON = getPullRequestJSON(info)
  const userNamePassword = `${info.usernameBitBucket}:${info.passwordBitBucket}`
  const postRequestUrl = `${str.bitBucketAPIUrl.replace('{authentication}', userNamePassword)}/${info.usernameBitBucketAPI}/${hg.getRepositoryName()}/pullrequests`

  return { postRequestUrl, postRequestJSON }
}

function getPullRequestJSON (info) {
  return JSON.stringify({
    'title': info.pullRequestTitle || '',
    'description': info.pullRequestDescription || '',
    'source': {
      'branch': {
        'name': hg.getCurrentBranchName()
      },
      'repository': {
        'full_name': `${info.usernameBitBucketAPI}/${hg.getRepositoryName()}`
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
