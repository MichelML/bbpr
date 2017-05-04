const fs = require('fs')
const shell = require('shelljs')
const paths = ['./lib/', './spec/']

paths.forEach(path => {
  fs.watch(path, {encoding: 'buffer'}, (eventType, filename) => {
    if (eventType === 'change') {
      shell.exec('npm test')
      console.log(`Test run completed on ${(new Date()).toISOString()}`)
    }
  })
})
