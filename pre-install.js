#!/ usr/bin/env node
const fs = require('fs')

if (fs.existsSync(`${__dirname}/bbpr.config.js`)) {
  fs.writeFileSync(`${__dirname}/../bbpr.backup.config.js`, fs.readFileSync(`${__dirname}/bbpr.config.js`, 'utf-8'))
}
