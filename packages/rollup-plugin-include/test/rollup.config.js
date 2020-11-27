import { include } from '../dist/rollup-plugin-include.mjs';


export default {
	input: 'src/index.js',
	output: {
		dir: 'dist/',
	},
	plugins: [
		include(),
	],
};
