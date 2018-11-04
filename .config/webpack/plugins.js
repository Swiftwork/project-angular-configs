const path = require('path');

/* HELPERS */
const { CHUNK_ORDER, ROOT_DIR, SOURCE_DIR, IS_DEV_SERVER, PUBLIC_PATH } = require('./helpers');

/* PLUGINS */
const {
  ContextReplacementPlugin,
  DefinePlugin,
  EnvironmentPlugin,
  HotModuleReplacementPlugin,
  NormalModuleReplacementPlugin,
  optimize,
  SourceMapDevToolPlugin,
} = require('webpack');
const ModuleConcatenationPlugin = optimize.ModuleConcatenationPlugin;

const { AngularCompilerPlugin } = require('@ngtools/webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('../helpers/manifest-plugin');

//------------------------------------------------------------------------------------
// PRODUCTION
//------------------------------------------------------------------------------------

ProductionPlugins = env => [
  // Allows for replacing resources that match a given RegExp with a new resource
  // Replaces debug module and mock interceptors with dummy stand-ins
  // https://webpack.js.org/plugins/normal-module-replacement-plugin/
  new NormalModuleReplacementPlugin(/(debug\.module|mock\.interceptor)$/, resource => {
    resource.request =
      './' + path.relative(resource.context, path.join(SOURCE_DIR, 'app', 'utilities', 'noop.utilities'));
  }),

  // Concatenates the scope of all your modules into one closure through "scope-hoising".
  // https://webpack.js.org/plugins/module-concatenation-plugin/
  new ModuleConcatenationPlugin(),

  // AoT compiles Angular components and modules.
  // https://github.com/angular/devkit/tree/master/packages/ngtools/webpack
  new AngularCompilerPlugin({
    mainPath: 'main.ts',
    tsConfigPath: 'src/tsconfig.app.json',
  }),

  // Uses UglifyJS v3 (`uglify-es`) to minify the JavaScript bundle
  // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
  new UglifyJsPlugin({
    test: /\.js(\?.*)?$/i,
    cache: true,
    parallel: true,
    uglifyOptions: {
      output: {
        ascii_only: true,
        comments: false,
        webkit: true,
      },
      ecma: 5,
      mangle: {
        // EVRY component resolver requires function names
        keep_fnames: true,
      },
      compress: {
        typeofs: false,
        inline: 3,
        pure_getters: true,
        passes: 3,
      },
    },
  }),
];

//------------------------------------------------------------------------------------
// DEVELOPMENT
//------------------------------------------------------------------------------------

DevelopmentPlugins = env => [
  // Enables Hot Module Replacement, otherwise known as HMR.
  // https://webpack.js.org/plugins/hot-module-replacement-plugin/
  new HotModuleReplacementPlugin(),

  // Runs TypeScript type checker on a separate process.
  // https://github.com/Realytics/fork-ts-checker-webpack-plugin/
  new ForkTsCheckerWebpackPlugin({
    tsconfig: path.join(SOURCE_DIR, 'tsconfig.app.json'),
    tslint: path.join(ROOT_DIR, 'tslint.json'),
    checkSyntacticErrors: true,
  }),

  // Enables more fine grained control of source map generation.
  // https://webpack.js.org/plugins/source-map-dev-tool-plugin/
  // TODO: understand reasoning behind this plugin
  new SourceMapDevToolPlugin({
    filename: '[file].map[query]',
    moduleFilenameTemplate: '[resource-path]',
    fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
    sourceRoot: 'webpack:///',
  }),
];

//------------------------------------------------------------------------------------
// BASE
//------------------------------------------------------------------------------------

Plugins = env =>
  [
    // The DefinePlugin allows you to create global constants which can be
    // configured at compile time.
    // https://webpack.js.org/plugins/define-plugin/
    new DefinePlugin({
      VERSION: JSON.stringify(new Date()),
    }),

    // Allows for replacing resources that match a given RegExp with a new resource
    // Replaces the debug environment with the env specified one
    // https://webpack.js.org/plugins/normal-module-replacement-plugin/
    new NormalModuleReplacementPlugin(/environments\/environment$/, resource => {
      if (env.environment === 'local') return;
      resource.request = resource.request.replace(
        `environments/environment`,
        `environments/environment.${env.environment}`,
      );
    }),

    new EnvironmentPlugin({
      PUBLIC_PATH: PUBLIC_PATH,
    }),

    // Detect circular dependencies in compiled modules.
    // https://github.com/aackerman/circular-dependency-plugin/
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
    }),

    // Context refers to a require with an expression allowing you to override the inferred information.
    // https://webpack.js.org/plugins/context-replacement-plugin/
    // TODO: Potentially removable with angular 6?
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(SOURCE_DIR),
    ),

    // Simplifies creation of HTML files to serve code bundles.
    // https://github.com/jantimon/html-webpack-plugin/
    new HtmlWebpackPlugin({
      template: './index.html',
      chunksSortMode: (left, right) => {
        let leftIndex = CHUNK_ORDER.indexOf(left.names[0]);
        let rightindex = CHUNK_ORDER.indexOf(right.names[0]);
        if (leftIndex > rightindex) return 1;
        else if (leftIndex < rightindex) return -1;
        else return 0;
      },
      xhtml: true,
    }),

    // Lightweight CSS extraction into separate files.
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      //filename: '[name].bundle.css',
      //chunkFilename: '[name].chunk.css',
      // Can server handle dynamic names?
      filename: env.mode === 'production' ? '[name].[chunkhash:20].bundle.css' : '[name].bundle.css',
      chunkFilename: env.mode === 'production' ? '[name].[chunkhash:20].chunk.css' : '[name].chunk.css',
    }),

    new CopyWebpackPlugin([{ from: 'i18n/*.json' }]),

    // Replaces build information with a progress bar
    // https://github.com/clessg/progress-bar-webpack-plugin/
    // TODO: Reduce log output before enabling
    // new ProgressBarPlugin(),
  ].concat(
    IS_DEV_SERVER
      ? [
          // DEV SERVER
        ]
      : [
          // NOT DEV SERVER
          // Generates a manifest.json file containing arrays for pre body and post body style/script files
          new ManifestPlugin({
            postOrder: CHUNK_ORDER,
          }),
        ],
    env.mode === 'production' ? ProductionPlugins(env) : DevelopmentPlugins(env),
  );

module.exports = {
  DevelopmentPlugins,
  ProductionPlugins,
  Plugins,
};
