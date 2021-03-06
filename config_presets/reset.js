module.exports = {
  user: {
    password: null, // null or String.
        // If null and cachePwd is set to true, this property will be set to the (encrypted) password you entered via the prompt for your next BBPR sessions.
        // If not null and cachePwd is set to true, it will use the encrypted password stored in this property.
        // In any other case, you will be prompted at each BBPR session to provide your BitBucket password.
    cachePwd: false // Boolean. See the password property for detailed explanation.
  },
  demo: {
    shouldPrompt: false, // Boolean. Set to true if you'll need a demo link with your PR.
    shouldPromptDescription: false, // Boolean. Set to true if you'll need a description with your demo.
    demoIntro: '', // String. Introduction appearing in your pull request description right before your demo url
    basePath: '', // String. Base path to your demo (ex. https://mydemo.com/). Provide only if needing a demo. It will be ignored otherwise.
    // You can also provide a basePath with the below path variables as such https://mydemo.com/{{repositoryName}}/{{sourceBranch}}/{{orAnyPathVariableListedBelow}}
    pathVariables: {
      repositoryName: null, // null or Function with signature (repositoryName) => String. Formatting function for repositoryName.
      repositoryOwner: null, // null or Function with signature (repositoryOwner) => String. Formatting function for repositoryOwner.
      pullRequestAuthor: null, // null or Function with signature (pullRequestAuthor) => String. Formatting function for pullRequestAuthor.
      sourceBranch: null, // null or Function with signature (sourceBranch) => String. Formatting function for sourceBranch.
      destinationBranch: null // null or Function with signature (destinationBranch) => String. Formatting function for destinationBranch.
    }
  },
  reviewers: {
    default: [], // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who are assign to reviewing your work. An empty Array is also valid.
    potential: [] // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who may be assigned to reviewing your work. An empty Array is also valid.
  },
  branches: {
    source: {
      close: true // Boolean. Set to false if you do not want your source branch to be closed after merging in the destination branch.
    },
    dest: {
      default: '' // String. Set to your main branch (ex: master or default), or the branch to which you are making PRs most often. Defaults to default for Mercurial and master for Git
    }
  },
  globalVars: {
    openFileCommand: '' // String. Your preferred terminal command to open your config file (javascript file). BBPR uses a default command according to your platform if empty.
  }
}
