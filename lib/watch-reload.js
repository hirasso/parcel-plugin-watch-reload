let pckg = {};
try { pckg = require(`${process.cwd()}/package.json`) } catch(e) { console.log( e ) }
const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const { EventEmitter } = require('events');
const userSettings = pckg.watchreload || {};

const defaultSettings = {
  files: false,
  reloadDelay: 0,
  chokidarOptions: {
    ignored: ['node_modules', 'bower_components', '.cache'],
    ignoreInitial: true
  }
};

module.exports = class WatchReload extends EventEmitter {

  constructor( bundler = false ) {
    super();
    
    this.bundler = bundler;
    this.pluginName = '[parcel-plugin-watch-reload]';
    this.reloadTimeout = null;

    // Merge defaults and userSettings
    // https://stackoverflow.com/a/34807014/586823
    this.settings = { ...defaultSettings, ...userSettings };
    
    if( !this.settings.files ) {
      console.log(chalk.bold.yellow(`${this.pluginName} No files specified for watching`));
      return;
    }
    
  }

  /**
   * Watch out for file changes - if any, call 'reloadBrowsers'
   * @param  object bundler – the parcel instance
   */
  runWatcher() {
    console.log(
      chalk.bold.green('watching additional files:'), 
      chalk.bold.yellow(this.settings.files),
      this.settings.reloadDelay ? chalk.bold.green(`(reload delay: ${this.reloadDelayString()})`) : '',
    );
    let options = {
      ...defaultSettings.chokidarOptions,
      ...this.settings.chokidarOptions || {}
    }
    this.watcher = chokidar.watch(this.settings.files, options)
    this.watcher.on('change', (path, stat) => this.onFileChange(path, "changed"))
    this.watcher.on('add', (path, stat) => this.onFileChange(path, "added"))
    this.watcher.on('unlink', (path, stat) => this.onFileChange(path, "deleted"))
  }

  /**
   * Returns a string for the reload delay
   */
  reloadDelayString() {
    return chalk.bold.yellow(`${this.settings.reloadDelay}ms`);
  }

  /**
   * Fires if the watcher detected a file change
   * @param {*} path 
   * @param {*} type 
   */
  onFileChange( path, type = "changed" ) {

    this.logFileChange( path, type );
    this.emit( 'fileChange' );

    clearTimeout( this.reloadTimeout );
    this.reloadTimeout = setTimeout(() => this.reloadBrowsers(), this.settings.reloadDelay);
    
  }

  /**
   * Log file change
   * @param  string path [description]
   */
  logFileChange( path, type ) {
    console.log(
      chalk.bold.green(`${path} ${type}: reloading browsers`), 
      this.settings.reloadDelay ? chalk.bold.green(`in ${this.reloadDelayString()}`) : '',
    )
  }

  /**
   * Tell parcel to reload the browser
   */
  reloadBrowsers() {
    this.emit( 'reloadBrowsers' );
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
