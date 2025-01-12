import * as esbuild from 'esbuild';
import chokidar from 'chokidar';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const DIST_DIR = 'dist';
const ASSETS = ['manifest.json'];

async function copyAsset(asset: string) {
  await mkdir(DIST_DIR, { recursive: true });
  await copyFile(asset, resolve(DIST_DIR, asset));
  console.log(`Copied ${asset} to ${DIST_DIR}`);
}

async function watchAssets() {
  const watcher = chokidar.watch(ASSETS, {
    persistent: true,
  });

  watcher.on('change', async (path) => {
    console.log(`Asset changed: ${path}`);
    await copyAsset(path);
  });
}

async function watch() {
  // 初期ビルドとアセットコピー
  await Promise.all(ASSETS.map(copyAsset));

  // esbuildの監視設定
  const ctx = await esbuild.context({
    entryPoints: ['src/content.ts'],
    bundle: true,
    outdir: DIST_DIR,
    format: 'esm',
    target: 'es2020',
    sourcemap: true,
  });

  await ctx.watch();
  console.log('Watching for changes...');

  // アセットの監視を開始
  await watchAssets();
}

watch().catch((err) => {
  console.error('Watch failed:', err);
  process.exit(1);
}); 