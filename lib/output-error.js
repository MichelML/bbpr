require('colors')
const strings = require('./strings')

module.exports = (e) => {
  console.log(strings.somethingWentWrong.red)
  if (!e) console.log(strings.noDetailsProvided)
  else if (typeof e === 'string' || (typeof e === 'object' && typeof e.message === 'string')) console.log(e.message ? e.message.red : e.red)
  else console.log(strings.noDetailsProvided)
  process.exit()
}
