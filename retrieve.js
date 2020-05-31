const readline = require("readline");
const prompt = require("./prompt.js");
const shell = require("shelljs");

let configPairs = [
  ["What is the vault Name?\n", "vault"],
  ["What is the job ID?\n", "jobId"],
];

prompt(configPairs, (config) => {
  shell.exec(
    `aws glacier get-job-output --account-id - --vault-name ${config.vault}  --job-id ${config.jobId} output.zip`
  );
});
