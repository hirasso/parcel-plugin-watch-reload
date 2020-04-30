const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const { EventEmitter } = require('events');

module.exports = class WatchReload extends EventEmitter {

  constructor( bundler = false ) {
    super();
    
    this.bundler = bundler;
    this.pluginName = '[parcel-plugin-watch-reload]';
    this.reloadTimeout = null;

    this.settings = this.getSettings();
    this.reloadDelayString = chalk.bold.yellow(`${this.settings.reloadDelay}ms`);

    if( !this.settings.files || typeof this.settings.files !== 'string' ) {
      console.log(chalk.bold.yellow(`${this.pluginName} No files specified for watching`));
      return;
    }
    console.log(
      chalk.bold.green('watching additional files:'), 
      chalk.bold.yellow(this.settings.files),
      this.settings.reloadDelay ? chalk.bold.green(`(reload delay: ${this.reloadDelayString})`) : '',
    );

    this.runWatcher();
  }

  /**
   * Get settings from package.json
   * @return {Object} settings
   */
  getSettings() {
    let defaultSettings = {
      files: false,
      reloadDelay: 0
    };
    let userSettings = {};
    try {
      let packageJSON = fs.readJsonSync( `${process.cwd()}/package.json` );
      if( typeof packageJSON.watchreload !== 'undefined' ) {
        userSettings = packageJSON.watchreload;
      }
    } catch(e) { console.log(e) }
    // Merge defaults and userSettings
    // https://stackoverflow.com/a/34807014/586823
    let settings = { ...defaultSettings, ...userSettings };
    return settings;
  }

  /**
   * Watch out for file changes - if any, call 'reloadBrowsers'
   * @param  object bundler – the parcel instance
   */
  runWatcher() {
    this.watcher = chokidar.watch(this.settings.files, {
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
    
    clearTimeout( this.reloadTimeout );
    
    this.logFileChange( path, type );

    this.reloadTimeout = setTimeout(() => {
      this.emit( 'fileChangeDetected' );
      this.reloadBrowsers();
    }, this.settings.reloadDelay);
    
  }

  /**
   * Log file change
   * @param  string path [description]
   */
  logFileChange( path, type ) {
    console.log(
      chalk.bold.green(`${path} ${type}: reloading browsers`), 
      this.settings.reloadDelay ? chalk.bold.green(`in ${this.reloadDelayString}`) : '',
    )
  }

  /**
   * Tell parcel to reload the browser
   */
  reloadBrowsers() {
    // check if we have hmr enabled first
    if( typeof ((this.bundler || {}).hmr || {}).broadcast !== 'function' ) {
      console.log(
        chalk.bold.yellow(`${this.pluginName} activate parcel's hmr to reload browsers on file change.`)
      );
      return;
    }
    this.bundler.hmr.broadcast({
      type: 'reload'
    });
  }
}
