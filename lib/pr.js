require('colors')
const str = require('./strings')
const config = require('../bbpr.config.json')
const hg = require('./hg')
const open = require('open')
const shell = require('shelljs')

exports.sendPullRequest = (postRequest) => {
  console.log('\nSending pull request to BitBucket remote repository...'.bold)
  shell.exec(postRequest, (code, stdout) => {
    const statusCode = stdout

    // on success
    if (/201/.test(statusCode)) {
      console.log('\nPull request created successfully. Redirecting to BitBucket...'.bold)
      setTimeout(() => {
        open(`https://bitbucket.org/${config.organization.name}/${hg.getRepositoryName()}/pull-requests/`)
      }, 2000)
    }

    // on fail
    else {
      console.log(`\nSomething wrong happened with your request to BitBucket. You received a ${statusCode.trim()}.\n`.red)
    }
  })
}

exports.buildPullRequest = (pullRequestTitle, pullRequestDescription, destinationBranch, allReviewers, usernameBitBucket, passwordBitBucket) => {
  const pullRequestJSON = getPullRequestJSON(pullRequestTitle, pullRequestDescription, destinationBranch, allReviewers)
  const userNamePassword = `${usernameBitBucket}:${passwordBitBucket}`
  const postRequestUrl = `${str.bitBucketAPIUrl}/${config.organization.name}/${hg.getRepositoryName()}/pullrequests`
  const postRequest = `${str.curlOptions} '${str.contentTypeJSON}' --user ${userNamePassword} ${postRequestUrl} -d '${pullRequestJSON}'`

  return postRequest
}

function getPullRequestJSON (title, description, destinationBranch, allReviewers) {
  return JSON.stringify({
    'title': title || '',
    'description': description || '',
    'source': {
      'branch': {
        'name': hg.getCurrentBranchName()
      },
      'repository': {
        'full_name': `${config.organization.name}/${hg.getRepositoryName()}`
      }
    },
    'destination': {
      'branch': {
        'name': destinationBranch || 'default'
      }
    },
    'reviewers': allReviewers,
    'close_source_branch': config.branches.source.close
  })
}
