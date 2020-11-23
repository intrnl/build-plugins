import { h, render } from 'preact';
import css from './style.module.css';


function App () {
	return (
		<div className={css.helloWorld}>Hello world!</div>
	);
}

console.log(import.meta.env.MODE)
render(<App />, document.querySelector('#root'));
