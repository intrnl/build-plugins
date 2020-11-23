import * as fs from 'fs/promises';
import * as path from 'path';

import escalade from 'escalade';

import { log } from './utils/log.js';

import { rollup } from 'rollup';
import { resolve } from './plugins/node-like-resolver.js';
import { bundleSize } from './plugins/bundle-size.js';
import { esbuild } from '@intrnl/rollup-plugin-esbuild';


async function main () {
	let file = await escalade(process.cwd(), (dir, files) => (
		files[files.indexOf('package.json')]
	));

	if (!file) return log('error', 'Cannot find package.json');

	let dir = path.dirname(file);
	let pkg;

	try {
		let content = await fs.readFile(file, 'utf-8');
		pkg = JSON.parse(content);
	} catch (err) {
		log('error', 'Cannot read package.json');
		log('log', '%%: %%', err.name, err.message);
		return;
	}

	if (!pkg.source) return log('error', 'No "source" field on package.json');
	if (!pkg.main && !pkg.module) return log('error', 'No "main" or "module" field on package.json');

	let bundlOptions = pkg.bundl || {};

	let rollupOptions = {
		input: path.join(dir, pkg.source),
		output: [
			pkg.main && {
				file: path.join(dir, pkg.main),
				format: 'cjs',
				freeze: false,
				exports: 'auto',
			},
			pkg.module && {
				file: path.join(dir, pkg.module),
				format: 'esm',
				freeze: false,
			},
		],
		external: (id) => !(/^\.{0,2}\//).test(id),
		plugins: [
			resolve({ extensions: ['.tsx', '.ts', '.mjs', '.jsx', '.js'] }),
			esbuild({
				transformOptions: {
					minify: bundlOptions.minify,
					target: bundlOptions.target,
					jsxFactory: bundlOptions.jsxFactory,
					jsxFragment: bundlOptions.jsxFragment,
				},
				loaders: {
					js: ['.js', '.mjs'],
					ts: ['.ts'],
					jsx: ['.jsx'],
					tsx: ['.tsx'],
				},
			}),
			bundleSize(),
		],
	};

	let timeStart = Date.now();
	let bundle;

	try {
		bundle = await rollup(rollupOptions);
	} catch (err) {
		log('error', 'Cannot generate bundle');
		log('log', '%% :: %%', err.name, err.message);
		return;
	}

	try {
		await Promise.all(
			rollupOptions.output
				.filter((x) => x)
				.map(bundle.write)
		);
	} catch (err) {
		log('error', 'Cannot write bundle');
		log('log', '%% :: %%', err.name, err.message);
		return;
	}

	let timeEnd = Date.now();

	log('info', 'Took %% ms to bundle', timeEnd - timeStart);
}

main();
