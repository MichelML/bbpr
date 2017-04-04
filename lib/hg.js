const fs = require('fs');
const shell = require('shelljs');
const temp = 'temp.txt';

exports.getCurrentBranchName = (() => {
    let currentBranch;

    return () => {
        return currentBranch ? currentBranch :
            (() => {
                shell.exec(`hg branch > ${temp}`);
                currentBranch = fs.readFileSync(temp, {
                    encoding: 'utf-8'
                }).trim();
                shell.rm(temp);
                return currentBranch;
            })();
    };
})();

exports.getRepositoryName = (() => {
    let repositoryName;

    return () => {
        return repositoryName ? repositoryName :
            (() => {
                shell.exec(`hg path default > ${temp}`);
                const repositoryUrl = fs.readFileSync(temp, {
                    encoding: 'utf-8'
                }).trim()
                repositoryName = repositoryUrl.substr(repositoryUrl.lastIndexOf('/') + 1);
                shell.rm(temp);
                return repositoryName
            })();
    };
})();
