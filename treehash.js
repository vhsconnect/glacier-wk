const fs = require('fs');
const crypto = require('crypto');
module.exports = function treehash(refs) {
  let originalHashes = getHashes(refs);
  return nextLevel(originalHashes);
  function nextLevel(shaBuffers) {
    console.log('hashing');
    let newBuffs = [];
    if (shaBuffers.length === 2) return finalHash(shaBuffers);
    for (let i = 0; i < shaBuffers.length; i = i + 2) {
      if (!shaBuffers[i + 1]) {
        newBuffs.push(shaBuffers[i]);
      } else {
        let cated = Buffer.concat([shaBuffers[i], shaBuffers[i + 1]]);
        let catedAndHashed = crypto
          .createHash('sha256')
          .update(cated)
          .digest();
        newBuffs.push(catedAndHashed);
      }
    }
    return nextLevel(newBuffs);
  }
};
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
