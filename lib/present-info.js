require('colors')
const currentBranch = require('./vcs').getCurrentBranchName()
const repositoryName = require('./vcs').getRepositoryName()
const reviewStrings = require('./strings').infoReview

function presentInfoReview (destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, repositoryOwner, pullRequestAuthor) {
  let infoReview = reviewStrings.infoReviewStart.magenta
  infoReview += `${reviewStrings.usernameAPI.bold.cyan}${repositoryOwner}\n`
  infoReview += `${reviewStrings.username.bold.cyan}${pullRequestAuthor}\n`
  infoReview += `${reviewStrings.password.bold.cyan}${reviewStrings.hidden}\n`
  infoReview += `${reviewStrings.currentRepository.bold.cyan}${repositoryName}\n`
  infoReview += `${reviewStrings.currentBranch.bold.cyan}${currentBranch}\n`
  infoReview += `${reviewStrings.destinationBranch.bold.cyan}${destinationBranch}\n`
  infoReview += `${reviewStrings.pullRequestTitle.bold.cyan}${pullRequestTitle || reviewStrings.noneProvided}\n`
  infoReview += `${reviewStrings.pullRequestDescription.bold.cyan}${pullRequestDescription || reviewStrings.noneProvided}\n`
  infoReview += `${reviewStrings.reviewers.bold.cyan}${allReviewers.map(user => user.username).join('\n') || reviewStrings.noneProvided}`
  infoReview += reviewStrings.infoReviewEnd.magenta

  console.log(infoReview)
}

module.exports = presentInfoReview
