(function() {

	/* Uglyness */

	const chatMsg = $('.chat-messages');
	const chatBox = $('.chat-textarea');
	let extraPixels = 0;

	$('#chat-box').on('keydown', (e) => {

		if (extraPixels < 100) {
			extraPixels += 15;
			chatBox.css('height', `${45+extraPixels}px`);
			chatMsg.css('height', `calc(100vh - (${155+extraPixels}px))`);
		}

	});
})();