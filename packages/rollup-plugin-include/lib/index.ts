import * as fs from 'fs/promises';
import * as path from 'path';

import { CreateFilter, createFilter } from '@rollup/pluginutils';
import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

import MagicString from 'magic-string';
import { asyncWalk } from 'estree-walker';
import type { Node, Program } from 'estree';

import { relativeUrlMechanisms } from './url-mechanisms';


let filterMap: WeakMap<IncludeRule, ReturnType<CreateFilter>> = new WeakMap();

let META_PREFIX = 'ROLLUP_PLUGIN_INCLUDE_';

let DEFAULT_RULES: IncludeRule[] = [
	{ type: 'chunk', include: /\.m?js$/i },
	{ type: 'asset' },
];

export function include (opts: PluginOptions = {}): Plugin {
	let { include, exclude, rules = DEFAULT_RULES } = opts;

	let filter = createFilter(include, exclude);

	return {
		name: 'rollup-plugin-include',
		async transform (code, id) {
			if (!filter(id)) return null;

			let ast: Program;
			let str = new MagicString(code);
			let hasModified = false;

			try {
				ast = this.parse(code) as any;
			} catch {
				return null;
			}

			await asyncWalk(ast!, {
				// @ts-ignore
				enter: async (node: Node) => {
					if (!(
						node.type === 'NewExpression' &&
						node.callee.type === 'Identifier' &&
						node.callee.name === 'URL' &&

						node.arguments.length === 2 &&

						node.arguments[0].type === 'Literal' &&
						typeof node.arguments[0].value === 'string' &&
						!path.isAbsolute(node.arguments[0].value) &&

						node.arguments[1].type === 'MemberExpression' &&
						node.arguments[1].object.type === 'MetaProperty' &&
						node.arguments[1].object.meta.type === 'Identifier' &&
						node.arguments[1].object.meta.name === 'import' &&
						node.arguments[1].object.property.type === 'Identifier' &&
						node.arguments[1].object.property.name === 'meta' &&
						node.arguments[1].property.type === 'Identifier' &&
						node.arguments[1].property.name === 'url'
					)) return;

					let loc = node.arguments[0].value;
					let file = path.join(path.dirname(id), loc);

					for (let rule of rules) {
						let filterInclude = filterMap.get(rule);

						if (!filterInclude) {
							filterInclude = createFilter(rule.include, rule.exclude);
							filterMap.set(rule, filterInclude);
						}

						if (!filterInclude(file)) continue;

						let ref: undefined | string;

						if (rule.type === 'chunk') {
							ref = this.emitFile({
								type: 'chunk',
								name: rule.name?.(file) || path.basename(file, path.extname(file)),
								id: file,
							});
						} else if (rule.type === 'asset') {
							let source = await fs.readFile(file, 'utf-8');
							if (rule.transform) source = await rule.transform(source, file);

							ref = this.emitFile({
								type: 'asset',
								name: rule.name?.(file) || path.basename(file),
								source,
							});
						}

						if (ref) {
							let start: number = (node as any).start;
							let end: number = (node as any).end;

							hasModified = true;
							str.overwrite(start, end, 'import.meta.' + META_PREFIX + ref);
						}

						return;
					}
				},
			});


			if (!hasModified) return null;

			return {
				code: str.toString(),
				map: str.generateMap(),
			};
		},

		resolveImportMeta (prop, { format, chunkId }) {
			if (!prop?.startsWith(META_PREFIX)) return null;

			let ref = prop.slice(META_PREFIX.length);
			let file = this.getFileName(ref);

			let relative = path.normalize(path.relative(path.dirname(chunkId), file));

			return relativeUrlMechanisms[format](relative);
		},
	};
}

export interface PluginOptions {
	include?: FilterPattern,
	exclude?: FilterPattern,
	rules?: IncludeRule[],
}

export type IncludeRule = ChunkIncludeRule | AssetIncludeRule;

export interface BaseIncludeRule {
	include?: FilterPattern,
	exclude?: FilterPattern,
	name?: (filename: string) => string | void,
}
export interface ChunkIncludeRule extends BaseIncludeRule {
	type: 'chunk',
}
export interface AssetIncludeRule extends BaseIncludeRule {
	type: 'asset',
	transform?: (source: string, filename: string) => string | Promise<string>,
}
