import * as fs from 'fs/promises';
import * as process from 'process';
import escalade from 'escalade';

import type { Plugin } from 'rollup';


let relativePathRE = /^\.{0,2}\//;

export function externals (opts: PluginOptions = {}): Plugin {
	let { external = ['dev'], root = process.cwd() } = opts;

	let pkgPath: null | string = null;
	let dependencies = new Set<string>();

	return {
		name: 'rollup-plugin-node-externals',
		async buildStart () {
			pkgPath = await escalade(root, (dir, files) => (
				files.includes('package.json') && 'package.json'
			)) as string;

			if (!pkgPath) throw new Error('No package.json found');

			let source = await fs.readFile(pkgPath, 'utf-8');
			let json = JSON.parse(source);

			let keys = [];
			if (external.includes('regular')) keys.push('dependencies');
			if (external.includes('dev')) keys.push('devDependencies');
			if (external.includes('optional')) keys.push('optionalDependencies');
			if (external.includes('peer')) keys.push('peerDependencies');

			for (let key of keys) {
				if (!(key in json)) continue;

				let deps = Object.keys(json[key]);

				for (let dep of deps) {
					dependencies.add(dep);
				}
			}
		},

		async resolveId (id, importer, opts = {}) {
			if (relativePathRE.test(id)) return null;

			let externalResolved = await this.resolve(id, pkgPath!, { ...opts, skipSelf: true });
			if (!externalResolved) return null;

			let resolved = await this.resolve(id, importer, { ...opts, skipSelf: true });
			if (!resolved) return null;

			if (externalResolved.id == resolved.id) return false;

			return resolved;
		},
	}
}

export interface PluginOptions {
	external?: Array<'regular' | 'dev' | 'optional' | 'peer'>;
	root?: string;
}
