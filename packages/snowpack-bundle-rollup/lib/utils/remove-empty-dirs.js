import * as fs from 'fs/promises';
import * as path from 'path';


export async function removeEmptyDirectories (dirname) {
	let lstat = await fs.lstat(dirname);
	if (!lstat.isDirectory()) return;

	let list = await fs.readdir(dirname);

	if (list.length) {
		await Promise.all(
			list.map((entry) => removeEmptyDirectories(path.join(dirname, entry)))
		);

		list = await fs.readdir(dirname);
	}

	if (!list.length) {
		await fs.rmdir(dirname);
	}
}
