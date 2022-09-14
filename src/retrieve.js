const shell = require('shelljs');
const prompt = require('./prompt');
const readJSON = require('./rJson');
const { print } = require('./utils');

module.exports = function () {
  let jobId;
  const configPairs = [
    ['What is the retrieval project name\n', 'projectName'],
    ['What is the vault Name?\n', 'vault'],
    ['What would you like to call your downloaded file (include extension)\n', 'file'],
  ];

  prompt(configPairs, ({ projectName, vault, file }) => {
    try {
      jobId = readJSON(`./${projectName}/retrieval.json`).jobId;
    } catch (e) {
      print('Operation failed, did you run initRetrieval yet?');
    }
    shell.exec(
      `aws glacier get-job-output --account-id - --vault-name ${vault}  --job-id ${jobId} ${file}`
    );
  });
};
