const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const p = x => path.join(__dirname, x);

//   Documents/com~apple~CloudDocs/Longguikeji/Fonticon设计.sketch --format=svg --output=ou

async function main() {
  const src = p('../../../resources/icons.sketch');
  const dst = p('../src/assets/icons/auto');
  // console.log(src, dst);

  console.log('01/04 - clear icons');
  cp.execSync(`rm -rf "${dst}"`);

  const cmd = `/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool \
export artboards "${src}" --trimmed --format=svg --output="${dst}"`;

  // console.log(cmd); process.exit(0);
  console.log('02/04 - generate svg by Sketch');
  const ret = cp.execSync(cmd, {encoding: 'utf-8'})
  // console.log(cmd, ret);
  const invalidNames = [];
  const names = [];

  console.log('03/04 - svgo & remove title');
  fs.readdirSync(dst, {encoding: 'utf-8'}).forEach(name => {
    if (!name.match(/^[a-z0-9\-.]+$/)) {
      invalidNames.push(name);
    } else {
      const fpath = path.join(dst, name);
      cp.execSync(`svgo --disable=removeViewBox "${fpath}"`);
      cp.execSync(`sed -E -i '' -e 's@<title>.*</title>@@' "${fpath}"`);

      names.push(name);
    }
    // console.log(name);
  });

  if (invalidNames.length) {
    console.error(`invalid names ${invalidNames.join(', ')}`);
    invalidNames.forEach(x => fs.unlinkSync(path.join(dst, x)));
  } else {
    console.log('Good! all icon name correct');
  }

  console.log('04/04 - no 04');

  /*
  // 不需要生成 icons.less, 使用 less 的 mixin 实现
  const out = names.map(x => `#use-icon-${x.replace(/(?:\.[^.]+)*$/, '')}(@size: contain) {
  background: url('./assets/icons/auto/${x}') center no-repeat;
  background-size: @size;
}`
  ).join('\n');

  fs.writeFileSync(p('../src/icons.less'), out);
  */

  console.log('done');
}


main().catch(ex => {
  console.error(String(ex));
  process.exit(1);
});
