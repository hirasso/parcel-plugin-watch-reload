const watch = require('glob-watcher');
const { Asset } = require('parcel-bundler');

module.exports = class WatchReload {

  constructor( bundler ) {
    console.log("watching files in", process.cwd());
    this.files = `${process.cwd()}/**/*.php`;
    this.runWatcher( bundler );
  }
  /**
   * Watch out for php file changes - if any, call 'reloadBrowsers'
   * @param  object bundler – the parcel instance
   */
  runWatcher( bundler ) {
    const watcher = watch(this.files);
    watcher.on('change', (path, stat) => {
      this.logFileChange( path );
      this.reloadBrowsers( bundler );
    });
    watcher.on('add', (path, stat) => {
      this.logFileChange( path );
      this.reloadBrowsers( bundler );
    });
  }

  /**
   * Log file change
   * @param  string path [description]
   */
  logFileChange( path ) {
    console.log('\x1b[33m%s\x1b[0m',  `${path} changed:`, '\x1b[1mreloading browsers...');
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
