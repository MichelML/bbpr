#!/ usr/bin/env node
const fs = require('fs')

if (fs.existsSync(`./bbpr.config.js`)) {
  fs.createReadStream(`./bbpr.config.js`).pipe(fs.createWriteStream('../bbpr.backup.config.js'))
}
