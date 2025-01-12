import * as esbuild from 'esbuild';
import chokidar from 'chokidar';
import { copyFile, mkdir, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const DIST_DIR = 'dist';
const ASSETS = ['manifest.json'];
const DIRS = ['icons'];

async function cleanDist() {
  await rm(DIST_DIR, { recursive: true, force: true });
}

async function copyAsset(asset: string) {
  await mkdir(DIST_DIR, { recursive: true });
  await copyFile(asset, resolve(DIST_DIR, asset));
  console.log(`Copied ${asset} to ${DIST_DIR}`);
}

async function copyDir(dir: string) {
  await mkdir(resolve(DIST_DIR, dir), { recursive: true });
  await cp(dir, resolve(DIST_DIR, dir), { recursive: true });
  console.log(`Copied ${dir} to ${DIST_DIR}`);
}

async function watchAssets() {
  const watcher = chokidar.watch([...ASSETS, ...DIRS], {
    persistent: true,
  });

  watcher.on('change', async (path) => {
    console.log(`Asset changed: ${path}`);
    if (DIRS.includes(path)) {
      await copyDir(path);
    } else {
      await copyAsset(path);
    }
  });
}

async function watch() {
  // 初期クリーンアップ
  await cleanDist();

  // 初期ビルドとアセットコピー
  await Promise.all([
    ...ASSETS.map(copyAsset),
    ...DIRS.map(copyDir)
  ]);

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