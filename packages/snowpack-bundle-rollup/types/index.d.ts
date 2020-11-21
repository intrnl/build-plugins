import type { SnowpackPlugin } from 'snowpack';
import type { InputOptions, OutputOptions } from 'rollup';

interface RollupOptions {
	input: InputOptions,
	output: OutputOptions,
}

interface PluginOptions {
	/**
	 * HTML entrypoints to pick up, by default it picks everything
	 */
	entrypoints?: string,
	/**
	 * Directory to put the generated bundles
	 */
	assetsDir?: string,
	/**
	 * Directory to put the chunked web_modules, relative to `assetsDir`,
	 * `false` to bundle web_modules
	 */
	modulesDir?: false | string,
	/**
	 * Prefixed public path, defaults to your Snowpack configuration
	 */
	publicPath?: string,
	/**
	 * Minimize bundle size using Terser
	 */
	minimize?: boolean,
	/**
	 * Whether to keep the original build files
	 */
	keepBuildFiles?: false | string,
	/**
	 * Function to modify the plugin's Rollup options
	 */
	modifyRollupOptions?: (opts: RollupOptions) => void,
}

declare function plugin (opts?: PluginOptions): SnowpackPlugin
