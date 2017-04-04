const co = require('co');
const config = require('./bbpr.config');
const colors = require('colors');
const emitter = require('events');
const hash = require('./lib/hash');
const hg = require('./lib/hg');
const presentInfoReview = require('./lib/present-info');
const pr = require('./lib/pr');
const pullRequestInfoEmitter = new emitter();
const prompt = require('co-prompt');
const reviewers = require('./lib/reviewers');
const shell = require('shelljs');

let additionalReviewers = [];
let allReviewers;
let destinationBranch;
let passwordBitBucket;
let pullRequestTitle;
let pullRequestDescription;

startInfoRetrieval();
pullRequestInfoEmitter.on('info:redo', startInfoRetrieval);

pullRequestInfoEmitter.on('info:complete', () => {
    console.log('\nPREPARING PULL REQUEST\n'.bold);
    const postRequest = pr.buildPullRequest(
        pullRequestTitle,
        pullRequestDescription,
        destinationBranch,
        allReviewers,
        passwordBitBucket
    );

    console.log('Making sure your current branch exists remotely...'.bold);
    shell.exec(
        `hg push https://${config.user.name}:${passwordBitBucket}@bitbucket.org/${config.organization.name}/${hg.getRepositoryName()} --new-branch -b ${hg.getCurrentBranchName()}`,
        () => pr.sendPullRequest(postRequest)
    );
});

function startInfoRetrieval() {
    co(function*() {
            console.log('\nPULL REQUEST INFORMATION RETRIEVAL'.bold);
            console.log('(press ctrl-c to quit at any time)'.gray);
	    console.log(`${'bitbucket user: \n'.green}${config.user.name.bold.underline}`);
            // prompt for password
            passwordBitBucket = yield prompt.password(`bitbucket password: \n`.green);

            // prompt for destination branch
            destinationBranch = yield prompt('destination branch (press enter to choose your default branch): \n'.green);
            destinationBranch = destinationBranch || config.branches.dest.default;
            if (!destinationBranch) {
                throw ('Please provide a default branch in your config file or provide a non empty destination branch.');
            }

            // prompt for pull request information
            pullRequestTitle = yield prompt('pull request title: \n'.green);
            pullRequestTitle = pullRequestTitle || '';

            pullRequestDescription = yield prompt.multiline('pull request description (add an empty line to complete the description): '.green);
            pullRequestDescription = pullRequestDescription || '';

            // demo handling
            if (config.demo.shouldPrompt) {
                let needADemo = yield prompt.confirm('does your pull request need a demo (y/n)? '.yellow);
                if (needADemo) {
                    pullRequestDescription += pullRequestDescription ? '\n\n' : '';
                    pullRequestDescription += `demo link (wait for the build to be green before reviewing and/or testing the demo):\n`;

                    let demoHash = yield prompt('\nhash pointing to your demo, press enter if none (ex: #devdailyratlab/content/sources/):\n'.green);
                    let demoLink = `${config.demo.basePath}/${hg.getRepositoryName()}/${hg.getCurrentBranchName()}/?dev#${demoHash ? hash.cleanHash(demoHash) : ''}`;
                    pullRequestDescription += demoLink;

                    if (config.demo.shouldPromptDescription) {
                        let demoSpecifications = yield prompt.multiline('describe what should be tested (add an empty line to complete the description): '.green);
                        pullRequestDescription += demoSpecifications ? `\n\n${demoSpecifications}` : '';
                    }
                }
            }

            // reviewers handling
            if (config.reviewers.potential.length) {
                let needAdditionalReviewers = yield prompt.confirm('does your pull request need additional reviewers (y/n)? '.yellow);
                if (needAdditionalReviewers) {
                    console.log(`\nPotential additional reviewers by username:\n`.bold + `${config.reviewers.potential.join('\n')}`);
                    additionalReviewers = yield prompt('\nadd each additional reviewer\'s username seperated with a comma (ex: firstuser,seconduser)): \n'.green);
                    additionalReviewers = reviewers.retrieveAddedReviewers(additionalReviewers);
                }
            }
            allReviewers = reviewers.getAllReviewers(additionalReviewers);

            // present info review to user
            presentInfoReview(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers);

            // prompt information confirmation
            let isAllInfoCorrect = yield prompt.confirm('Above is your pull request summary. Is all the information correct (y/n)? '.bold.cyan);
            process.stdin.pause();
            if (!isAllInfoCorrect) {
                console.log('\nRESTARTING PULL REQUEST INFORMATION RETRIEVAL'.gray);
                pullRequestInfoEmitter.emit('info:redo');
            } else {
                pullRequestInfoEmitter.emit('info:complete');
            }
        })
        .catch((e) => {
            console.log('Something went wrong:'.red);
            console.log(e.message ? e.message.red : e.red);
            process.exit();
        });
}
