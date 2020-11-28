import { h, render } from 'preact';
import css from './style.module.css';


function App () {
	return (
		<div className={css.helloWorld}>Hello world!</div>
	);
}

render(<App />, document.querySelector('#root'));

let workerUrl = new URL('./worker.js', import.meta.url);
let worker = new Worker(workerUrl, { type: 'module' });

worker.postMessage('greet');
