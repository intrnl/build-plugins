import * as path from 'path';
import cheerio from 'cheerio';

import type { Plugin, InputOption } from 'rollup';


let absolutePathRE = /^(?:[a-z]+:)?\/?\//;
let emptyInline = '__rollup_empty_inline_script;\n';

export function html (opts: PluginOptions = {}): Plugin {
	let { baseUrl = '/' } = opts;

	let entries: Set<string> = new Set();
	let documents: Map<String, cheerio.Root> = new Map();

	return {
		name: 'rollup-plugin-html',

		options (inputOpts) {
			let { input } = inputOpts;

			entries = new Set(getEntries(input));

			return inputOpts;
		},

		async transform (content, id) {
			if (!entries.has(id)) return null;

			let $ = cheerio.load(content);
			let inlineScripts: string[] = [];

			$('script[type=module]').each((i, el) => {
				let $script = $(el);
				$script.removeAttr('rollup-chunk-ref');

				if ($script.attr('rollup-ignore') != undefined) return;

				let src = $script.attr('src');

				if (src) {
					if (absolutePathRE.test(src)) return;

					let ref = this.emitFile({
						type: 'chunk',
						id: src,
						importer: id,
						implicitlyLoadedAfterOneOf: [id],
					});

					$script.attr('rollup-chunk-ref', ref);
				} else {
					inlineScripts.push($script.contents().text());
					$script.remove();
				}
			});

			documents.set(id, $);

			return {
				code: inlineScripts.length ? inlineScripts.join('\n') : emptyInline,
			};
		},

		generateBundle (opts, bundle) {
			for (let [file, entry] of Object.entries(bundle)) {
				if (entry.type != 'chunk') continue;
				if (!entries.has(entry.facadeModuleId!)) continue;

				delete bundle[file];

				let $ = documents.get(entry.facadeModuleId!)!;
				let $head = $('head');
				let $body = $('body');

				$('script[type=module][rollup-chunk-ref]').each((i, el) => {
					let $script = $(el);
					let ref = $script.attr('rollup-chunk-ref')!;

					$script.attr('src', path.join(baseUrl, this.getFileName(ref)));
					$script.removeAttr('rollup-chunk-ref');
				});

				if (entry.code != emptyInline && entry.code.trim()) {
					let $script = $('<script type=module></script>')
						.text(entry.code.trim());

					$body.append($script);
				}

				for (let file in bundle) {
					if (!file.endsWith('.css')) continue;

					let $style = $('<link rel=stylesheet />')
						.attr('href', path.join(baseUrl, file));

					$head.append($style);
				}

				this.emitFile({
					type: 'asset',
					fileName: path.basename(entry.facadeModuleId!),
					source: $.html(),
				});
			}
		},
	};

}

export interface PluginOptions {
	baseUrl?: string,
}


function getEntries (input?: InputOption) {
	if (!input) throw new Error('Missing `input`');

	let entries: string[] = [];

	if (Array.isArray(input)) {
		for (let entry of input) {
			if (!entry.endsWith('.html')) continue;

			entries.push(entry);
		}
	} else if (typeof input == 'object') {
		for (let key in input) {
			let entry = input[key];
			if (!entry.endsWith('.html')) continue;

			entries.push(entry);
		}
	} else if (typeof input == 'string') {
		entries.push(input);
	}

	entries = entries.map((entry) => path.resolve(entry));
	return entries;
}
