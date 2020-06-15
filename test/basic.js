const path = require('path');
const fs = require('fs-extra');
const assert = require('assert').strict;
const WatchReload = require('../lib/watch-reload');

describe('#WatchReload()', function() {
  this.timeout( 10000 );
  
  it('Should detect a file change', function(done) {
    createWatchReloadWithSettings({
      files: '**/*.php'
    }).then(watchReload => {
      watchReload.on('fileChange', done);
      createTesterFile();
    })
  });

  it('Should allow an array for the files setting', function(done) {
    createWatchReloadWithSettings({
      files: ['**/*.php', '**/*.json']
    }).then(watchReload => {
      watchReload.on('fileChange', done);
      createTesterFile();
    })
  });

  const reloadDelay = 500;
  it(`Should trigger a browser reload after a delay of ${reloadDelay}ms`, function() {
    createWatchReloadWithSettings({
      files: '**/*.php',
      reloadDelay: reloadDelay
    }).then(watchReload => {
      let timeAtFileChange;
      watchReload.on('fileChange', () => { timeAtFileChange = Date.now() });
      watchReload.on('reloadBrowsers', () => {
        assert(Date.now() - timeAtFileChange >= reloadDelay, `reloadBrowsers is being fired after at least ${reloadDelay}ms`);
      });
      createTesterFile();
    })
  });

});

/**
 * Creates and returns a watchReload instance for testing
 * @param {object} settings 
 */
function createWatchReloadWithSettings(settings) {
  return new Promise( (resolve, reject) => {
    deleteTesterFile()

    const watchReload = new WatchReload()
    watchReload.settings = settings;
    watchReload.runWatcher()

    // add default file change hook
    watchReload.on( 'fileChange', () => {
      watchReload.watcher.close()
      deleteTesterFile()
    })
    // resolve with watchReload instance when watcher is ready
    watchReload.watcher.on('ready', () => {
      resolve(watchReload);
    })
  })
}

/**
 * Creates a tester file for watchReload to react to
 */
function createTesterFile() {
  fs.writeFileSync(path.join(__dirname, './tester.php'))
}

/**
 * Deletes the tester file
 */
function deleteTesterFile() {
  let file = path.join(__dirname, './tester.php');
  if( fs.existsSync(file) ) {
    fs.unlinkSync( file );
  }
}
