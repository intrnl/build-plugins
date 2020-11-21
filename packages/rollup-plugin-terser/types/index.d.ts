import type { Plugin } from 'rollup';
import type { MinifyOptions } from 'terser';
export declare function terser(opts?: PluginOptions): Plugin;
export interface PluginOptions {
    numWorkers?: number;
    minifyOptions?: MinifyOptions;
}
