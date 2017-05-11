const fs = require('fs')
const jasmine = require('./jasmine')
const paths = ['./']

function watch () {
  paths.forEach(path => {
    fs.watch(path, {encoding: 'buffer', recursive: true}, testWithJasmineOnChange)
  })
}

function testWithJasmineOnChange (eventType) {
  if (eventType === 'change') jasmine.jasmine()
}

if (require.main === module) {
  watch()
}

module.exports = {
  paths,
  testWithJasmineOnChange,
  watch
}
