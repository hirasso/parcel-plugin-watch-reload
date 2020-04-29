const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');
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
    })
    this.watcher.on('change', (path, stat) => this.onFileChange(path, "changed"))
    this.watcher.on('add', (path, stat) => this.onFileChange(path, "added"))
    this.watcher.on('unlink', (path, stat) => this.onFileChange(path, "deleted"))
  }

  /**
   * Fires if the watcher detected a file change
   * @param {*} path 
   * @param {*} type 
   */
  onFileChange( path, type = "changed" ) {
    this.emit( 'fileChangeDetected' );
    // check if we have hmr enabled first
    if( typeof ((this.bundler || {}).hmr || {}).broadcast !== 'function' ) {
      console.log(
        chalk.bold.yellow('[parcel-plugin-watch-reload] activate parcel\'s hmr to reload browsers on file change.')
      );
      return;
    }
    this.logFileChange( path, type );
    this.reloadBrowsers();
  }

  /**
   * Log file change
   * @param  string path [description]
   */
  logFileChange( path, type ) {
    console.log(chalk.bold.green(`${path} ${type}:`), 'reloading browsers...');
  }

  /**
   * Tell parcel to reload the browser
   */
  reloadBrowsers() {
    this.bundler.hmr.broadcast({
      type: 'reload'
    });
  }
}
