import fs from 'fs/promises';
import path from 'path';
import glob from 'fast-glob';

import { log } from './utils/logger';
import { removeEmptyDirectories } from './utils/remove-empty-dirs';

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
		minify = false,
		keepBuildFiles = false,
		modifyRollupOptions = (x) => x,
	} = pluginOpts;

	let { baseUrl, webModulesUrl } = snowpackConfig.buildOptions;

	return {
		name: 'snowpack-bundle-rollup',
		async optimize ({ buildDirectory }) {
			try {
				let webModulesDirectory = path.join(buildDirectory, webModulesUrl);

				log('Retrieving entrypoints');
				let inputs = await glob(entrypoints, { cwd: buildDirectory, absolute: true });

				log('Generating bundle');
				let rollupOptions = {
					input: {
						input: inputs,
						plugins: [
							proxyResolverPlugin(),
							modulesDir !== false &&	webModulesChunkPlugin({ buildDirectory, modulesDir }),

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

				if (!keepBuildFiles) {
					log('Cleaning up');

					for (let file of bundle.watchFiles) {
						if (inputs.includes(file)) continue;
						await fs.rm(file);
					}

					await fs.rm(webModulesDirectory, { recursive: true });
					await removeEmptyDirectories(buildDirectory);
				}
			} catch (e) {
				console.error(e);
			}
		},
	};
};
