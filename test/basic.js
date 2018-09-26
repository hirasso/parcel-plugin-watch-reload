const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const WatchReload = require('../lib/watch-reload');

describe('Basic', function() {
  it('Should trigger a browser reload on file change', function(done) {
    this.timeout( 3000 );
    
    deleteTesterFile(); 

    const watchReload = new WatchReload();

    watchReload.on( 'reloadBrowsers', () => {

      watchReload.stopWatcher();
      deleteTesterFile();
      done();
      
    })

    setTimeout(() => {
      fs.writeFileSync(path.join(__dirname, './tester.php'));
    }, 500);
  });
});

function deleteTesterFile() {
  let file = path.join(__dirname, './tester.php');
  if( fs.existsSync(file) ) {
    fs.unlinkSync( file );
  }
}
