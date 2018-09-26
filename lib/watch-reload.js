const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const Path = require('path');

module.exports = class WatchReload {

  constructor( bundler ) {

    let settings = this.getSettings();
    if( !settings.files ) {
      return;
    }
    console.log(chalk.bold.green('watching additional files:'), settings.files);
    this.files = settings.files;
    this.runWatcher( bundler );
  }

  /**
   * Get settings from package.json
   * @return {Object} settings
   */
  getSettings() {
    try {
      let _package = fs.readJsonSync( `${process.cwd()}/package.json` );
      if( _package.watchreload !== undefined ) {
        return _package.watchreload;
      }
    } catch(e) { console.log(e) }
    
    return {
      watchreload: {
        files: '**/*.php'
      }
    };
  }

  /**
   * Watch out for file changes - if any, call 'reloadBrowsers'
   * @param  object bundler – the parcel instance
   */
  runWatcher( bundler ) {
    const watcher = chokidar.watch(this.files, {
      ignored: ['node_modules', 'bower_components'],
      ignoreInitial: true
    });
    watcher.on('change', (path, stat) => {
      this.logFileChange( path );
      this.reloadBrowsers( bundler );
    });
    watcher.on('add', (path, stat) => {
      this.logFileChange( path, "added" );
      this.reloadBrowsers( bundler );
    });
  }

  /**
   * Log file change
   * @param  string path [description]
   */
  logFileChange( path, type = "changed" ) {
    console.log(chalk.bold.green(`${path} ${type}:`), 'reloading browsers...');
  }

  /**
   * Tell parcel to reload the browser
   * @param  object bundler the parcel instance
   */
  reloadBrowsers( bundler ) {
    bundler.hmr.broadcast({
      type: 'reload'
    });
  }
}
