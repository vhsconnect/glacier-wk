const readline = require('readline');

function prompt(arr, cb) {
  const config = {};
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log('setting up');
  return (function questions() {
    const currentPair = arr.shift();
    function runEach(pair) {
      if (!pair) {
        rl.close();
        cb(config);
      } else {
        console.log('in else about to ask');
        rl.question(pair[0], (ans) => {
          config[pair[1]] = ans;
          return questions();
        });
      }
    }
    console.log('about to start runEach');
    runEach(currentPair);
  }());
}

module.exports = prompt;
