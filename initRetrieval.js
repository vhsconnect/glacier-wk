const fs = require('fs');
const readline = require('readline');
const prompt = require('./prompt.js');
const shell = require('shelljs');

const configPairs = [
  ['What is the vault name\n', 'vault'],
  ['What is the ArchiveId\n', 'archiveId'],
  ['Give a description to the Retrieval Initiation job?\n', 'desc'],
];

prompt(configPairs, config => {
  exportJSON(
    JSON.stringify({
      Type: 'archive-retrieval',
      ArchiveId: config.archiveId,
      Description: config.desc,
    }),
  );
  shell.exec(`aws glacier initiate-job --account-id - --vault-name ${config.vault} --job-parameters file://retrieveJob.json`)
});

function exportJSON(data) {
  fs.writeFileSync('retrieveJob.json', data);
}
