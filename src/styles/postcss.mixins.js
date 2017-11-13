const variables = require('./postcss.variables.js');

module.exports = {
  iconBase: (mixin) => {
    return {
      'line-height': 1,
      'font-weight': 'normal',
      'font-style': 'normal',
      'font-variant': 'normal',

      /* use !important to prevent issues with browser extensions that change fonts */

      'font-family': '$f_stack_icons !important',
      'text-transform': 'none',

      /* Better Font Rendering =========== */

      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      'speak': 'none',
    }
  },

  /* CLEARFIX */

  clearfocus: (mixin) => {
    return {
      '&:focus': {
        'color': 'inherit',
        'background-color': 'transparent',
      }
    }
  },

  /* CLEARFIX */

  clearfix: (mixin) => {
    return {
      '&::after': {
        'display': 'block',
        'content': '',
        'clear': 'both',
      }
    }
  },

  /* FONT SCALING */

  fontScaling: (mixin, minimum, maximum) => {
    return {
      'font-size': `calc(100vw * (strip(${minimum}) * 10 / strip(${maximum})))`,

      '@media $b_xs': {
        'font-size': minimum,
      },

      '@media $b_xl': {
        'font-size': maximum,
      }
    }
  },

  /* GRID COLUMNS */

  columns: (mixin, device) => {
    const columns = {};
    for (let i = 1; i <= variables.d_columns; i++) {
      columns[`&[columns${device ? '-' + device : ''}="${i}"] > *`] = {
        'width': `calc(${100 / i}% - ${variables.d_columns_gap} - 0.01rem)`,

        '&.c-grid': {
          'width': `calc(${100 / i}% - 0.01rem)`,
        }
      }
    }
    return columns;
  },

  colspan: (mixin, count) => {
    return {
      'width': `calc(${100 / variables.d_columns}% * ${count} - ${variables.d_columns_gap} - 0.01rem) !important`,
      'flex-grow': '0 !important',
    };
  }
}
