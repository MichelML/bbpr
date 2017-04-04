// REQUIRED ENTRIES. The organization name must absolutely be provided by the user.
exports.organization = {
    name: '', // String. Add the name of your organization in BitBucket (ex: mycompanyid )  
};

// OPTIONAL ENTRIES. Change or leave defaults.
exports.user = {
    name: '', // String. Provide your BitBucket username (ex: michelmoreaul) so you don't have to type it at each session.
};

exports.demo = {
    shouldPrompt: false, // Boolean. Set to true if you'll need a demo link with your PR.
    shouldPromptDescription: false, // Boolean. Set to true if you'll need a description with your demo.
    basePath: '', // String. Base path to your demo (ex. hhtps://mydemo.com/). Provide only if needing a demo. It will be ignored otherwise.
};

exports.reviewers = {
    default: [], // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who are assign to reviewing your work. An empty Array is also valid. 
    potential: [] // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who may be assigned to reviewing your work. An empty Array is also valid.
};

exports.branches = {
    source: {
        close: true // Boolean. Set to false if you do not want to close your source branch when you merge your PR.
    },
    dest: {
        default: 'default' // String. Set to your main branch (ex: master or default), or the branch to which you are making PRs most often.
    }
};
