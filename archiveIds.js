const shell = require('shelljs');
const prompt = require('./prompt.js');
const readJSON = require('./rJson.js');

let jobId;

module.exports = function () {
  const configPairs = [
    ['What is the vault name?\n', 'vaultName'],
    ['What is the retrieval project name?\n', 'projectName'],
  ];


  prompt(configPairs, ({ vaultName, projectName }) => {
    try {
      jobId = readJSON(`./${projectName}/inventory-job-id.json`).jobId;
    } catch (e) {
      console.log('Have you initiated inventory retrieval yet?, did you use the correct Project name?\n', e);
    }
    shell.exec(
      `aws glacier get-job-output --account-id - --vault-name ${vaultName} --job-id ${jobId} ./${projectName}/archiveIds.json`,
    );
  });
};
