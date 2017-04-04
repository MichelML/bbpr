const currentBitBuckerUser = require('../bbpr.config').user.name;
const reviewers = require('../bbpr.config').reviewers;

exports.retrieveAddedReviewers = function retrieveAddedReviewers(additionalReviewers) {
    additionalReviewers = additionalReviewers ? additionalReviewers.replace(/\s/g, '') : '';
    additionalReviewers = additionalReviewers ?
        additionalReviewers
        .split(',')
        .filter(username => reviewers.potential.indexOf(username) > -1) : [];

    return additionalReviewers;
}

exports.getAllReviewers = function getAllReviewers(additionalReviewers) {
    return reviewers.default
        .filter(username => username !== currentBitBuckerUser)
        .concat(additionalReviewers)
        .map(username => ({
            username
        }));
}
