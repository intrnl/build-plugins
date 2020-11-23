import * as fs from 'fs';
import * as path from 'path';


export function resolve (opts = {}) {
	let { extensions } = opts;

	return {
		name: 'bundl#node-like-resolver',
		resolveId (importee, importer) {
			// if it doesn't have an importer and is an absolute path,
			// then just resolve with that.
			if (!importer && !(/\.\.?\//).test(importee))
				return resolveFile(importee, extensions);

			let join = path.join(importer ? path.dirname(importer) : path.resolve(), importee);
			return resolveFile(join, extensions);
		},
	};
}

function resolveFile (importee, exts, index) {
	for (let ext of exts) {
		let file = index ? path.join(importee, `index${ext}`) : `${importee}${ext}`;
		if (fs.existsSync(file)) return file;
	}

	if (index) return;

	if (fs.existsSync(importee) && fs.lstatSync(importee).isDirectory()) {
		return resolveFile(importee, exts, true);
	}
}
