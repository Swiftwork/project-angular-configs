const mixins = require('@evry/ng-styles/dist/postcss.mixins.js');

module.exports = (variables) => Object.assign({}, mixins(variables), {
  card: (mixin) => ({
    'display': 'block',
    'padding': '1vr',
    'background-color': 'white',
    'border-radius': variables.d_border_radius,
    'box-shadow': '3px 3px 6px rgba(0, 0, 0, 0.12)',
  })
});
