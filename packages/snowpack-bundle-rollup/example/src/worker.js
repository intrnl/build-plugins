console.log('Hello from worker thread!');

/** @type {Worker} */
let ctx = self;

ctx.onmessage = (ev) => {
	if (ev == 'greet') {
		console.log('Message from main thread!');
	}
};
