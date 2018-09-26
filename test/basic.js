const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

const WatchReload = require('../lib/watch-reload');

fs.emptyDirSync( path.join(__dirname, './dist') )

function test() {
  describe('Basic', function() {
    it('Should trigger a browser reload on file change', function(done) {
      this.timeout( 5000 );
      const watchReload = new WatchReload( false );
      
      watchReload.on( 'reloadBrowsers', () => {
        watchReload.stopWatcher();
        fs.unlinkSync(path.join(__dirname, './Integration/Basic/tester.php'));
        done();
      })

      fs.writeFileSync(path.join(__dirname, './Integration/Basic/tester.php'));
    });
  });
}

test();
