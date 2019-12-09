const fs = require('fs')
const shell = require('shelljs')
const operation = 'append' || 'execute'
let first = 0
let constant = 1048576
let command = `aws glacier upload-multipart-part --upload-id $UPLOADID --body chunkaa --range 'bytes 0-1048575/*'
 --account-id - --vault-name myvault`
let fileSize = 2901833
let chunksAmount = Math.ceil(fileSize / constant)
let chunksMaxAmount = 676
let uploadID = "vFOn7Om6ENrtwFAjab8pl9BqxvRB3OLa5q85bTPVYJMS8iOOUG-7NzkCsSbvvWla_wPSw6-5oy2AKiBR7VUirjj_xkGd" 
let vault = 'vault58'
let path = './yacht.png.zip'

function splitZip(path, os){
  if (os === 'mac') shell.exec(`split -b ${constant} ${path}`)
  else console.log('only work with mac right now')
}

//array of start and end points in bytes of each section
function arrayOfRanges(initial, range, revolutions) {
  let ranges = []
  let arr = [];
  let total = fileSize
  function chunkTheArray(remainder){
    if (remainder === 0 ) return
    else if (remainder - constant > 0){
      arr.push(constant);
      remainder = remainder - constant;
      chunkTheArray(remainder);
    }
    else {
      arr.push(remainder);
      return
    }
  }
  chunkTheArray(total)
  arr.forEach((range, index) => ranges.push( index * constant, index * constant + range -1))
  return ranges
}


// returns array of chunk names
function chunks(chunksAmount) {
  let chunkNames = []
  const inner = 26
  let outer = Math.ceil(chunksAmount / 26)
  var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
  for (let i = 0; i < outer; i++) {
    for (let j = 0; j < inner; j++) {
      if (i * 26 + j >= chunksAmount) continue
      chunkNames.push('x' + alphabet[i] + alphabet[j])
    }
  }
  return chunkNames
}

// return array of AWS commands to execute - the actual uploading
function cList(vaultName, ranges, chunks, uploadID) {
  let counter = - 2
  return chunks.map((x) => {
    counter = counter + 2
    return (`aws glacier upload-multipart-part --upload-id ${uploadID} --body ${x} --range 'bytes ${ranges[counter]}-${ranges[counter + 1]}/*' --account-id - --vault-name ${vaultName} `)
  })
}

function appendToFile(destination, commandList) {
  commandList.forEach((x) => fs.appendFileSync(destination, x + '\n'))
}

function checksumTree(arr){
  arr.map((x,y)=> `openssl dgst -sha256 -binary ${x} > ${'hash' + y}`).forEach(x => shell.exec(x))  
}

function sumAllAndHash(){
  let stop = 0
  let hashRefs = chunks(chunksAmount).map((x,y) => 'hash' + y) 
  let first = hashRefs.shift();
  let refs = hashRefs
  refs.reduce((acc, each, i)=> {
    shell.exec(`cat ${acc} ${each} > ${'qqq' + i}`)
    if (stop === 1) shell.exec(`openssl dgst -sha256 ${'qqq' + i} > ${'vvv' + i}`) 
    else shell.exec(`openssl dgst -sha256 -binary ${'qqq' + i} > ${'vvv' + i}`)
    stop++
    return 'vvv' + i
  }, first)
}

function end(op){
  console.log('splitting file to chunks')
  splitZip(path, 'mac')
  console.log('calculating Ranges')
  let rangesArr = arrayOfRanges(0, constant, 3)
  let chunksArr = chunks(chunksAmount)
  console.log('creating uploading commands')
  let commandList = cList(vault, rangesArr, chunksArr, uploadID)
  if (op === 'append'){
    appendToFile('./testing', commandList)
  }
  console.log('executing upload commands')
  commandList.forEach(each => shell.exec(each))
  //hash all chunks
  console.log('creating hashes')
  checksumTree(chunks(chunksAmount))
  console.log('creating hash of concatenated hashes')
  sumAllAndHash()
}

end('')



