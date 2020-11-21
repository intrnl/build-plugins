import type { Plugin } from 'rollup';
export declare function html(opts?: PluginOptions): Plugin;
export interface PluginOptions {
    baseUrl?: string;
}
