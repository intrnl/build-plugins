import { gzipSync, brotliCompressSync } from 'zlib';


export function gzipSize (input) {
	return gzipSync(input).length;
}

export function brotliSize (input) {
	return brotliCompressSync(input).length;
}
