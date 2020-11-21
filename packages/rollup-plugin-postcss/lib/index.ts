import * as path from 'path';

import type { Plugin as RollupPlugin, OutputAsset } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import type { FilterPattern } from '@rollup/pluginutils';

import Concat from 'concat-with-sourcemaps';

import postcss from 'postcss';
import type { AcceptedPlugin as PostCSSPlugin } from 'postcss';
import postcssModules from 'postcss-modules';
import type { PluginOptions as CSSModulesOptions } from 'postcss-modules';

import CleanCSS from 'clean-css';
import type { Options as CleanCSSOptions } from 'clean-css';


let noop = () => {};


function plugin (opts: PluginOptions = {}): RollupPlugin {
	let {
		include = /\.css$/i,
		exclude,
		extractFilename = 'style.css',
		plugins = [],
		modules = 'auto',
		modulesOptions = {},
		minify = false,
		minifyOptions = {},
		sourcemap = true,
	} = opts;

	let filter = createFilter(include, exclude);
	let modulesRE = /\.module\.[a-z]+$/i;

	let instance = postcss([noop, ...plugins]);
	let instanceModule = modules
		? postcss([noop, ...plugins, postcssModules({ getJSON () {}, ...(modulesOptions || {}) })])
		: null;

	return {
		name: 'rollup-plugin-postcss',

		async transform (source, id) {
			if (!filter(id)) return null;

			let isModule = (
				(modules == true) ||
				(modules == 'auto' && modulesRE.test(id)) ||
				(typeof modules == 'function' && modules(id))
			);

			let processor = isModule ? instanceModule! : instance;
			let { content: style, map, messages } = await processor.process(source, {
				from: id,
				map: sourcemap
					? { inline: false, annotation: false, absolute: true, sourcesContent: true }
					: false,
			});

			let json: null | Record<string, string> = null;

			for (let msg of messages) {
				if (msg.type == 'warning') {
					this.warn(msg.message || msg.text);
				} else if (msg.type == 'dependency') {
					this.addWatchFile(msg.file);
				} else if (msg.type == 'export' && msg.plugin == 'postcss-modules') {
					json = msg.exportTokens;
				}
			}

			let code = json ? `export default ${JSON.stringify(json)}` : '';

			return {
				code,
				map: null,
				meta: {
					postcss: {
						result: { style, map },
					},
				},
			};
		},

		async generateBundle (outputOpts, bundle) {
			let chunks: ({ id: string, style: string, map: any })[] = [];

			for (let id of this.getModuleIds()) {
				if (!filter(id)) continue;

				let module = this.getModuleInfo(id)!;
				let { style, map } = module.meta.postcss?.result;

				chunks.push({ id, style, map });
			}

			if (!chunks.length) return;

			let content = '';
			let map = '';

			if (minify) {
				let cleanCSS = new CleanCSS({
					...minifyOptions,
					sourceMap: !!outputOpts.sourcemap,
					sourceMapInlineSources: true,
					returnPromise: true,
				});

				let res = await cleanCSS.minify(
					chunks.map((chunk) => ({
						[chunk.id]: { styles: chunk.style, sourceMap: chunk.map?.toString() },
					}))
				);

				content = res.styles;
				map = res.sourceMap?.toString();
			} else {
				let concat = new Concat(!!outputOpts.sourcemap, '', '\n');

				for (let { id, style, map } of chunks) {
					concat.add(id, style, map);
				}

				content = concat.content.toString('utf-8');
				map = concat.sourceMap!;
			}

			let ref = this.emitFile({ type: 'asset', name: extractFilename, source: content });
			let filename = this.getFileName(ref);

			if (map) {
				let tempMap = JSON.parse(map);
				tempMap.sources = tempMap.sources.map((source: string) => {
					source = source.replace('src/file:', '');

					let sourcemapPath = path.resolve(outputOpts.dir!, filename + '.map');
					let relativeSourcePath = path.relative(sourcemapPath, source);

					return outputOpts.sourcemapPathTransform
						? outputOpts.sourcemapPathTransform(relativeSourcePath, sourcemapPath)
						: relativeSourcePath;
				});
				map = JSON.stringify(tempMap);

				if (outputOpts.sourcemap == 'inline') {
					content += '\n/*# sourceMappingURL=data:application/json;base64,'
					content += Buffer.from(map, 'utf-8').toString('base64');
					content += ' */';
				} else if (outputOpts.sourcemap == true) {
					content += '\n/*# sourceMappingURL=';
					content += path.basename(filename) + '.map';
					content += ' */';
				}

				if (outputOpts.sourcemap && outputOpts.sourcemap != 'inline') {
					this.emitFile({
						type: 'asset',
						fileName: filename + '.map',
						source: map,
					});
				}

				(bundle[filename] as OutputAsset).source = content;
			}
		},
	};
}

interface PluginOptions {
	include?: FilterPattern,
	exclude?: FilterPattern,
	extractFilename?: string,
	plugins?: PostCSSPlugin[],
	modules?: boolean | 'auto' | ((fileName: string) => boolean),
	modulesOptions?: CSSModulesOptions,
	minify?: boolean,
	minifyOptions?: CleanCSSOptions,
	sourcemap?: boolean | 'inline' | 'hidden',
}

export { plugin as postcss };
export type { PluginOptions };
