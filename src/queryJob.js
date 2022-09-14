const shell = require('shelljs');
const prompt = require('./prompt.js');
const readJSON = require('./rJson.js');

module.exports = function () {
  const configPairs = [
    ['What is the Project Name?\n', 'project'],
    ['What is the Vault Name?\n', 'vault'],
    ['What type of job are you querrying, choose 0 for inventory and 1 for download\n', 'jobType'],
  ];

  prompt(configPairs, ({ project, jobType, vault }) => {
    const file = jobType === '0' ? 'inventory-job-id.json' : '';
    const { jobId } = readJSON(`./${project}/${file}`);
    shell.exec(
      `aws glacier describe-job --vault-name ${vault} --account-id - --job-id ${jobId}`,
    );
  });
};
