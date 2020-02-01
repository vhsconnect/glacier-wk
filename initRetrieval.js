const fs = require('fs');
const readline = require('readline');
const prompt = require('./prompt.js');
const shell = require('shelljs');

const configPairs = [
  ['What is the vault name\n', 'vault'],
  ['What is the ArchiveId\n', 'archiveId'],
  ['Give a description to the Retrieval Initiation job?\n', 'desc'],
  ['Give a file name to export retrieval information\n', 'output'],
  [
    'Give a file name to export jobID necessary for downloading archive',
    'output2',
  ],
];

prompt(configPairs, config => {
  fs.writeFileSync(
    config.output,
    JSON.stringify({
      Type: 'archive-retrieval',
      ArchiveId: config.archiveId,
      Description: config.desc,
    }),
  );
  shell.exec(
    `aws glacier initiate-job --account-id - --vault-name ${
      config.vault
    } --job-parameters ${'file://' + config.output} > ${config.output2}`,
  );
});
