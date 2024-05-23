import copydir from 'copy-dir';
import * as path from 'path';
import * as mustache from 'mustache';
const fs = require("fs-extra");

export function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, {recursive: true});
  } catch (e) {
    mkdirp(target)

    function mkdirp(dir) {
      if (fs.existsSync(dir)) {
        return true
      }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

export function copyDir(form, to, options) {
  mkdirGuard(to);
  copydir.sync(form, to, options);
}

export function checkMkdirExists(path) {
  return fs.existsSync(path)
}

export function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);

  mkdirGuard(parentPath)

  fs.writeFileSync(to, buffer);
}

export function readTemplate(path, data = {}) {
  const str = fs.readFileSync(path, {encoding: 'utf8'})
  return mustache.render(str, data);
}

export function copyTemplate(from, to, data = {}) {
  if (path.extname(from) !== '.tpl') {
    return copyFile(from, to);
  }
  const parentToPath = path.dirname(to);
  mkdirGuard(parentToPath);
  fs.writeFileSync(to, readTemplate(from, data));
}
