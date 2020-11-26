module.exports = {
	mount: {
		public: '/',
		src: '/src'
	},
	buildOptions: {
		out: 'dist',
		clean: true,
	},
	plugins: [
		['@intrnl/snowpack-bundle-rollup'],
	],
};
