
const WatchReload = require('./lib/watch-reload');

module.exports = bundler => {
  if( ((bundler.resolver || {}).options || {}).watch ) {
    new WatchReload( bundler );
  }
};

