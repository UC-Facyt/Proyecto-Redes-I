(function() {
	window.$ = window.jQuery = require('jquery'); /* jQuery :( */

	let mCthullu = $('#cthulito');

	$('#cthullu-btn').on('mousedown', function() {
	    mCthullu.attr('src', 'images/mini-cthullu-click.svg');
	});

	$('#cthullu-btn').on('mouseup', function() {
	    mCthullu.attr('src', 'images/mini-cthullu.svg');
	});

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