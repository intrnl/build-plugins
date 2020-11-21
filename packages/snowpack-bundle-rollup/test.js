let { Parser } = require('htmlparser2');

let NodeKind = {
	Fragment: 0,
	Element: 1,
	Text: 2,
	Comment: 3,
	Directive: 4,
};

let QuoteKind = {
	NoQuote: 0,
	SingleQuote: 1,
	DoubleQuote: 2,
};


function parse (html) {
	let root = createFragmentNode();
	let stack = [root];

	let parser = new Parser({
		onreset () {
			root = createFragmentNode();
			stack = [];
		},
		onopentagname (name) {
			let parent = getLastItem(stack);
			let node = createElementNode(name, []);

			parent.body.push(node);

			stack.push(node);
		},
		onattribute (key, value, quote) {
			let parent = getLastItem(stack);

			let quoteType = quote == '"'
				? QuoteKind.DoubleQuote
				: quote == "'"
					? QuoteKind.SingleQuote
					: QuoteKind.NoQuote;

			let attr = createAttribute(key, value, quoteType);

			parent.attrs.push(attr);
		},
		ontext (value) {
			let parent = getLastItem(stack);
			let node = createTextNode(value);

			parent.body.push(node);
		},
		oncomment (value) {
			let parent = getLastItem(stack);
			let node = createCommentNode(value);

			parent.body.push(node);
		},
		onprocessinginstruction (name, data) {
			let parent = getLastItem(stack);
			let node = createDirectiveNode(name, data);

			parent.body.push(node);
		},
		onclosetag (name) {
			stack.pop();
		},
	});

	parser.write(html);
	parser.end();
	return root;
}

function createFragmentNode () {
	return {
		type: NodeKind.Fragment,
		body: [],
	};
}

function createElementNode (name, attrs) {
	return {
		type: NodeKind.Element,
		name,
		attrs,
		body: [],
	};
}

function createTextNode (value) {
	return {
		type: NodeKind.Text,
		value,
	};
}

function createCommentNode (value) {
	return {
		type: NodeKind.Comment,
		value,
	};
}

function createDirectiveNode (name, data) {
	return {
		type: NodeKind.Directive,
		name,
		data,
	};
}

function createAttribute (key, value, type = QuoteKind.DoubleQuote) {
	return { key, value, type };
}

function getLastItem (arr) {
	return arr[arr.length - 1];
}


console.log(parse(`
	<!doctype html>
	<html lang='en'>
		<body>
			<div id='root'></div>
			<noscript>You need to enable JavaScript to view this site</noscript>
			<script type='module' src='./index.jsx'></script>
		</body>
	</html>
`));
