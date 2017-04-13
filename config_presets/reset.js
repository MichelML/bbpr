module.exports = {
  'organization': {
    'name': '' // String. Add the name of your BitBucket username or your organization name under which your repository can be found (ex: michelmoreau, mycompanyid )
        // This will be used to access the proper BitBucket API path => /2.0/repositories/{will_be_utilized_here}/{repo_slug}/pullrequests
        // See https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/pullrequests#post for more info
  },
  'user': {
    'name': '', // String. Provide your BitBucket username (ex: michelmoreaul) with whic so you don't have to type it at each session.
    'password': null, // null or String.
        // If null and cachePwd is set to true, this property will be set to the (encrypted) password you entered via the prompt for your next BBPR sessions.
        // If not null and cachePwd is set to true, it will use the encrypted password stored in this property.
        // In any other case, you will be prompted at each BBPR session to provide your BitBucket password.
    'cachePwd': false // Boolean. See the password property for detailed explanation.
  },
  'demo': {
    'shouldPrompt': false, // Boolean. Set to true if you'll need a demo link with your PR.
    'shouldPromptDescription': false, // Boolean. Set to true if you'll need a description with your demo.
    'basePath': '' // String. Base path to your demo (ex. hhtps://mydemo.com/). Provide only if needing a demo. It will be ignored otherwise.
  },
  'reviewers': {
    'default': [], // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who are assign to reviewing your work. An empty Array is also valid.
    'potential': [] // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who may be assigned to reviewing your work. An empty Array is also valid.
  },
  'branches': {
    'source': {
      'close': true // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who may be assigned to reviewing your work. An empty Array is also valid.
    },
    'dest': {
      'default': 'default' // String. Set to your main branch (ex: master or default), or the branch to which you are making PRs most often.
    }
  },
  'globalVars': {
    'openFileCommand': '' // String. Your preferred terminal command to open your config file (javascript file). BBPR uses a default command according to your platform if empty.
  }
}
