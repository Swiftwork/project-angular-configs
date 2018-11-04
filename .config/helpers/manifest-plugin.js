const fs = require('fs');
const path = require('path');

class ManifestPlugin {

  constructor(options) {
    this.options = Object.assign({
    }, options);
  }

  apply(compiler) {

    const PRE_RESOURCES = /\.(css)$/;
    const POST_RESOURCES = /\.(js)$/;

    compiler.hooks.done.tap('ManifestPlugin', (stats) => {
      const emitted = Object.keys(stats.compilation.assets);
      const manifest = {
        pre: emitted.filter(asset => PRE_RESOURCES.test(asset)),
        post: emitted.filter(asset => POST_RESOURCES.test(asset)),
      };

      if (Array.isArray(this.options.preOrder))
        this.sort(manifest.pre, this.options.preOrder);

      if (Array.isArray(this.options.postOrder))
        this.sort(manifest.post, this.options.postOrder);

      fs.writeFile(
        path.join(stats.compilation.outputOptions.path, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf8',
        (err) => {
          if (err) throw err;
          console.info('Emitted manifest');
        }
      );
    });
  }

  sort(assets, order) {
    assets.sort((a, b) => {
      const assetA = a.split('.')[0];
      const assetB = b.split('.')[0];
      return order.indexOf(assetA) - order.indexOf(assetB);
    });
  }
}
module.exports = ManifestPlugin;
