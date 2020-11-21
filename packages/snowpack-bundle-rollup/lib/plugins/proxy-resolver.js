// Resolves *.proxy.js files to their actual files

/** @returns {import('rollup').Plugin} */
export function proxyResolverPlugin (opts = {}) {
	return {
		name: 'snowpack-bundle-rollup#proxy-resolver',
		resolveId (id, importer) {
			if (!id.endsWith('.proxy.js')) return null;

			let original = id.replace('.proxy.js', '');

			// JSON can just be served by the proxy script
			if (original.endsWith('.json')) return null;

			return this.resolve(original, importer, { skipSelf: true });
		},
	};
};
