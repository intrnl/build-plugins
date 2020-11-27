import type { InternalModuleFormat } from 'rollup';

function getResolveUrl (path: string, URL = 'URL') {
	return `new ${URL}(${path})`;
}

function getRelativeUrlFromDocument (path: string) {
	return getResolveUrl(`'${path}', document.currentScript && document.currentScript.src || document.baseURI`);
}

export let relativeUrlMechanisms: Record<InternalModuleFormat, (relative: string) => string> = {
	amd (relative) {
		if (relative[0] !== '.') relative = './' + relative;
		return getResolveUrl(`require.toUrl('${relative}'), document.baseURI`);
	},
	cjs (relative) {
		return `(typeof document === 'undefined' ? ${getResolveUrl(`'file:' + __dirname + '/${relative}'`, `(require('url').URL)`)} : ${getRelativeUrlFromDocument(relative)})`;
	},
	es (relative) {
		return getResolveUrl(`'${relative}', import.meta.url`);
	},
	iife (relative) {
		return getRelativeUrlFromDocument(relative);
	},
	system (relative) {
		return getResolveUrl(`'${relative}', module.meta.url`);
	},
	umd (relative) {
		return `(typeof document === 'undefined' ? ${getResolveUrl(`'file:' + __dirname + '/${relative}'`, `(require('url').URL)`)} : ${getRelativeUrlFromDocument(relative)})`;
	},
};
