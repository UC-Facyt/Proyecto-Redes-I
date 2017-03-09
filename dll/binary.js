const config = require('./config.js');
const string_decoder = require('string_decoder');

const StringDecoder = string_decoder.StringDecoder;
const decoder = new StringDecoder('utf-8');

const leftPad = (str, pad) => "0".repeat(pad-str.length) + str;
const bin2Str = (num, pad) => leftPad(num.toString(2), pad);

exports.bytes2Bits = function* (chunk) {
	
	let bitArray = [];
	for (const byte of chunk) {
		bitArray.push(bin2Str(byte, 8));

		/* Uglyness */
		if (byte == 0x0a || config.MAX_BYTES <= bitArray.length) {
			yield bitArray.join('');
			bitArray = [];
		}
	}

	if (bitArray.length != 0)
		yield bitArray.join('');
}

exports.bits2Bytes = (bits) => {

	const textBytes = [];

	for (i=0; i < bits.length; i+=8) {
		octa = bits.substr(i, 8);
		byte = parseInt(octa, 2);
		textBytes.push(byte);
	}

	return textBytes;
}

exports.decodeBytes = (bytes) => {

	const buf = Buffer.from(bytes);
	return decoder.write(buf);
}

exports.addCharCont = (bits) => {

	const cont = bits.length / 8;
	return bin2Str(cont, 10) + bits;
}

exports.remCharCont = (bits) => bits.substr(10);
exports.getCharCont = (bits) => bits.substr(0, 10);

exports.bytesContCheck = (bits) => {

	const bCont = bits.substr(0, config.CONT_SIZE);
	const dCont = parseInt(bCont, 2);
	const data = bits.substr(config.CONT_SIZE)
	const byteCount = Math.ceil(data.length / 8);

	return (byteCount != dCont) ? false : true;
}
