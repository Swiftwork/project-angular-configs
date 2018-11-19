const path = require('path');

/* DIRECTORIES */
module.exports.ROOT_DIR = process.cwd();
module.exports.CONFIG_DIR = path.resolve(process.cwd(), '.config');
module.exports.SOURCE_DIR = path.resolve(process.cwd(), 'src');
module.exports.BUILD_DIR = path.resolve(process.cwd(), 'dist');

/* VARIABLES */
module.exports.CPUS = require('os').cpus().length;
module.exports.CHUNK_ORDER = ['runtime', 'polyfill', 'vendor', 'main'];
module.exports.IS_DEV_SERVER = process.argv.find(v => v.includes('webpack-dev-server'));
module.exports.PUBLIC_PATH = module.exports.IS_DEV_SERVER ? '/' : '/wwwroot/';
