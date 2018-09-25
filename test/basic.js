const assert = require('assert');
const { setupBundler } = require('./utils');
const path = require('path');
const fs = require('fs-extra');

fs.emptyDirSync( path.join(__dirname, './dist') )

function test() {
  describe('Basic', function() {
    it('Starting in watch mode', async function() {
      const bundler = await setupBundler(path.join(__dirname, './Integration/Basic/index.html'), {});
      // const bundle = await bundler.bundle();
      const server = await bundler.serve(1234);
    });
  });
}

test();
