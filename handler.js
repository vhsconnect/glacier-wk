const readline = require('readline');
const initiate = require('./initiate');
const rJ = require('./rJson');
const upload = require('./upload');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {};
const configPairs = [
  ['how big is the zip file in bytes\n', 'fileSize'],
  [
    'What is the chunk size: 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648\n',
    'constant',
  ],
  [
    'What is the name of the vault, note this tool only querries your default region atm\n',
    'vault',
  ],
  ['Provide the path to the zip file\n', 'path'],
  ['give a desciption to your archive\n', 'desc'],
];

function prompt(arr) {
  let pair = arr.shift();
  function runQ(pair) {
    if (!pair) runU();
    else {
      rl.question(pair[0], ans => {
        config[pair[1]] = ans;
        return prompt(arr);
      });
    }
  }
  runQ(pair);
}

function runU() {
  initiate.init(config);
  config.uploadId = rJ('init.json').uploadId;
  upload.uploadAndConfirm(config);
  rl.close();
}

prompt(configPairs);
