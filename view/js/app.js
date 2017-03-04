(function() {
	window.$ = window.jQuery = require('jquery'); /* jQuery :( */

	/* Window titles */
	const winTitleFull  = 'Project Cthullu Protocol';
	const winTitleShort = 'PCP';
	
	const $window = $(window);
	const $winTitle = $('.window-title');
	const $chatBox = $('.chat-textarea-inner');
	const $cthulluBtn = $('#cthullu-btn');
	const $cthullu = $('#cthulito');

	$cthulluBtn.on('mousedown', function() {
	    $cthullu.attr('src', 'images/mini-cthullu-click.svg');
	});

	$cthulluBtn.on('mouseup', function() {
	    $cthullu.attr('src', 'images/mini-cthullu.svg');
	});

	function rWinTitle() {
		let width = $window.width();
		let t = width > 355 ? winTitleFull : winTitleShort;
		$winTitle.text(t);
	}

	function rPlaceholder() {
		let width = $window.width();
		let ph = 'Cthullu';

		if (width < 215) ph += '...';
		else if (width < 255) ph += ' wants...';
		else if (width < 285) ph += ' wants your...'
		else ph += ' wants your soul!';

		$chatBox.attr('placeholder', ph);
	};

	/* Call on load */
	rWinTitle();
	rPlaceholder();

	/* Bind events */
	$window.on('resize', rPlaceholder);
	$window.on('resize', rWinTitle);

	/* Javascript puro 

	sendBtn = document.getElementById('enviomod');
	sendBtn.addEventListener('mousedown', function() {
	    document.getElementById('cthulito').src = 'images/mini-click.png';
	});

	sendBtn.addEventListener('mouseup', function() {
	    document.getElementById('cthulito').src = 'images/mini.png';
	});

	*/
})();