import { log } from '../utils/log.js';
import { gzipSize, brotliSize } from '../utils/compress-size.js';
import { prettyBytes } from '../utils/pretty-bytes.js';


export function bundleSize () {
	return {
		name: 'bundl#bundle-size',
		generateBundle (opts, bundle) {
			for (let file in bundle) {
				let chunk = bundle[file];
				let content = chunk.type == 'chunk' ? chunk.code : chunk.source;

				log('log', '%% (%%, %% gz, %% br)',
					chunk.fileName,
					prettyBytes(content.length),
					prettyBytes(gzipSize(content)),
					prettyBytes(brotliSize(content)),
				);
			}
		},
	}
}
