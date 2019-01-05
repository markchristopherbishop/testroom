const { expect } = require('chai');
const getPort = require('../src/getPort');

describe('getPort', () => {
  it('should get random port number', async () => {
    const port = await getPort();
    expect(port).to.be.an('number')
  });
});
