const co = require('co');
const config = require('./bbpr.config');
const colors = require('colors');
const crypt = require('./lib/crypt');
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
let usernameBitBucket;
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
        usernameBitBucket,
        passwordBitBucket
    );

    console.log('Making sure your current branch exists remotely...'.bold);
    shell.exec(
        `hg push https://${usernameBitBucket}:${passwordBitBucket}@bitbucket.org/${config.organization.name}/${hg.getRepositoryName()} --new-branch -b ${hg.getCurrentBranchName()}`,
        () => pr.sendPullRequest(postRequest)
    );
});

function startInfoRetrieval() {
    co(function*() {
            console.log('\nPULL REQUEST INFORMATION RETRIEVAL'.bold);
            console.log('(press ctrl-c to quit at any time)'.gray);

            usernameBitBucket = config.user.name || '';
            if (usernameBitBucket) {
                console.log(`${'bitbucket username: \n'.green}${usernameBitBucket.bold.underline}`);
            } else {
                usernameBitBucket = yield prompt(`bitbucket username: \n`.green);
                if (!usernameBitBucket) {
                    throw ('Please provide a non empty and valid BitBucket user name.');
                }
            }

            if (config.user.password === null || !config.user.cachePwd) {
                passwordBitBucket = yield prompt.password(`bitbucket password: \n`.green);
                if (config.user.cachePwd) {
                    const pwd = crypt.crypt(passwordBitBucket);
                    crypt.cachePwd(pwd);
                }
            } else if (!config.user.name && config.user.cachePwd) {
                throw ('Error. You indicated wanting to cache your password without providing a default username in your config file.')
            } else if (config.user.cachePwd && !(typeof config.user.password === 'string')) {
                throw ('Error. The value stored in the user password property in your config file should be set to null or type String.')
            } else {
                passwordBitBucket = crypt.decrypt(config.user.password);
            }

            destinationBranch = yield prompt('destination branch (press enter to choose your default branch): \n'.green);
            destinationBranch = destinationBranch || config.branches.dest.default;
            if (!destinationBranch) {
                throw ('Please provide a default branch in your config file or provide a non empty destination branch.');
            }

            pullRequestTitle = yield prompt('pull request title: \n'.green);
            pullRequestTitle = pullRequestTitle || '';

            pullRequestDescription = yield prompt.multiline('pull request description (add an empty line to complete the description): '.green);
            pullRequestDescription = pullRequestDescription || '';

            if (config.demo.shouldPrompt) {
                let needADemo = yield prompt.confirm('does your pull request need a demo (y/n)? '.yellow);
                if (needADemo) {
                    pullRequestDescription += pullRequestDescription ? '\n\n' : '';
                    pullRequestDescription += `demo link (wait for the build to be green before reviewing and/or testing the demo):\n`;

                    let demoHash = yield prompt('\nhash pointing to your demo, press enter if none (ex: #devdailyratlab/content/sources/):\n'.green);
                    let repoNameForDemo = hg.getRepositoryName().split('-');
                    repoNameForDemo = repoNameForDemo.length === 2 ?
                        repoNameForDemo.join('-') :
                        `${repoNameForDemo[0]}-${repoNameForDemo[1][0]}${repoNameForDemo[2][0]}`;

                    let demoLink = `${config.demo.basePath}/${repoNameForDemo}/${hg.getCurrentBranchName()}/?dev#${demoHash ? hash.cleanHash(demoHash) : ''}`;
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
            allReviewers = reviewers.getAllReviewers(additionalReviewers, usernameBitBucket);

            // present info review to user
            presentInfoReview(destinationBranch, pullRequestTitle, pullRequestDescription, allReviewers, usernameBitBucket);

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
