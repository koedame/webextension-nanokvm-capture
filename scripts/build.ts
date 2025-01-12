import * as esbuild from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const DIST_DIR = 'dist';
const ASSETS = ['manifest.json'];

async function copyAssets() {
  await mkdir(DIST_DIR, { recursive: true });
  await Promise.all(
    ASSETS.map((asset) =>
      copyFile(asset, resolve(DIST_DIR, asset))
    )
  );
}

async function build() {
  // ビルド設定
  await esbuild.build({
    entryPoints: ['src/content.ts'],
    bundle: true,
    outdir: DIST_DIR,
    format: 'esm',
    target: 'es2020',
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
  });

  // アセットをコピー
  await copyAssets();
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
}); 