const Bundler = require('parcel-bundler');
const path = require('path');
const Plugin = require('../index');

async function setupBundler(input, options) {
  const bundler = new Bundler(input, Object.assign({
    outDir: path.join(__dirname, 'dist'),
    watch: true,
    cache: false,
    logLevel: 0,
    publicUrl: './'
  }, options));
  await Plugin(bundler);
  return bundler;
}

exports.setupBundler = setupBundler;
