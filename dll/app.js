const config = require('./config.js');
const fs = require('fs');
const bin = require('./binary.js');
const crc = require('./crc.js');
const ham = require('./hamming.js');
const flg = require('./flags.js');

function createPacket(packet) {
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

	console.log('\nRelleno:')
	packet = flg.relleno(packet);
	console.log(packet);

	console.log('\nBanderas:')
	packet = flg.banderiador(packet);
	console.log(packet);
	return packet;
}

function disasPacket(packet) {

	console.log('\nBanderas:');
	packet = flg.apatrida(packet);
	console.log(packet);

	console.log('\nRelleno:');
	packet = flg.desRelleno(packet);
	console.log(packet);

	switch (config.MODE) {
		case 'crc':
	 		console.log('\nCRC-16:');
	 		console.log(crc.crc_16_Ver(packet) ? 'Nene' : 'Pupu');
	 		packet = crc.unCrc(packet);
	 		console.log(packet);
	 		break;

	 	case 'hamming':
	 		console.log('\nHamming:');

	 		let code = ham.correctPacket(packet);
	 		for (let s of code) {
	 			console.log(s);
	 		}

	 		packet = code.map(h => {
	 			if (h.err != -1) console.log('Ay papa: ', h.err);
	 			return h.bits;
	 		}).join('');

	 		console.log(packet);

	 		packet = ham.remPacketParityBits(packet);
	 		console.log(packet);

	 		break

	 	default:
	 		break;
	}

	console.log('\nConteo:');
	console.log(bin.bytesContCheck(packet) ? 'Nene' : 'Pupu');
	packet = bin.remCharCont(packet);

	console.log(packet);

	return packet;
}

/* This class "puts" the data on the channel */
function Channel() {
	this.wt = fs.createWriteStream(config.CHANNEL);
	this.put = (bits) => this.wt.write(bits + '\n');
	this.end = () => this.wt.end();
	return this;
}

exports.Channel = Channel;

function processChunk(chunk, text = false) {
	
	const empty = "01111110000000000001111110";
	const channel = Channel();
	const tramas = [];

	/* Cambiar esto a una funcion mas escalable */
	if(!text) {
		channel.put(empty);
		tramas.push(empty);
	}

	for (let b of bin.bytes2Bits(chunk)) {
		let trama = createPacket(b);
		channel.put(trama);
		tramas.push(trama);
	}

	if(!text) {
		channel.put(empty);
		tramas.push(empty);
	}

	channel.end();
	console.log(tramas);
};

exports.processChunk = processChunk;

exports.readFile = (path) => {
	const stream = fs.createReadStream(path);
	stream.on('data' , processChunk);
	stream.on('error', (err) => {
		console.log(err);
	});
}


// readFile(config.MSG_FILE);
