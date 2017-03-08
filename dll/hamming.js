const config = require('./config.js');
const bin = require('./binary.js');
const string_decoder = require('string_decoder');

const StringDecoder = string_decoder.StringDecoder;
const decoder = new StringDecoder('utf-8');

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


/* Add an argument with hamming number? */

function hamming(bits) {

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

	for(i=0, p=1; i < pBits.length; i++, p<<=1) 
		bitArr[p-1] = pBits[i]

	console.log(bitArr.join(''));

	return bitArr.join('');
}

exports.segHamming = (packet) => {

	let codes = [];
	let cont = bin.getCharCont(packet);
	let rest = bin.remCharCont(packet);

	codes.push(hamming(cont));
	for (let i=0; i < rest.length; i+=8) {
		let seg = rest.substr(i, 8);
		codes.push(hamming(seg));
	}

	return codes.join('');
};

exports.hamming = hamming;

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
