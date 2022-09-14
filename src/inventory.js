const shell = require('shelljs');
const prompt = require('./prompt.js');

module.exports = function () {
  const configPairs = [
    ['What is the vault name\n', 'vaultName'],
    [
      'Select a project name for retrieval, this creates a directory with that name to store your retrieval information\n',
      'project',
    ],
  ];

  prompt(configPairs, ({ vaultName, project }) => {
    shell.mkdir(project);
    shell.exec(`
aws glacier initiate-job --account-id - --vault-name ${vaultName} --job-parameters '{"Type": "inventory-retrieval"}' > ./${project}/inventory-job-id.json
`);
  });
};
