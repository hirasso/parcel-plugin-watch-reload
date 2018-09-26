const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const WatchReload = require('../lib/watch-reload');

describe('Basic', function() {
  it('Should trigger a browser reload on file change', function(done) {
    this.timeout( 5000 );
    
    deleteTesterFile(); 

    const watchReload = new WatchReload();

    watchReload.on( 'reloadBrowsers', () => {

      watchReload.watcher.close();
      deleteTesterFile();
      done();
      
    })

    watchReload.watcher.on('ready', () => {
      fs.writeFileSync(path.join(__dirname, './tester.php'));
    })

  });
});

function deleteTesterFile() {
  let file = path.join(__dirname, './tester.php');
  if( fs.existsSync(file) ) {
    fs.unlinkSync( file );
  }
}
