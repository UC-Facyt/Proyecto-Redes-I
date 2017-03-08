(function() {

	const remote = require('electron').remote;

	let minBtn = document.getElementById('min-btn');
	let maxBtn = document.getElementById('max-btn');
	let closeBtn = document.getElementById('close-btn')

	minBtn.addEventListener('click', function(e) {
		const win = remote.getCurrentWindow();
		win.minimize();
	});

	maxBtn.addEventListener('click', function(e) {
		const win = remote.getCurrentWindow();
		(win.isMaximized() ? win.unmaximize : win.maximize)();
	});

	closeBtn.addEventListener('click', function(e) {
		const win = remote.getCurrentWindow();
		win.close();
	});

	function rWinTitle() {
		let width = $window.width();
		let t = width > 355 ? winTitleFull : winTitleShort;
		$winTitle.text(t);
	}

})();
