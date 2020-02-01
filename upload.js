const fs = require('fs');
const shell = require('shelljs');
// const operation = 'append' || 'execute'
// let first = 0
// let constant = 1048576
// let command = `aws glacier upload-multipart-part --upload-id $UPLOADID --body chunkaa --range 'bytes 0-1048575/*'
//  --account-id - --vault-name myvault`
// let fileSize = 2901833
// let chunksAmount = Math.ceil(fileSize / constant)
// let chunksMaxAmount = 676
// let uploadID = "vFOn7Om6ENrtwFAjab8pl9BqxvRB3OLa5q85bTPVYJMS8iOOUG-7NzkCsSbvvWla_wPSw6-5oy2AKiBR7VUirjj_xkGd"
// let vault = 'vault58'
// let path = './yacht.png.zip'

let u = {};

u.splitZip = function(path, constant, os) {
  if (os === 'mac') shell.exec(`split -b ${constant} ${path}`);
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
  let chunkNames = [];
  const inner = 26;
  let outer = Math.ceil(chunksAmount / 26);
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  for (let i = 0; i < outer; i++) {
    for (let j = 0; j < inner; j++) {
      if (i * 26 + j >= chunksAmount) continue;
      chunkNames.push('x' + alphabet[i] + alphabet[j]);
    }
  }
  return chunkNames;
};

// return array of AWS commands to execute - the actual uploading
u.cList = (vaultName, ranges, chunks, uploadID) => {
  let counter = -2;
  return chunks.map(x => {
    counter = counter + 2;
    return `aws glacier upload-multipart-part --upload-id ${uploadID} --body ${x} --range 'bytes ${
      ranges[counter]
    }-${ranges[counter + 1]}/*' --account-id - --vault-name ${vaultName} `;
  });
};

u.checksumTree = arr => {
  arr
    .map((x, y) => `openssl dgst -sha256 -binary ${x} > ${'hash' + y}`)
    .forEach(x => shell.exec(x));
};

u.sumAllAndHash = function(fileSize, constant, config) {
  let modConfig = {...config};
  let checksumFile;
  let hashRefs = this.chunks(Math.ceil(fileSize / constant)).map(
    (x, y) => 'hash' + y,
  );
  let first = hashRefs.shift();
  let refs = hashRefs;
  refs.reduce((acc, each, i) => {
    shell.exec(`cat ${acc} ${each} > ${'qqq' + i}`);
    if (refs.length - 1 === i) {
      shell.exec(`openssl dgst -sha256 ${'qqq' + i} > ${'vvv' + i}`);
      checksumFile = 'vvv' + i;
      return;
    } else {
      shell.exec(`openssl dgst -sha256 -binary ${'qqq' + i} > ${'vvv' + i}`);
      return 'vvv' + i;
    }
  }, first);
  modConfig.checksumFile = checksumFile;
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
  //hash all chunks
  console.log('creating hashes');
  this.checksumTree(chunksArr);
  console.log('creating hash of concatenated hashes');
  return this.sumAllAndHash(fileSize, constant, config);
};

u.pipe = function(fns, value) {
  fns.reduce((acc, each) => each(acc), value);
};

u.confirmChecksum = function(config) {
  console.log('config', config);
  console.log('checksumFile is ', config.checksumFile);
  let archiveID = fs
    .readFileSync(config.checksumFile, 'utf-8')
    .split(' ')[1]
    .replace('\\n', '');
  shell.exec(
    `aws glacier complete-multipart-upload --checksum ${archiveID} --archive-size ${config.fileSize} --upload-id ${config.uploadId} --account-id - --vault-name ${config.vault}`
  );
};

//this will give you an archiveId
u.uploadAndConfirm = function(config) {
  this.pipe([this.runUpload, this.confirmChecksum], config);
};

u.runUpload = u.runUpload.bind(u);
u.confirmChecksum = u.confirmChecksum.bind(u);
module.exports = u;
