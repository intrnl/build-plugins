import type { Plugin, PluginContext } from 'rollup';

import { createFilter } from '@rollup/pluginutils';
import type { FilterPattern } from '@rollup/pluginutils';

import { startService } from 'esbuild';
import type { Service, Loader, TransformOptions, Message } from 'esbuild';


let defaultLoaders: Loaders = {
	js: ['.js', '.mjs'],
	jsx: ['.jsx'],
	ts: ['.ts'],
	tsx: ['.tsx'],
};

export function esbuild (opts: PluginOptions): Plugin {
	let {
		transformOptions = {},
		loaders = defaultLoaders,
		include,
		exclude,
	} = opts;

	let filter = createFilter(include, exclude);
	let service: null | Service = null;

	return {
		name: 'rollup-plugin-esbuild',

		async buildStart () {
			if (!service) service = await startService();
		},
		buildEnd (err) {
			if (err && !this.meta.watchMode) stopService();
		},
		generateBundle () {
			if (!this.meta.watchMode) stopService();
		},

		async transform (source, id) {
			if (!filter(id)) return null;

			let loader = getLoader(loaders, id);
			if (!loader || !loader) return null;

			let { code, map, warnings } = await service!.transform(source, {
				loader,
				target: 'esnext',

				charset: transformOptions.charset,
				define: transformOptions.define,
				pure: transformOptions.pure,
				jsxFactory: transformOptions.jsxFactory,
				jsxFragment: transformOptions.jsxFragment,
				tsconfigRaw: transformOptions.tsconfigRaw,

				sourcemap: true,
				sourcefile: id,
			});

			printMessages(this, warnings, id);

			return { code, map };
		},

		async renderChunk (source, { fileName }) {
			let { code, map, warnings } = await service!.transform(source, {
				target: transformOptions.target,
				banner: transformOptions.banner,
				footer: transformOptions.footer,
				avoidTDZ: transformOptions.avoidTDZ,
				treeShaking: transformOptions.treeShaking,
				keepNames: transformOptions.keepNames,
				minify: transformOptions.minify,
				minifyIdentifiers: transformOptions.minifyIdentifiers,
				minifySyntax: transformOptions.minifySyntax,
				minifyWhitespace: transformOptions.minify,

				sourcemap: true,
				sourcefile: fileName,
			});

			printMessages(this, warnings, fileName);

			return { code, map };
		},
	};

	function stopService () {
		if (!service) return;
		service.stop();
		service = null;
	}
}

function getLoader (loaders: Loaders, id: string): false | Loader {
	for (let loader in loaders) {
		let extensions = loaders[loader as Loader]!;

		for (let ext of extensions) {
			if (id.endsWith(ext)) return loader as Loader;
		}
	}

	return false;
}

function printMessages (ctx: PluginContext, messages: Message[], id: string) {
	for (let { text, location } of messages) {
		ctx.warn({ code: 'ESBUILD_WARNING', message: text, loc: location!, id });
	}
}


export type Loaders = { [K in Loader]?: string[] }

export interface PluginOptions {
	include?: FilterPattern,
	exclude?: FilterPattern,
	loaders?: Loaders,
	transformOptions?: TransformOptions,
}
