const { expect } = require('chai');
const u = require('../src/upload');

describe('upload.js', () => {
  describe('arrayOfRanges', () => {
    it('shoud return the right ranges w/ whole revolutions', () => {
      const constant = 5;
      const revolutions = 2;
      const fileSize = 10;
      const expected = [0, 4, 5, 9];
      const ranges = u.arrayOfRanges(constant, revolutions, fileSize);
      expect(ranges).to.eql(expected);
    });
    it('shoud return the right ranges w/ partial revolutions', () => {
      const constant = 5;
      const revolutions = 2;
      const fileSize = 7;
      const expected = [0, 4, 5, 6];
      const ranges = u.arrayOfRanges(constant, revolutions, fileSize);
      expect(ranges).to.eql(expected);
    });
  });
});
