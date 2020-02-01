const readline = require('readline');

function prompt(arr, cb) {
  let config = {};
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return function q() {
    let pair = arr.shift();
    function runQ(pair) {
      if (!pair) {
        cb(config);
        rl.close();
      } else {
        rl.question(pair[0], ans => {
          config[pair[1]] = ans;
          return q(arr);
        });
      }
    }
  runQ(pair);
  }();
}

module.exports = prompt;
