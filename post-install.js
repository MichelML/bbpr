#!/ usr/bin/env node
const fs = require('fs')

if (fs.existsSync(`../bbpr.backup.config.js`)) {
  fs.createReadStream(`../bbpr.backup.config.js`).pipe(fs.createWriteStream('./bbpr.config.js'))
}
