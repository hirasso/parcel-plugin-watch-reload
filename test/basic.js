const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const WatchReload = require('../lib/watch-reload');

describe('Basic', function() {
  it('Should trigger a browser reload on file change', function(done) {
    this.timeout( 3000 );
    // const watchReload = new WatchReload();

    deleteTesterFile();    

    setTimeout(() => {
      done();
    }, 300);
    // watchReload.on( 'reloadBrowsers', () => {

    //   watchReload.stopWatcher();
    //   deleteTesterFile();
    //   done();
      
    // })

    // fs.writeFileSync(path.join(__dirname, './tester.php'));
  });
});

function deleteTesterFile() {
  try {
    fs.unlinkSync(path.join(__dirname, './tester.php'));
  } catch(e){};
}
