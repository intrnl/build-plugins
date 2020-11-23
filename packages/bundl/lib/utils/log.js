import * as kleur from 'kleur/colors';


export function log (type, message, ...substitutions) {
	let i = 0;
	message = message.replace(/%%/g, () => substitutions[i++]);

	if (type == 'error') {
		message = kleur.red(message);
		process.exitCode = 1;
	}

	if (type == 'info') message = kleur.blue(message);

	console[type](message);
}
