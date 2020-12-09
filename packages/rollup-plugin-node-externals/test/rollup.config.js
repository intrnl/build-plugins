import resolve from '@rollup/plugin-node-resolve';
import { externals } from '../dist/rollup-plugin-node-externals.mjs';


export default {
	input: 'src/index.js',
	output: {
		dir: 'dist/',
	},
	plugins: [
		externals({ external: ['dev'] }),
		resolve({ browser: false }),
	],
};
