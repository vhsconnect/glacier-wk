const readline = require('readline');

function prompt(arr, cb) {
  let config = {};
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return (function questions() {
    let pair = arr.shift();
    function runEach(pair) {
      if (!pair) {
        cb(config);
        rl.close();
      } else {
        rl.question(pair[0], ans => {
          config[pair[1]] = ans;
          return questions(arr);
        });
      }
    }
    runEach(pair);
  })();
}

module.exports = prompt;
