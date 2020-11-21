function _log () {
	let [type, ...args] = arguments;
	console[type].apply(0, args);
}


let prefix = '[snowpack-bundle-rollup]';

export let log = _log.bind(0, 'log', prefix);
