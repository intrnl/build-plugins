import { WorkerPool } from '@intrnl/node-worker-pool';
import serialize from 'serialize-javascript';
import type { Plugin } from 'rollup';
import type { MinifyOptions } from 'terser';


let workerScript = require.resolve('../worker');

export function terser (opts: PluginOptions = {}): Plugin {
	let { numWorkers = 4, minifyOptions = {} } = opts;

	let pool = new WorkerPool(workerScript, { max: numWorkers });

	return {
		name: 'rollup-plugin-terser',
		async renderChunk (code, chunk, outputOpts) {
			let defaultOpts: MinifyOptions = {
				sourceMap: !!outputOpts.sourcemap,
				module: outputOpts.format == 'es' ? true : undefined,
				toplevel: outputOpts.format == 'cjs' ? true : undefined,
			};

			let opts = serialize({ ...defaultOpts, ...minifyOptions });

			try {
				let { result, nameCache } = await pool.exec('minify', [code, opts]);

				if (nameCache) {
					if (!minifyOptions.nameCache) minifyOptions.nameCache = {};

					let prevCache = minifyOptions.nameCache as any;
					let { vars, props } = prevCache;

					if (!vars) vars = prevCache.vars = { props: {} };
					if (!props) props = prevCache.props = { props: {} };

					let newVars = nameCache.vars?.props;
					let newProps = nameCache.props?.props;

					Object.assign(vars.props, newVars);
					Object.assign(props.props, newProps);
				}

				return result;
			} catch (err) {
				let { message, line, col: column } = err;
				return this.error(message, { line, column });
			}
		},
		generateBundle () {
			// We don't want to close the pool entirely, only the workers so that
			// the pool can still be used.
			Promise.all(pool.workers.map((worker) => worker.close()))
				.finally(() => {});
		},
	}
}

export interface PluginOptions {
	numWorkers?: number,
	minifyOptions?: MinifyOptions,
}
