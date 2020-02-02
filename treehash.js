/*
 * check if two items are in the level
 *      yes => execute hex conversion
 *      no => cat and hash until 1 or 0 items in the buffer, adding to
 */

const fs = require('fs');
const crypto = require('crypto');
function treehash(refs) {
  let originalHashes = getHashes(refs);
  return nextLevel(originalHashes);
  function nextLevel(shaBuffers) {
    console.log('Next Level achieved');
    let newBuffs = [];
    if (shaBuffers.length === 2) return finalHash(shaBuffers);
    for (let i = 0; i < shaBuffers.length; i = i + 2) {
      console.log;
      if (!shaBuffers[i + 1]) {
        console.log('one buffer left in the for loop');
        newBuffs.push(shaBuffers[i]);
        console.log(newBuffs);
      } else {
        let cated = Buffer.concat([shaBuffers[i], shaBuffers[i + 1]]);
        let catedAndHashed = crypto
          .createHash('sha256')
          .update(cated)
          .digest();
        newBuffs.push(catedAndHashed);
        console.log(newBuffs);
        // console.log(shaBuffers.length);
      }
    }
    console.log('outside the loop');
    return nextLevel(newBuffs);
  }
}
function finalHash(twoBuffers) {
  return crypto
    .createHash('sha256')
    .update(Buffer.concat(twoBuffers))
    .digest('hex');
  // .toString('hex');
}

function getHashes(refs) {
  return refs.map(fileRef => {
    let buffer = new Buffer.from(fs.readFileSync('./' + fileRef));
    let sha = crypto
      .createHash('sha256')
      .update(buffer)
      .digest();
    return sha;
  });
}

let p = treehash([
  'xaa',
  'xab',
  'xac',
  'xad',
  'xae',
  'xaf',
  'xag',
  'xah',
  'xai',
  'xaj',
  'xak',
  'xal',
  'xam',
  'xan',
  'xao',
  'xap',
  'xaq',
  'xar',
]);
console.log(p);
