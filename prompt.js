const readline = require('readline')
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function prompt(arr, cb) {
  let config = {}
  return function q(){
    let pair = arr.shift();
    function runQ(pair) {
      if (!pair) cb(config);
      else {
        rl.question(pair[0], ans => {
          config[pair[1]] = ans;
          return q(arr);
        });
      }
    }
    runQ(pair);
    rl.close()
  }
}

module.exports = prompt
