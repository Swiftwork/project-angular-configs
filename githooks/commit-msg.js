const commit = require('fs').readFileSync(process.env.HUSKY_GIT_PARAMS, 'utf8');
const error = `Git commit message does not fulfill semantic requirements.`;

if (/^merge/i.test(commit)) {
  process.exit(0);
}

if (!/^(chore|docs|feat|fix|style|refactor|test): /.test(commit)) {
  console.error(error);
  console.error(`Message must lead with chore|docs|feat|fix|style|refactor|test followed by a colon and a space.`);
  process.exit(1337);
}

if (/^(feat|fix|style): /.test(commit) && !/#\d+/.test(commit)) {
  console.error(error);
  console.error(`Features, fixes and style changes must include task id #000.`);
  process.exit(1337);
}
