// There's no way your bundles would go larger than megabytes, is there?
let units = ['B', 'kB', 'MB'];

export function prettyBytes (number) {
	if (number == 0) return number + ' ' + units[0];

	let exponent = Math.min(Math.floor(Math.log10(number) / 3), units.length - 1);
	let unit = units[exponent];

	number = (number / Math.pow(1000, exponent)).toPrecision(3);

	return number + ' ' + unit;
}
