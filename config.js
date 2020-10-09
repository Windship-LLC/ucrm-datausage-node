let fs = require('fs');
let configText = fs.readFileSync('config.json', 'utf8');
let config = JSON.parse(configText)
//console.log(config)
module.exports = config