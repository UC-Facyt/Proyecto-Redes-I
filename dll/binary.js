#!/usr/bin/node

const string_decoder = require('string_decoder');
const fs = require('fs');

const StringDecoder = string_decoder.StringDecoder;
const decoder = new StringDecoder('utf-8');

const MSG_FILE = 'mensajes.txt';
const CONT_SIZE = 10 
const MAX_BYTES = 1023;

const leftPad = (str, pad) => "0".repeat(pad-str.length) + str;
const bin2Str = (num, pad) => leftPad(num.toString(2), pad);

function* bytes2Bits(chunk) {
	
	let bitArray = [];

	for (const byte of chunk) {
		bitArray.push(bin2Str(byte, 8));

		if (byte == 0x0a || MAX_BYTES <= bitArray.length) {
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

	/* log2(MAX_BYTES + 1) */
	return bits.substr(10);
}

function bytesContCheck(bits) {

	const bCont = bits.substr(0, CONT_SIZE);
	const dCont = parseInt(cont, 2);
	const data = bits.substr(CONT_SIZE)
	const byteCount = Math.ceil(data.length / 8);

	return (byteCount != dCont) ? false : true;
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

/* Add an argument with hamming number? */

const parityCount = (bCount) => Math.ceil(Math.log2(bCount+1));

exports.remParityBits = (bits) => {

	const bitArr = bits.split('');
	const pCount = parityCount(bits.length);

	for (let p=(1 << pCount); p > 0; p>>=1) 
		bitArr.splice(p-1, 1);

	return bitArr.join('');
}

function parityBits(bits, pCount) {

	const bCount = bits.length;
	const buf   = new ArrayBuffer(pCount);
	const pBits = new Uint8Array(buf).fill(0);

	const parity = (index) => {
		for (let j=0; j < pCount; j++) {
			if (((index >> j) & 1) && bits[index-1] == 1)
				pBits[j] ^= 1
		}
	};

	for (let i=1; i <= bCount; i++) 
		if ((i & i-1) != 0) parity(i);

	return pBits;
}

exports.hamming = (bits) => {

	const bCount = bits.length;
	const bitArr = bits.split('');
	let res = bits.length;

	let i = 0;
	let p = 1;
	for (i=0, p=1; res > 0; i+=1, p<<=1) {
		bitArr.splice(p-1, 0, 0); /* Important! */
		res -= (p << 1) - p - 1;
	}

	const pCount = i
	const pBits = parityBits(bitArr, pCount);

	for(i=0, p=1; p < bCount; i++, p<<=1) 
		bitArr[p-1] = pBits[i]

	return bitArr.join('');
}

exports.hammingCorrect = (bits) => {

	const bCount = bits.length;
	const bitArr = bits.split('');
	const pCount = parityCount(bCount);
	const pBits  = parityBits(bitArr, pCount);

	let err = 0;
	for(let i=0, p=1; p < bits.length; i++, p<<=1) 
		if (pBits[i] != bits[p-1]) err += p;

	const bad = err - 1;

	/* La inmutabilidad del cangrejo */
	if (bad >= 0 && bad < bCount) 
		bitArr[bad] = (bits[bad] == 1) ? 0 : 1;

	return {
		bits: bitArr.join(''),
		err: bad
	};
}

function readFile(path) {
	const stream = fs.createReadStream(path);
	stream.on('data' , processChunk);
	stream.on('error', (err) => {
		console.log(err);
	});
}

readFile(MSG_FILE);
