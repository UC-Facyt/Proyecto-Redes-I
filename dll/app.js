(function() {

	const config = require('./config.js')
	const fs = require('fs');

	/* Sweg */
	function processChunk(chunk) {

		for (let b of bytes2Bits(chunk)) {

			let packet = b;
			/* Assembly packet here (i think) */
			//packet = addCharCont(b);
			console.log(packet);
			console.log(bits2Bytes(packet));
			// 

			/* Receptor */
			// packet = remCharCont(packet);
			// bits2Bytes(packet);
		}
	}


	function readFile(path) {
		const stream = fs.createReadStream(path);
		stream.on('data' , processChunk);
		stream.on('error', (err) => {
			console.log(err);
		});
	}
	
	readFile(config.MSG_FILE);

})();