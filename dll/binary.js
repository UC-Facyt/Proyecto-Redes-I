const config = require('./config.js');

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

exports.remCharCont = (bits) => {

	/* log2(config.MAX_BYTES + 1) */
	return bits.substr(10);
}

exports.bytesContCheck = (bits) => {

	const bCont = bits.substr(0, config.CONT_SIZE);
	const dCont = parseInt(cont, 2);
	const data = bits.substr(config.CONT_SIZE)
	const byteCount = Math.ceil(data.length / 8);

	return (byteCount != dCont) ? false : true;
}