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
    unknownPasswordType: 'Error. The value stored in the user password property in your config file should be set to null or type String.',
    invalidPathVariable: 'You provided an invalid path variable for your demo. Verify your configuration file and make sure each path variable provided is valid.'
  },
  prompt: {
    repositoryOwner: 'bitbucket repository owner: \n',
    pullRequestAuthor: 'bitbucket username (pull request author): \n',
    bitBucketPassword: 'bitbucket password: \n',
    destinationBranch: 'destination branch (press enter to choose your default branch): \n',
    pullRequestTitle: 'pull request title (must be non-empty): \n',
    pullRequestDescription: 'pull request description (add an empty line to complete the description): ',
    needADemo: 'does your pull request need a demo (y/n)? ',
    demoLinkPreview: '\nhere is a preview of your current demo link:',
    demoLink: 'enter a full demo url here:\n',
    demoExtension: 'provide a url extension to your demo url if needed (or press enter to continue):\n',
    demoSpecifications: 'describe what should reviewers test in your demo (add an empty line to complete the description): ',
    needReviewers: 'does your pull request need additional reviewers (y/n)? ',
    additionalReviewers: '\nPotential additional reviewers by username:\n',
    additionalReviewersSpecifications: '\nadd each additional reviewer\'s username seperated with a comma (ex: firstuser,seconduser)): \n',
    isAllInfoCorrect: 'Above is your pull request summary. Is all the information correct (y/n)? '
  },
  infoReview: {
    infoReviewStart: '\n========PULL REQUEST SUMMARY START==========\n',
    usernameAPI: 'REPOSITORY OWNER:\n',
    username: 'PULL REQUEST AUTHOR):\n',
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
