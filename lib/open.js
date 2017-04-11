const shell = require('shelljs')

const openCommand = (() => {
    if (process.platform === 'darwin') {
        return 'open'
    } else if (process.platform === 'win32') {
        return 'start'
    } else {
        return 'xdg-open'
    }
})()

function open(file) {
    shell.exec(`${openCommand} ${file}`)
}

module.exports = open
