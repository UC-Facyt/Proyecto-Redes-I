#!/usr/bin/node

const string_decoder = require('string_decoder');
const fs = require('fs');

const StringDecoder = string_decoder.StringDecoder;
const decoder = new StringDecoder('utf-8');

const MSG_FILE = 'mensajes.txt';
const MAX_SIZE = 1023;

const leftPad = (str, pad) => "0".repeat(pad-str.length) + str;
const bin2Str = (num, pad) => leftPad(num.toString(2), pad);

function* bytes2Bits(chunk) {
	
	let bitArray = [];

	for (const byte of chunk) {
		bitArray.push(bin2Str(byte, 8));

		if (byte == 0x0a || MAX_SIZE <= bitArray.length) {
			yield bitArray.join('');
			bitArray = [];
		}
	}
}

function bits2Bytes(bits) {

	const textBytes = [];

	for (i=0; i < bits.length; i+=8) {
		octa = bits.substr(i, 8);
		byte = parseInt(octa, 2);
		textBytes.push(byte);
	}

	return textBytes;
}

function decodeBytes(bytes) {

	const buf = Buffer.from(bytes);
	return decoder.write(buf);
}

function addCharCont(bits) {

	const cont = bits.length / 8;
	return bin2Str(cont, 10) + bits;
}

function remCharCont(bits) {

	/* log2(MAX_SIZE + 1) */
	return bits.substr(10);
}

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

readFile(MSG_FILE);
