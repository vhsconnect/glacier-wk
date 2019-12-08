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
let uploadID = "YGPhcwpNX4EUlf2WDpsmx1pz9jlYTQ9CmN_73zqF1pENEparnefq9elRzFiu1AgofEylWqIqP1WhfiuGis5JyMfLKRor"
let vault = 'vault58'

//array of start and end points in bytes of each section
function arrayOfRanges2(initial, range, revolutions) {
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

let checksums = []
function exe(commandList) {
  console.log(commandList)
  return commandList.forEach(each => shell.exec(each, {}, (x,y,z) => {
  checksums.push((JSON.parse(y)).checksum)
  })
  )
 // checksum function goes here  
} 

function checksumTree(arr){
  let hashed = arr.map((x,y)=> `openssl dgst -sha256 -binary ${x} > ${'hash' + y}`)
  hashed.forEach(x => shell.exec(x))  
}

async function end(op){
  let rangesArr = arrayOfRanges2(0, constant, 3)
  let chunksArr = chunks(chunksAmount)
  let commandList = cList(vault, rangesArr, chunksArr, uploadID)
  if (op === 'append'){
    appendToFile('./testing', commandList)
  }
  else exe(commandList)
}

let hashRefs = chunks(chunksAmount).map((x,y) => 'hash' + y) 

function ee(arr){
  let first = arr.shift();
  let refs = arr
  refs.reduce((acc, each, i)=> {
    shell.exec(`cat ${acc} ${each} > ${'qqq' + i}`)
    shell.exec(`openssl dgst -sha256 -binary ${'qqq' + i} > ${'vvv' + i}`)
    return 'vvv' + i
  }, first)
}
checksumTree(chunks(chunksAmount))
ee(hashRefs)
// end('')





