const fs = require('fs');
const path = require('path');
const http = require('http');
const rimraf = require('rimraf');
const chalk = require('chalk');

const API_PATH = 'http://schema.server.com/api/schema/typescript';

const SCHEMA_PATH = path.join(process.cwd(), 'src', 'schema.ts');

const REGEX_EXPORT = /export (?:enum|interface) (\w+).*\{(?:.|\n)+?\n\}/g;
const REGEX_GEN_COMMENT = /\/\/-+\n(?:.|\n)+?\/\/-+\n/g;
const REGEX_EXCESS_WHITESPACE = /\n{2,}/g;
const REGEX_EXCESS_COMMENT = /\/\*\*(.+)\*\/\n\n/g;

// Store the last generator comment
let genComment = '';

module.exports.generate = manifestFile => {
  rimraf(SCHEMA_PATH, err => {
    if (err) throw err;

    let document = `// Last synced: ${new Date().toISOString()} by ${require('os').userInfo().username}\n\n`;

    fs.readFile(manifestFile, 'utf8', (err, manifest) => {
      if (err) throw err;

      manifest = JSON.parse(manifest);
      Promise.all(manifest.map(interface => module.exports.download(interface))).then(results => {
        results.filter(result => !result.success).forEach(result => console.warn(chalk.yellow(result.error)));
        document += genComment;
        document += results
          .filter(result => result.success)
          .map(result => result.body)
          .join('');
        document = module.exports.clean(document);
        fs.writeFileSync(SCHEMA_PATH, document);
      });
    });
  });
};

module.exports.download = interface => {
  console.log(chalk.green(`+ Downloading ${interface}`));
  const title = `
//------------------------------------------------------------------------------------
// ${interface
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase()}
//------------------------------------------------------------------------------------
`;

  return new Promise((resolve, reject) => {
    http
      .get(`${API_PATH}?type=${interface}`, res => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          let body = '\n';

          res.on('data', chunk => {
            body += chunk;
          });

          res.on('end', () => {
            genComment = body.match(REGEX_GEN_COMMENT)[0];
            body = body.replace(REGEX_GEN_COMMENT, title);
            resolve({ success: true, body: body });
          });
        } else {
          resolve({ success: false, error: `! Failed to download ${interface}` });
        }
      })
      .on('error', function(err) {
        resolve({ success: false, error: err });
      });
  });
};

module.exports.clean = document => {
  const occurance = {};
  let match;
  while ((match = REGEX_EXPORT.exec(document)) != null) {
    const interface = match[1];
    const expression = match[0];
    const hash = module.exports.hash(expression);
    if (!occurance[interface]) {
      occurance[interface] = hash;
      continue;
    }

    if (occurance[interface] !== hash) {
      console.error(
        chalk.yellow(
          `! Leaving mismatching duplicate ${interface} at character ${match.index} ending ${REGEX_EXPORT.lastIndex}`,
        ),
      );
      continue;
    }

    console.log(
      chalk.cyan(`- Removing duplicate ${match[1]} at character ${match.index} ending ${REGEX_EXPORT.lastIndex}`),
    );
    document = document.substring(0, match.index) + document.substring(REGEX_EXPORT.lastIndex);
    REGEX_EXPORT.lastIndex = match.index;
  }
  console.log(chalk.magenta(`- Cleaning all excess white space`));
  document = document.replace(REGEX_EXCESS_WHITESPACE, '\n\n');
  console.log(chalk.magenta(`- Cleaning all excess comments`));
  document = document.replace(REGEX_EXCESS_COMMENT, '');
  return document;
};

module.exports.hash = str => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

if (require.main === module) {
  module.exports.generate(path.resolve(process.cwd(), 'api-manifest.json'));
}
