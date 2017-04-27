module.exports = {
  bitBucketAPIUrl: 'https://{authentication}@api.bitbucket.org/2.0/repositories',
  cp: 'slkdjSDFGSD-sqwerDDASKDfasdlkjasd329-982376-sdS',
  cal: 'aes192',
  config: {
    reset: 'Are you sure you want to set your configuration file to the configuration specified (y/n)?',
    configFileExists: 'You already have a configuration file. Would you like to reset it to the default configuration (y/n)?',
    initCompleted: 'bbpr initialization completed successfully.\nOpen bbpr.config.js for further configuration or run "bbpr --cl" from your terminal.',
    noBackup: 'Warning: no backup of your current configuration will be kept'
  },
  errors: {
    usernameAPI: 'Please provide a non empty and valid BitBucket user name or company name under which your repository is located.',
    username: 'Please provide a non empty and valid BitBucket user name.',
    cachePassword: 'Error. You indicated wanting to cache your password without providing a default username in your config file.',
    unknownPasswordType: 'Error. The value stored in the user password property in your config file should be set to null or type String.'
  },
  prompt: {
    bitBucketUserNameAPI: 'bitbucket repository owner: \n',
    bitBucketUserName: 'bitbucket username (pull request author): \n',
    bitBucketPassword: 'bitbucket password: \n',
    destinationBranch: 'destination branch (press enter to choose your default branch): \n',
    pullRequestTitle: 'pull request title (must be non-empty): \n',
    pullRequestDescription: 'pull request description (add an empty line to complete the description): ',
    needADemo: 'does your pull request need a demo (y/n)? ',
    demoLinkIntro: 'demo link (wait for the build to be green before reviewing and/or testing the demo):\n',
    demoHash: '\nhash pointing to your demo, press enter if none (ex: #devdailyratlab/content/sources/):\n',
    demoSpecifications: 'describe what should be tested (add an empty line to complete the description): ',
    needReviewers: 'does your pull request need additional reviewers (y/n)? ',
    additionalReviewers: '\nPotential additional reviewers by username:\n',
    additionalReviewersSpecifications: '\nadd each additional reviewer\'s username seperated with a comma (ex: firstuser,seconduser)): \n',
    isAllInfoCorrect: 'Above is your pull request summary. Is all the information correct (y/n)? '
  },
  infoReview: {
    infoReviewStart: '\n========PULL REQUEST SUMMARY START==========\n',
    usernameAPI: 'USERNAME (BitBucket API):\n',
    username: 'USERNAME (Pull Request Author):\n',
    password: 'PASSWORD:\n',
    currentRepository: 'CURRENT REPOSITORY:\n',
    currentBranch: 'CURRENT BRANCH:\n',
    destinationBranch: 'DESTINATION BRANCH:\n',
    pullRequestTitle: 'PULL REQUEST TITLE:\n',
    pullRequestDescription: 'PULL REQUEST DESCRIPTION:\n',
    reviewers: 'REVIEWERS:\n',
    infoReviewEnd: '\n========PULL REQUEST SUMMARY END==========\n',
    noneProvided: '(none provided)',
    hidden: '(hidden)'
  },
  preparingPullRequest: '\nPREPARING PULL REQUEST\n',
  pullRequestInfoRetrieval: '\nPULL REQUEST INFORMATION RETRIEVAL',
  controlCtoQuit: '(press ctrl-c to quit at any time)',
  pullRequestRestartingInfoRetrieval: '\nRESTARTING PULL REQUEST INFORMATION RETRIEVAL',
  creatingRemoteBranch: 'Making sure your current branch exists remotely...'
}
