const fs = require('fs');
const crypto = require('crypto');
const { print } = require('./utils.js')

function getHashes(refs) {
  return refs.map((fileRef) => {
    const buffer = new Buffer.from(fs.readFileSync(`./${fileRef}`)); // eslint-disable-line new-cap
    const sha = crypto
      .createHash('sha256')
      .update(buffer)
      .digest();
    return sha;
  });
}

function finalHash(twoBuffers) {
  return crypto
    .createHash('sha256')
    .update(Buffer.concat(twoBuffers))
    .digest('hex');
}

module.exports = function treehash(refs) {
  function nextLevel(shaBuffers) {
    print('hashing');
    const newBuffs = [];
    if (shaBuffers.length === 2) return finalHash(shaBuffers);
    for (let i = 0; i < shaBuffers.length; i += 2) {
      if (!shaBuffers[i + 1]) {
        newBuffs.push(shaBuffers[i]);
      } else {
        const cated = Buffer.concat([shaBuffers[i], shaBuffers[i + 1]]);
        const catedAndHashed = crypto
          .createHash('sha256')
          .update(cated)
          .digest();
        newBuffs.push(catedAndHashed);
      }
    }
    return nextLevel(newBuffs);
  }

  const originalHashes = getHashes(refs);
  return nextLevel(originalHashes);
};
