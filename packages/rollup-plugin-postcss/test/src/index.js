import css1 from './style1.module.css';
import css2 from './style2.module.css';


document.body.append(
	Object.assign(document.createElement('div'), {
		textContent: 'Hello World!',
		className: [css1.helloWorld, css2.bar].join(' '),
	})
);
