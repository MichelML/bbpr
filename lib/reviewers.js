const reviewers = require('../bbpr.config').reviewers

function getAllReviewers (additionalReviewers, currentUsernameBitBucket) {
  return reviewers.default
    .filter(username => username !== currentUsernameBitBucket)
    .concat(additionalReviewers)
    .map(username => ({
      username}))
}

function retrieveAddedReviewers (additionalReviewers) {
  additionalReviewers = additionalReviewers ? additionalReviewers.replace(/\s/g, '') : ''
  additionalReviewers = additionalReviewers
    ? additionalReviewers
      .split(',')
      .filter(username => reviewers.potential.indexOf(username) > -1) : []

  return additionalReviewers
}

module.exports = {
  getAllReviewers,
  retrieveAddedReviewers
}
