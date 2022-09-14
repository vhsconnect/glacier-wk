const fs = require('fs');

const rf = file => JSON.parse(fs.readFileSync(file));
module.exports = rf;
