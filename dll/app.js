(function() {

	const config = require('./config.js');
	const fs = require('fs');
	const bin = require('./binary.js');
	const crc = require('./crc.js');
	const ham = require('./hamming.js');

	/* Sweg */
	function processChunk(chunk) {

		for (let b of bin.bytes2Bits(chunk)) {

			let packet = b;
			/* Assembly packet here (i think) */
			//packet = addCharCont(b);

			console.log('Rosquete');
			console.log(packet);

			console.log('\nConteo de caracteres:')
			packet = bin.addCharCont(packet);
			console.log(packet);

			switch (config.MODE) {
			 	case 'crc':
			 		console.log('\nCRC-16:')
			 		packet = crc.crc_16(packet);
			 		console.log(packet);
			 		break;

			 	case 'hamming':
			 		console.log('\nHamming:')
			 		packet = ham.segHamming(packet);
			 		console.log(packet);
			 		break

			 	default:
			 		break;
			 }
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