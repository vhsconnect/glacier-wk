const shell = require('shelljs');
const { print } = require('./utils');
const prompt = require('./prompt');

module.exports = function () {
  const configPairs = [
    ['What is the vault Name?\n', 'vault'],
    ['What is the archive Id\n', 'archiveId'],
  ];

  prompt(configPairs, ({ vault, archiveId }) => {
    shell.exec(
      `aws glacier delete-archive --vault-name ${vault} --account-id - --archive-id  ${archiveId} `,
      exitCode => (exitCode === 0 ? print('deleted') : print(''))
    );
  });
};
