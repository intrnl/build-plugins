import { terser } from '../dist/rollup-plugin-terser';


export default {
	input: 'src/index.js',
	output: {
		dir: 'dist/',
	},
	plugins: [
		terser(),
	],
};
