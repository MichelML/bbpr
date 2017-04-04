const bitBucketUser = require('../bbpr.config').user.name;
const colors = require('colors');
const currentBranch = require('./hg').getCurrentBranchName();
const repositoryName = require('./hg').getRepositoryName();

module.exports = function presentInfoReview(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers) {
    let infoReview = '\n========PULL REQUEST SUMMARY START==========\n'.magenta;

    infoReview += `${'USERNAME:\n'.bold.cyan}${bitBucketUser}\n`;
    infoReview += `${'PASSWORD:\n'.bold.cyan}(hidden)\n`;
    infoReview += `${'CURRENT REPOSITORY:\n'.bold.cyan}${repositoryName}\n`;
    infoReview += `${'CURRENT BRANCH:\n'.bold.cyan}${currentBranch}\n`;
    infoReview += `${'DESTINATION BRANCH:\n'.bold.cyan}${destinationBranch}\n`;
    infoReview += `${'PULL REQUEST TITLE:\n'.bold.cyan}${pullRequestTitle || '(none provided)'}\n`;
    infoReview += `${'PULL REQUEST DESCRIPTION:\n'.bold.cyan}${pullRequestDescription || '(none provided)'}\n`;
    infoReview += `${'REVIEWERS:\n'.bold.cyan}${allReviewers.map(user => user.username).join('\n') || '(none provided)'}`;

    infoReview += '\n========PULL REQUEST SUMMARY END==========\n'.magenta;

    console.log(infoReview);
}
