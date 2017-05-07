const fs = require('fs')
const jasmine = require('./jasmine')
const paths = ['./']

paths.forEach(path => {
  fs.watch(path, {encoding: 'buffer', recursive: true}, (eventType, filename) => {
    if (eventType === 'change') jasmine()
  })
})
