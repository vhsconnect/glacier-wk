const { expect } = require('chai');
const u = require('../upload.js');

beforeEach(() => {});
describe('upload.js', () => {
  describe('arrayOfRanges', () => {
    it('shoud return the right ranges w/ whole revolutions', () => {
      const constant = 2;
      const revolutions = 5;
      const fileSize = 9;
      const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const ranges = u.arrayOfRanges(constant, revolutions, fileSize);
      expect(ranges).to.eql(expected);
    });
    it('shoud return the right ranges w/ partial revolutions', () => {
      const constant = 5;
      const revolutions = 2;
      const fileSize = 7;
      const expected = [0, 4, 5, 7];
      const ranges = u.arrayOfRanges(constant, revolutions, fileSize);
      expect(ranges).to.eql(expected);
    });
  });
});
