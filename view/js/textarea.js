(function() {

	/* Uglyness */

	const chatMsg = $('.chat-messages');
	const chatBox = $('.chat-textarea');
	const text = $('textarea');
	let extraPixels = 0;

	$('#chat-box').on('keydown', (e) => {
		console.log(text);
		console.log(chatBox.css('height'))
		chatBox.css('height', `calc(45px + ${e.target.scrollHeight}px)`);
		chatMsg.css('height', `calc(100vh - (${155+e.target.scrollHeight}px))`);
	});

	$('textarea').each(function () {
		this.setAttribute('style', `height: calc(100% - ${this.scrollHeight+24}px);`);
	}).on('input', function () {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});

})();