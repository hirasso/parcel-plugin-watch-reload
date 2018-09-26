const Bundler = require('parcel-bundler');
const path = require('path');
const WatchReload = require('../lib/watch-reload');

async function setupBundler(input, options) {
  const bundler = new Bundler(input, Object.assign({
    outDir: path.join(__dirname, 'dist'),
    watch: true,
    cache: false,
    logLevel: 0,
    publicUrl: './'
  }, options));
  const watchReload = new WatchReload( bundler );
  bundler.watchReload = watchReload;
  return bundler;
}

exports.setupBundler = setupBundler;
