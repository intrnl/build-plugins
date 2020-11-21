let terser = require('terser');


module.exports = {
	async minify (code, stringifiedOpts) {
		let options = (0, eval)(`(${stringifiedOpts})`);

		let result = await terser.minify(code, options);
		return { result, nameCache: options.nameCache };
	},
};
