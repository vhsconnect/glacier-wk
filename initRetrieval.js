const fs = require('fs');
const shell = require('shelljs');
const prompt = require('./prompt.js');


module.exports = function () {
  const configPairs = [
    ['What is the retrieval project name\n', 'projectName'],
    ['What is the vault name\n', 'vault'],
    ['What is the ArchiveId\n', 'archiveId'],
    ['Give a description to the Retrieval Initiation job?\n', 'desc'],
    ['Give a file name to export retrieval information\n', 'output'],
    [
      'Give a file name to export jobID necessary for downloading archive',
      'output2',
    ],
  ];

  prompt(configPairs, (config) => {
    fs.writeFileSync(
      `./${config.projectName}/download-request.json`,
      JSON.stringify({
        Type: 'archive-retrieval',
        ArchiveId: config.archiveId,
        Description: config.desc,
      }),
    );
    shell.exec(
      `aws glacier initiate-job --account-id - --vault-name ${config.vault} --job-parameters file://${config.projectName}/download-request.json > ./${config.projectName}/retrieval.json`,
    );
  });
};
