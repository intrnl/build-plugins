import fs from 'fs/promises';
import path from 'path';
import glob from 'fast-glob';

import { log } from './logger';

import { rollup } from 'rollup';
import { html as htmlPlugin } from 'rollup-plugin-html';
import { terser as terserPlugin } from 'rollup-plugin-terser';
import { postcss as postcssPlugin } from 'rollup-plugin-postcss';
import { rewriteHTMLPlugin } from './plugins/rewrite-html';
import { proxyResolverPlugin } from './plugins/proxy-resolver';
import { webModulesChunkPlugin } from './plugins/web-modules-chunk';


/** @returns {import('snowpack').SnowpackPlugin} */
module.exports = function plugin (snowpackConfig, pluginOpts = {}) {
	let {
		entrypoints = '**/*.html',
		assetsDir = '_assets/',
		modulesDir = 'modules/',
		baseUrl = snowpackConfig.buildOptions.baseUrl || '/',
		minify = false,
		keepBuildFiles = false,
		modifyRollupOptions = (x) => x,
	} = pluginOpts;

	let buildDirectory = snowpackConfig.buildOptions.out;
	let workDirectory = path.join(buildDirectory, '../__bundle_temp__/');

	snowpackConfig.buildOptions.out = workDirectory;
	snowpackConfig.buildOptions.clean = true;

	return {
		name: 'snowpack-bundle-rollup',
		async optimize () {
			try {
				await fs.rm(buildDirectory, { recursive: true, force: true });

				log('Retrieving entrypoints');
				let inputs = await glob(entrypoints, { cwd: workDirectory, absolute: true });

				log('Generating bundle');
				let rollupOptions = {
					input: {
						input: inputs,
						plugins: [
							proxyResolverPlugin(),
							modulesDir !== false &&	webModulesChunkPlugin({ workDirectory, modulesDir }),

							postcssPlugin({ minify }),

							minify && terserPlugin(),

							rewriteHTMLPlugin({ baseUrl }),
							htmlPlugin({ baseUrl }),
						],
					},
					output: {
						dir: buildDirectory,
						entryFileNames: path.join(assetsDir, '[name]-[hash].js'),
						assetFileNames: path.join(assetsDir, '[name]-[hash][extname]'),
						chunkFileNames: path.join(assetsDir, '[name]-[hash].js'),
					},
				};

				modifyRollupOptions(rollupOptions);

				let bundle = await rollup(rollupOptions.input);

				log('Writing bundle');
				await bundle.write(rollupOptions.output);

				// log('Moving public files');

				log('Cleaning up');
				if (keepBuildFiles) {
					let keptFolder = buildDirectory + '-original';
					await fs.rm(keptFolder, { recursive: true, force: true });
					await fs.rename(workDirectory, keptFolder);
				} else {
					await fs.rm(workDirectory, { recursive: true });
				}
			} catch (e) {
				console.error(e);
			}
		},
	};
};
