const AUTOPREFIXER_BROWSERS = require('../browsers');

const noop = () => {};

module.exports = ({ file, options, env }) => {
  const browsers = options.browsers || AUTOPREFIXER_BROWSERS;
  const variables = typeof options.variables === 'function' ? options.variables() : options.variables || {};
  const media = typeof options.media === 'function' ? options.media() : options.media || noop;
  const mixins = typeof options.mixins === 'function' ? options.mixins() : options.mixins || noop;
  return {
    plugins: [
      // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
      // https://github.com/postcss/postcss-import
      require('postcss-import')({
        path: 'src/',
        addModulesDirectories: ['node_modules'],
        resolve: (id, basedir, importOptions) => {
          return id.charAt(0) === '/'
            ? importOptions.path.map(path => {
                return path + id;
              })
            : id;
        },
      }),

      // Simple template to prevent repeating code, e.g. @define-mixin headline $size { font-size: $size; } span { @mixin headline 32px; }
      // https://github.com/postcss/postcss-mixins
      require('postcss-mixins')({ mixins: mixins(variables) }),

      // Enables @for loop syntax, e.g. @for $i from 1 to 12 { .a-$i { width: calc(100% / 12 * $i) } }
      // https://github.com/xori/postcss-for
      require('postcss-for')(),

      // Sass like variables, e.g. $color: #f00; div { background: $color; }
      // https://github.com/postcss/postcss-simple-vars
      // require('postcss-simple-vars')({ variables: variables }),

      // W3C CSS Custom Properties for cascading variables, e.g. --color: #f00; div { background: var(--color); }
      // https://github.com/postcss/postcss-custom-properties
      require('postcss-custom-properties')({
        preserve: false,
        importFrom: { customProperties: variables },
      }),

      // Enables @if statements, e.g. .foo { @if 3 < 5 { background: green; }
      // https://github.com/andyjansson/postcss-conditionals
      require('postcss-conditionals')(),

      // Allows resolving for assets regardless of import location div { background: resolve('img.jpg'); }
      // https://github.com/assetsjs/postcss-assets
      require('postcss-url')({}),

      // Custom vr unit to help maintain a vertical rhythm, e.g. p { margin-bottom: 2vr; }
      // https://github.com/jameskolce/postcss-lh
      require('postcss-lh')({
        lineHeight: parseInt(variables['--d_lh']) / 10,
        unit: 'vr',
      }),

      // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
      // https://github.com/postcss/postcss-custom-media
      require('postcss-custom-media')({ extensions: media(variables) }),

      // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
      // https://github.com/postcss/postcss-media-minmax
      require('postcss-media-minmax')(),

      // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
      // https://github.com/postcss/postcss-custom-selectors
      require('postcss-custom-selectors')(),

      // W3C calc() function, e.g. div { height: calc(100px - 2em); }
      // https://github.com/postcss/postcss-calc
      require('postcss-calc')(),

      // Allows you to nest one style rule inside another
      // https://github.com/postcss/postcss-nested
      require('postcss-nested')(),

      // W3C color() function, e.g. div { background: color(red alpha(90%)); }
      // https://github.com/postcss/postcss-color-function
      require('postcss-color-function')(),

      // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
      // https://github.com/iamvdo/pleeease-filters
      require('pleeease-filters')(),

      // Generate pixel fallback for 'rem' units, e.g. div { margin: 2.5rem 2px 3em 100%; }
      // https://github.com/robwierzbowski/node-pixrem
      require('pixrem')({ rootValue: 10 }),

      // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
      // https://github.com/postcss/postcss-selector-matches
      require('postcss-selector-matches')(),

      // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
      // https://github.com/postcss/postcss-selector-not
      require('postcss-selector-not')(),

      // Add vendor prefixes to CSS rules using values = require(caniuse.com)
      // https://github.com/postcss/autoprefixer
      require('autoprefixer')({ browsers: browsers }),

      // Production only transformations
    ].concat(
      env === 'production'
        ? [
            // A tool for packing same CSS media query rules into one with PostCSS
            // https://github.com/hail2u/node-css-mqpacker
            require('css-mqpacker')(),

            // A modular minifier, built on top of the PostCSS ecosystem. http://cssnano.co
            // https://github.com/ben-eb/cssnano
            require('cssnano')(),
          ]
        : [],
    ),
  };
};
