const readline = require('readline');
const config = require('./config.js');
const fs = require('fs');
const bin = require('./binary.js');
const crc = require('./crc.js');
const ham = require('./hamming.js');
const flg = require('./flags.js');

const hexdump = (bits) => {
	for (let i=0; i < bits.length; i+=8) {
		let bin = bits.substr(i, 8);
		let hex = parseInt(bin, 2).toString(16)
		process.stdout.write(hex + ' ');
	}
}

function createPacket(packet) {
	console.log('Rosquete');
	console.log(packet);
	// hexdump(packet);

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

	console.log('\nRelleno:')
	packet = flg.relleno(packet);
	console.log(packet);

	console.log('\nBanderas:')
	packet = flg.banderiador(packet);
	console.log(packet);
	return packet;
}

function disasPacket(packet) {
	let coolBruh = true;
	console.log('\nBanderas:');
	coolBruh = flg.flagVerification(packet);

	if(!coolBruh) {
		console.log("Las Banderas estan mal");
		packet = -1;
	}
	else {
		packet = flg.apatrida(packet);
		console.log(packet);

		console.log('\nRelleno:');
		packet = flg.desRelleno(packet);
		console.log(packet);

		switch (config.MODE) {
			case 'crc':
		 		console.log('\nCRC-16:');
		 		coolBruh = crc.crc_16_Ver(packet);
		 		packet = crc.unCrc(packet);
		 		console.log(packet);
				if(!coolBruh) {
					console.log("CRC: Hay un problema");
					packet = -1;
				}
				else{
					console.log("CRC: Todo bien");
				}
		 		break;

		 	case 'hamming':
		 		console.log('\nHamming:');

		 		let code = ham.correctPacket(packet);
		 		for (let s of code) {
		 			console.log(s);
		 		}

		 		packet = code.map(h => {
		 			if (h.err != -1) console.log('Hamming: Hubo un duende y se recupero ', h.err);
		 			return h.bits;
		 		}).join('');

		 		console.log(packet);

		 		packet = ham.remPacketParityBits(packet);
		 		console.log(packet);

		 		break

		 	default:
		 		break;
		}
		if(coolBruh)
		{
			console.log('\nConteo:');
			coolBruh = bin.bytesContCheck(packet)
			packet = bin.remCharCont(packet);
			if(!coolBruh){
				console.log("Conteo de caracteres: Algo anda mal");
				packet = -1;
			}
		}

		console.log(packet);
	}
	return packet;
}

exports.disasPacket = disasPacket;

function readChannel(callback) {

	fs.readFile(config.CHANNEL, 'utf8', (err, data) => {
		tramas = data.split('\n');
		tramas.pop();
		console.log(tramas);
		util = tramas.map(disasPacket);
		callback(util);
	});
}

/* This function "sends" the data */
function writeChannel(chunk, text = false) {

	const chl = fs.createWriteStream(config.CHANNEL);
	const empty = "01111110000000000001111110";
	const tramas = [];

	const writeEmptyPacket = () => {
		if (!text) {
			chl.write(empty);
			tramas.push(empty);
		}
	};

	/* If is not text */
	writeEmptyPacket()

	for(let b of bin.bytes2Bits(chunk)) {
		let trama = createPacket(b);
		chl.write(trama + '\n'); /* Trollface */
		tramas.push(trama);
	}

	writeEmptyPacket();

	chl.end();
	console.log(tramas);
};

exports.readChannel = readChannel;
exports.writeChannel = writeChannel;

exports.readFile = (path) => {

	const stream = fs.createReadStream(path);
	stream.on('data' , writeChannel);
	stream.on('error', (err) => {
		console.log(err);
	});
}



// readFile(config.MSG_FILE);
