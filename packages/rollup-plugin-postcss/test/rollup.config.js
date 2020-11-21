import { postcss as postcssPlugin } from '../dist/rollup-plugin-postcss.mjs';


export default {
	input: 'src/index.js',
	output: {
		dir: 'dist/',
		sourcemap: 'hidden',
	},
	plugins: [
		postcssPlugin({ minify: true }),
	],
};
