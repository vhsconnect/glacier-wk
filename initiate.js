const shell = require("shelljs");
const initiate = {};
initiate.init = function (config) {
  shell.exec(
    `aws glacier initiate-multipart-upload --account-id - --archive-description "${config.desc}" --part-size ${config.constant} --vault-name ${config.vault} > init.json`
  );
};

module.exports = initiate;
