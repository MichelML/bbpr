// specify if users should be prompted to add a demo to their PR
exports.demo = {
    shouldPrompt: true,
    shouldPromptDescription: true,
    basePath: 'https://platformdev.cloud.coveo.com/admin/feature',
};

// add the name of your organization in BitBucket
exports.organization = {
    name: 'coveord',
};

// add your bitbucket username
exports.user = {
    name: 'michelmoreaul',
}

// add default and potential reviewers
exports.reviewers = {
    default: [
        "gbergeroncoveo",
        "michelmoreaul",
        "pochretien",
        "sroy3",
        "vseguin",
    ],
    potential: [
        "acverrette",
        "alexandre_drouin",
        "jplachance",
        "ksampson",
        "marjorie_doucet",
        "rousselm4",
    ]
}

// add information related to your branches
exports.branches = {
    source: {
        close: true
    },
    dest: {
        default: 'default'
    }
}
