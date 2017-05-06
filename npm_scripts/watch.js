const fs = require('fs')
const jasmine = require('./jasmine')
const paths = ['./lib/', './spec/']

paths.forEach(path => {
  fs.watch(path, {encoding: 'buffer'}, (eventType, filename) => {
    if (eventType === 'change') {
      jasmine()
    }
  })
})
