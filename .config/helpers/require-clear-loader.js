const path = require('path');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    files: {
      type: 'array',
    }
  }
}

/**
 * Loader that clears require cache for files specified in options.
 */
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);

  validateOptions(schema, options, 'Watcher Loader');

  options.files.forEach((file) => {
    this.addDependency(file);
    delete require.cache[require.resolve(file)];
  });

  return source;
};
