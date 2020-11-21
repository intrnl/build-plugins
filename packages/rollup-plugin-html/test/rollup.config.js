import { html } from '../dist/rollup-plugin-html.mjs';


export default {
	input: 'src/index.html',
	output: {
		dir: 'dist/',
	},
	plugins: [
		html(),
	],
};
