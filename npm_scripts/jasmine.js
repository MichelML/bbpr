const spawn = require('child_process').spawn

const jasmine = () => {
  const jas = spawn('node_modules/jasmine/bin/jasmine.js', [], {stdio: 'inherit'})

  process.stdout.on('data', (data) => {
    console.log(data)
  })

  process.stderr.on('data', (data) => {
    console.log(`Error: ${data}`)
  })

  jas.on('close', () => {
    console.log(`Test run completed on ${formatDate(new Date())}`)
  })
}

const formatDate = (d) => {
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDay()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const milliSeconds = d.getMilliseconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ':' + milliSeconds
}

if (require.main === module) jasmine()

module.exports = jasmine
