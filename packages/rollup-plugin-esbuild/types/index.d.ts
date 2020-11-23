import type { Plugin } from 'rollup';
import type { FilterPattern } from '@rollup/pluginutils';
import type { Loader, TransformOptions } from 'esbuild';
export declare function esbuild(opts: PluginOptions): Plugin;
export declare type Loaders = {
    [K in Loader]?: string[];
};
export interface PluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    loaders?: Loaders;
    transformOptions?: TransformOptions;
}
