const fs = require('fs')
const rf = (file) => {
  return JSON.parse(fs.readFileSync(file))
}
module.exports = rf
