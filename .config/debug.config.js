var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/* Import common configuration for debug and dist */
var commonConfig = require('./common.config.js');

module.exports = merge.smart(commonConfig, {

  entry: {
    'hmr': 'webpack-hot-middleware/client', // Optional with HMR
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          '@angularclass/hmr-loader', // Optional with HMR
          'awesome-typescript-loader',
          'angular2-template-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Optional with HMR
    new webpack.NamedModulesPlugin(), // Optional with HMR
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        styleLoader: {
          sourceMap: true,
        },
        cssLoader: {
          sourceMap: true,
        },
        postcssLoader: {
          sourceMap: true,
        },
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': `"development"`,
      },
    }),
  ],

  devServer: {
    contentBase: path.join(process.cwd(), 'build'),
    compress: true,
    hot: true, // Optional with HMR
    host: '0.0.0.0',
    port: 9200,
    disableHostCheck: true,
  },

  devtool: 'cheap-module-eval-source-map',
});
