// Rewrites public path for use with the actual HTML input plugin

import cheerio from 'cheerio';


/** @returns {import('rollup').Plugin} */
export function rewriteHTMLPlugin (opts = {}) {
	let { baseUrl } = opts;

	return {
		name: 'snowpack-bundle-rollup#html',
		transform (source, id) {
			if (!id.endsWith('.html')) return null;

			let $ = cheerio.load(source);

			$('script[type=module][src]').each((i, el) => {
				let $script = $(el);
				let src = $script.attr('src');

				if (!src || !src.startsWith(baseUrl)) return;
				$script.attr('src', src.replace(baseUrl, './'));
			});

			return { code: $.html() };
		},
	};
}
