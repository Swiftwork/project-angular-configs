var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AotPlugin = require('@ngtools/webpack').AotPlugin;

/* Import common configuration for debug and dist */
var commonConfig = require('./common.config.js');

module.exports = merge.smart(commonConfig, {

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['@ngtools/webpack'],
      },
    ],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new AotPlugin({
      tsConfigPath: path.resolve(process.cwd(), 'tsconfig-aot.json'),
      entryModule: path.resolve(process.cwd(), 'src/app/app.module#AppModule'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        htmlLoader: { // TODO: Needed to workaround Angular's html syntax => #id [bind] (event) *ngFor
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/],
          ],
          customAttrAssign: [/\)?\]?=/],
        },
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: 4,
      },
      uglifyOptions: {
        ie8: false,
        warnings: false,
        output: {
          comments: false,
        },
        mangle: {
          keep_fnames: true,
        },
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': `"production"`,
      }
    }),
  ],
});
