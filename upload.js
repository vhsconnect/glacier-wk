const fs = require('fs');
const shell = require('shelljs');
const treehash = require('./treehash.js');
let u = {};

u.splitZip = function(path, constant, prefix) {
  shell.exec(`split -b ${constant} -a 4 ${path} ${prefix}`);
};

//array of start and end points in bytes of each section
u.arrayOfRanges = (constant, revolutions, fileSize) => {
  let remainder = fileSize % constant;
  let ranges = [];
  for (let i = 0; i < revolutions; i++) {
    ranges.push(i * constant);
    if (i === revolutions - 1) {
      ranges.push(i * constant + remainder - 1);
      console.log(ranges);
      return ranges;
    }
    ranges.push(i * constant + constant - 1);
  }
};

// returns array of chunk names
u.chunks = (chunksAmount, prefix) => {
  let count = 0;
  let chunkNames = [];
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      for (let k = 0; k < 26; k++) {
        for (let l = 0; l < 26; l++) {
          if (count === chunksAmount) return chunkNames;
          chunkNames.push(
            prefix + alphabet[i] + alphabet[j] + alphabet[k] + alphabet[l],
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
  console.log('calculating chunks amount');
  let chunksAmount = Math.ceil(fileSize / constant);
  console.log('splitting file for multiplart upload');
  this.splitZip(path, constant, '_u_');
  console.log('calculating ranges');
  let rangesArr = this.arrayOfRanges(Number(constant), chunksAmount, fileSize);
  let chunksArr = this.chunks(chunksAmount, '_u_');
  console.log('creating uploading commands');
  let commandList = this.cList(vault, rangesArr, chunksArr, uploadId);
  console.log('executing upload commands');
  commandList.forEach(each => shell.exec(each));
  console.log('cleaning up uploaded chunks');
  shell.exec(`find . -name '_u_*' | xargs rm`);
  console.log('splitting file to create final checksum');
  this.splitZip(path, 1048576, '_h_');
  let hChunksAmount = Math.ceil(fileSize / 1048576);
  let hChunksArr = this.chunks(hChunksAmount, '_h_');
  console.log('calculating checksum');
  return this.appendTreehash(hChunksArr, config);
};

u.pipe = function(fns, value) {
  fns.reduce((acc, each) => each(acc), value);
};

u.confirmChecksum = function(config) {
  console.log('finalizing upload, confirming checksum');
  shell.exec(
    `aws glacier complete-multipart-upload --checksum ${config.checksum} --archive-size ${config.fileSize} --upload-id ${config.uploadId} --account-id - --vault-name ${config.vault} >> archive-info.json`,
  );
};
u.cleanup = function() {
  console.log('cleaning up, archive info appended to archive-info.json');
  shell.exec(`find . -name '_h_*' | xargs rm -f`);
  shell.exec(`rm init.json`);
};

u.uploadAndConfirm = function(config) {
  this.pipe([this.runUpload, this.confirmChecksum, this.cleanup], config);
};

u.runUpload = u.runUpload.bind(u);
// u.confirmChecksum = u.confirmChecksum.bind(u);

module.exports = u;
