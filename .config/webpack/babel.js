const path = require('path');

const POLYFILL_BROWSERS = require('../browsers.js');

const { ROOT_DIR } = require('./helpers');

module.exports = {
  cacheDirectory: path.join(ROOT_DIR, '.cache'),
  presets: [
    [
      '@babel/preset-env',
      {
        //debug: true,
        modules: false,
        useBuiltIns: 'usage',
        targets: POLYFILL_BROWSERS,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-class-properties'],
};
