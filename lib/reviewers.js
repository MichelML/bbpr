const reviewers = require('../bbpr.config').reviewers;

exports.retrieveAddedReviewers = function retrieveAddedReviewers(additionalReviewers) {
    additionalReviewers = additionalReviewers ? additionalReviewers.replace(/\s/g, '') : '';
    additionalReviewers = additionalReviewers ?
        additionalReviewers
        .split(',')
        .filter(username => reviewers.potential.indexOf(username) > -1) : [];

    return additionalReviewers;
}

exports.getAllReviewers = function getAllReviewers(additionalReviewers, currentUsernameBitBucket) {
    return reviewers.default
        .filter(username => username !== currentUsernameBitBucket)
        .concat(additionalReviewers)
        .map(username => ({
            username
        }));
}
