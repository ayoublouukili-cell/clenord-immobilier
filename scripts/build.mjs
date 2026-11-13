import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
let count = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    count++;
    if (['.js', '.mjs'].includes(extname(path))) {
      const check = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
      if (check.status !== 0) throw new Error(check.stderr || `Cannot check ${path}`);
    }
    if (!['.html', '.css', '.js', '.mjs'].includes(extname(path))) continue;
    const source = await readFile(path, 'utf8');
    const references = extname(path) === '.html'
      ? [...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1])
      : extname(path) === '.css'
        ? [...source.matchAll(/url\(["']?([^\s)'"?]+)["']?\)/g)].map(match => match[1])
        : [...source.matchAll(/from\s+["'](\.[^"']+)["']/g)].map(match => match[1]);
    for (const reference of references) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(reference)) continue;
      const asset = resolve(dirname(path), reference.split(/[?#]/)[0]);
      if (!(await stat(asset).catch(() => null))?.isFile()) {
        throw new Error(`Missing asset: ${reference} in ${path}`);
      }
    }
  }
}
await inspect(root);
console.log(`Build ready: ${count} files in dist; JavaScript and local asset references checked.`);
