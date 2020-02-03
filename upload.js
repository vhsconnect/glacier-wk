const fs = require('fs');
const shell = require('shelljs');
const treehash = require('./treehash.js');
let u = {};

u.splitZip = function(path, constant, os) {
  if (os === 'mac') shell.exec(`split -b ${constant} -a 4 ${path} _chunk`);
  else console.log('only work with mac right now');
};

//array of start and end points in bytes of each section
u.arrayOfRanges = (initial, range, revolutions, constant, fileSize) => {
  let ranges = [];
  let arr = [];
  let total = fileSize;
  function chunkTheArray(remainder) {
    if (remainder === 0) return;
    else if (remainder - constant > 0) {
      arr.push(constant);
      remainder = remainder - constant;
      chunkTheArray(remainder);
    } else {
      arr.push(remainder);
      return;
    }
  }
  chunkTheArray(total);
  arr.forEach((range, index) =>
    ranges.push(index * constant, index * constant + Number(range) - 1),
  );
  console.log('ranges', ranges);
  return ranges;
};

// returns array of chunk names
u.chunks = chunksAmount => {
  let count = 0;
  let chunkNames = [];
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      for (let k = 0; k < 26; k++) {
        for (let l = 0; l < 26; l++) {
          if (count === chunksAmount) return chunkNames;
          chunkNames.push(
            '_chunk' + alphabet[i] + alphabet[j] + alphabet[k] + alphabet[l],
          );
          count++;
        }
      }
    }
  }
};

// upload each chunk synchronously
u.cList = (vaultName, ranges, chunks, uploadID) => {
  let counter = -2;
  return chunks.map(x => {
    counter = counter + 2;
    return `aws glacier upload-multipart-part --upload-id ${uploadID} --body ${x} --range 'bytes ${
      ranges[counter]
    }-${ranges[counter + 1]}/*' --account-id - --vault-name ${vaultName} `;
  });
};

// compute treehash and append to config
u.appendTreehash = function(chunksArr, config) {
  let modConfig = {...config};
  modConfig.checksum = treehash(chunksArr);
  return modConfig;
};

u.runUpload = function(config) {
  const {fileSize, constant, vault, path, desc, uploadId} = config;
  console.log('calculating number of chunks');
  let chunksAmount = Math.ceil(fileSize / constant);
  console.log('splitting file to chunks');
  this.splitZip(path, constant, 'mac');
  console.log('calculating Ranges');
  let rangesArr = this.arrayOfRanges(
    0,
    constant,
    chunksAmount,
    constant,
    fileSize,
  );
  let chunksArr = this.chunks(chunksAmount);
  console.log('creating uploading commands');
  let commandList = this.cList(vault, rangesArr, chunksArr, uploadId);
  console.log('executing upload commands');
  commandList.forEach(each => shell.exec(each));
  return this.appendTreehash(chunksArr, config);
};

u.pipe = function(fns, value) {
  fns.reduce((acc, each) => each(acc), value);
};

u.confirmChecksum = function(config) {
  console.log('finalizing upload, confirming checksum');
  shell.exec(
    `aws glacier complete-multipart-upload --checksum ${config.checksum} --archive-size ${config.fileSize} --upload-id ${config.uploadId} --account-id - --vault-name ${config.vault}`,
  );
};

u.cleanup = function() {
  console.log('cleaning up');
  shell.exec(`find . -name '_chunk*' | xargs rm -f`);
  shell.exec(`rm init.json`);
};

u.uploadAndConfirm = function(config) {
  this.pipe([this.runUpload, this.confirmChecksum, this.cleanup], config);
};

u.runUpload = u.runUpload.bind(u);
// u.confirmChecksum = u.confirmChecksum.bind(u);

module.exports = u;
