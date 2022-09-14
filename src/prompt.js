const readline = require('readline');

function prompt(arr, cb) {
  const config = {};
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return (function questions() {
    const currentPair = arr.shift();
    function runEach(pair) {
      if (!pair) {
        rl.close();
        cb(config);
      } else {
        rl.question(pair[0], ans => {
          config[pair[1]] = ans;
          return questions();
        });
      }
    }
    runEach(currentPair);
  })();
}

module.exports = prompt;
