#!/ usr/bin/env node
const fs = require('fs')

if (fs.existsSync(`${__dirname}/../bbpr.backup.config.js`)) {
  fs.writeFileSync(`${__dirname}/bbpr.config.js`, fs.readFileSync(`${__dirname}/../bbpr.backup.config.js`, 'utf-8'))
}
