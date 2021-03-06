const path = require('path');

/* HELPERS */
const { IS_DEV_SERVER, SOURCE_DIR, BUILD_DIR, PUBLIC_PATH } = require('./helpers');

/* PARTS */
const { Loaders } = require('./loaders');
const { Plugins } = require('./plugins');

/**
 * Exported config
 * @param {{ mode: 'development' | 'production', environment: 'local' | 'dev' | 'test' | 'acc' | 'prod' }} env Input options
 * @param {any} argv All arguments
 */
module.exports = (env, argv) => {
  // Default values
  env = Object.assign(
    {
      mode: (argv && argv.mode) || 'development',
      environment: argv && argv.mode === 'production' ? 'prod' : 'local',
    },
    env,
  );

  // Set it manually for PostCSS even though mode flag should solve this
  process.env.NODE_ENV = env.mode;

  const config = {
    mode: env.mode,

    context: path.join(SOURCE_DIR),

    devtool: false,

    entry: {
      polyfill: './polyfill.ts',
      main: './main.ts',
    },

    output: {
      path: BUILD_DIR,
      publicPath: PUBLIC_PATH,
      globalObject: 'this',
      filename: env.mode === 'production' ? '[name].[chunkhash:20].bundle.js' : '[name].bundle.js',
      chunkFilename: env.mode === 'production' ? '[name].[chunkhash:20].chunk.js' : '[name].chunk.js',
    },

    resolve: {
      alias: {
        assets: path.join(SOURCE_DIR, 'assets'),
      },
      modules: [path.join(SOURCE_DIR), 'node_modules'],
      extensions: ['.js', '.ts'],
    },

    module: {
      rules: Loaders(env),
    },

    plugins: Plugins(env),

    performance: {
      hints: false, // Larger request better for HTTP but not for HTTP/2?
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: {
            name: 'vendor',
            chunks: 'initial',
            enforce: true,
            test: (module, chunks) => {
              const moduleName = module.nameForCondition ? module.nameForCondition() : '';
              return (
                /[\\/]node_modules[\\/]/.test(moduleName) &&
                !chunks.some(({ name }) => {
                  return name === 'polyfill';
                })
              );
            },
          },
        },
      },
    },
  };

  if (IS_DEV_SERVER) {
    config.devServer = {
      contentBase: path.join(process.cwd(), 'build'),
      host: '0.0.0.0',
      port: 9200,
      compress: true,
      //noInfo: true,
      disableHostCheck: true,
      historyApiFallback: true,
      hot: env.environment === 'local',
    };
  }

  return config;
};
