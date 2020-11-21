// Splits web_modules into their respective chunks
// We're using Rollup's manualChunks so that they are properly hashed

import path from 'path';
import glob from 'fast-glob';


/** @returns {import('rollup').Plugin} */
export function webModulesChunkPlugin (opts = {}) {
	let { buildDirectory, modulesDir } = opts;
	let webModulesDirectory = path.join(buildDirectory, 'web_modules/');

	let sep = /\//g;

	return {
		name: 'snowpack-bundle-rollup#web-modules-chunk',
		async renderStart (output) {
			let files = await glob(['**/*.js', '!common/**'], {
				cwd: webModulesDirectory,
			});

			if (!output.manualChunks) output.manualChunks = {};

			for (let file of files) {
				let chunk = path.join(modulesDir, file.replace('.js', '').replace(sep, '-'));
				let filename = path.join(webModulesDirectory, file);

				output.manualChunks[chunk] = [filename];
			}

			return output;
		},
	};
};
