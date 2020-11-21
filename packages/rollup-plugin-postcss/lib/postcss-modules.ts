declare module 'postcss-modules' {
	import type { PluginCreator } from 'postcss';

	export interface PluginOptions {
		getJSON?: ((file: string, json: Record<string, string>, output: string) => void),
		generateScopedName?: string | ((name: string, file: string, css: string) => void),
		hashPrefix?: string,
		scopeBehavior?: 'local' | 'global',
		localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
			| ((original: string, generated: string, file: string) => void),
		exportGlobalNames?: boolean,
		Loader?: any,
		root?: string,
		globalModulePaths?: RegExp[],
	}

	let plugin: PluginCreator<PluginOptions>;
	export default plugin;
}
