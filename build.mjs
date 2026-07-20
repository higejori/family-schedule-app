// esbuildによる本番ビルド。
// このPCで vite build(rollup) が 0xC0000409 でクラッシュするための代替（devはviteのまま）。
import { build } from 'esbuild';
import { existsSync, readdirSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// このPC環境では fs.rmSync(recursive) が日本語パス配下で 0xC0000409 クラッシュするため手動で再帰削除する
function rmrf(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) rmrf(p);
    else unlinkSync(p);
  }
  rmdirSync(dir);
}

rmrf('dist');

const result = await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2019',
  jsx: 'automatic',
  outdir: 'dist/assets',
  entryNames: 'index-[hash]',
  assetNames: 'asset-[hash]',
  metafile: true,
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': '"production"' },
});

// metafileから実ファイル名を取得してindex.htmlを生成
const outputs = Object.keys(result.metafile.outputs).map((p) => p.replace(/\\/g, '/'));
const js = outputs.find((p) => p.endsWith('.js'));
const css = outputs.find((p) => p.endsWith('.css'));
const rel = (p) => '/' + path.posix.relative('dist', p);

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2c3e50" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%85%3C/text%3E%3C/svg%3E" />
    <title>家族スケジュール</title>
${css ? `    <link rel="stylesheet" href="${rel(css)}" />\n` : ''}  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${rel(js)}"></script>
  </body>
</html>
`;
writeFileSync('dist/index.html', html);
console.log(`✓ dist/index.html generated (js=${rel(js)}, css=${css ? rel(css) : 'none'})`);
