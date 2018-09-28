const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const Path = require('path');
const { EventEmitter } = require('events');

module.exports = class WatchReload extends EventEmitter {

  constructor( bundler = false ) {
    super();
    this.bundler = bundler;
    let settings = this.getSettings();
    if( !settings.files ) {
      console.log(chalk.bold.yellow('[parcel-plugin-watch-reload]'), 'No files specified for watching');
      return;
    }
    console.log(chalk.bold.green('watching additional files:'), settings.files);
    this.files = settings.files;
    this.runWatcher();
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
      files: false
    };
  }

  /**
   * Watch out for file changes - if any, call 'reloadBrowsers'
   * @param  object bundler – the parcel instance
   */
  runWatcher() {
    this.watcher = chokidar.watch(this.files, {
      ignored: ['node_modules', 'bower_components'],
      ignoreInitial: true
    }).on('change', (path, stat) => {
      this.logFileChange( path );
      this.reloadBrowsers();
    }).on('add', (path, stat) => {
      this.logFileChange( path, "added" );
      this.reloadBrowsers();
    }).on('unlink', (path, stat) => {
      this.logFileChange( path, "deleted" );
      this.reloadBrowsers();
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
    this.emit( 'reloadBrowsers' );
    if( this.bundler ) {
      this.bundler.hmr.broadcast({
        type: 'reload'
      });
    }
  }
}
