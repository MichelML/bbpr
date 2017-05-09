const reviewers = require('./normalize-config').reviewers

function getAllReviewers (additionalReviewers, currentUsernameBitBucket) {
  return reviewers.default
    .concat(additionalReviewers)
    .filter(username => username !== currentUsernameBitBucket)
    .map(username => ({username}))
}

function retrieveAddedReviewers (additionalReviewersAsString) {
  additionalReviewers = additionalReviewersAsString ? additionalReviewersAsString.replace(/\s/g, '') : ''
  additionalReviewers = additionalReviewers
    ? additionalReviewers
      .split(',')
      .filter(username => !!username && reviewers.potential.indexOf(username) > -1)
    : []

  return additionalReviewers
}

module.exports = {
  reviewers,
  getAllReviewers,
  retrieveAddedReviewers
}
