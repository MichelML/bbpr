require('colors')
module.exports = (e) => {
  console.log('Something went wrong:'.red)
  console.log(e.message ? e.message.red : e.red)
  process.exit()
}
