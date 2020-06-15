
const WatchReload = require('./lib/watch-reload');

module.exports = bundler => {
  if( ((bundler.resolver || {}).options || {}).watch ) {
    const watchReload = new WatchReload( bundler );
    watchReload.runWatcher();
  }
};

