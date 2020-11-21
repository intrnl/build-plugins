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
		['snowpack-bundle-rollup'],
	],
};
