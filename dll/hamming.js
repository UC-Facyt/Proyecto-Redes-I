const config = require('./config.js');
const bin = require('./binary.js');

const parityCount = (bCount) => Math.ceil(Math.log2(bCount+1));

function remParityBits(bits) {

	const bitArr = bits.split('');
	const pCount = parityCount(bits.length);

	for (let p=(1 << pCount); p > 0; p>>=1) 
		bitArr.splice(p-1, 1);

	return bitArr.join('');
}

function applyPacket(packet, callback, bCount = 10, uCount = 8) {

	let codes = []
	let cont = packet.substr(0, bCount);
	let rest = packet.substr(bCount);

	codes.push(callback(cont));
	for(let i=0; i < rest.length; i+=uCount) {
		let seg = rest.substr(i, uCount);
		codes.push(callback(seg));
	}

	return codes;
}

exports.remPacketParityBits = (packet) => {
	return applyPacket(packet, remParityBits, 14, 12).join('');
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

	for(i=0, p=1; i < pCount; i++, p<<=1) 
		bitArr[p-1] = pBits[i]

	return bitArr.join('');
}

function detectCorrect(bits) {

	const bCount = bits.length;
	const bitArr = bits.split('');
	const pCount = parityCount(bCount);
	const pBits  = parityBits(bitArr, pCount);

	let err = 0;
	for(let i=0, p=1; i < pCount; i++, p<<=1) 
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

exports.segHamming = (packet) => {
	return applyPacket(packet, hamming).join('');
};

exports.correctPacket = (packet) => {
	return applyPacket(packet, detectCorrect, 14, 12);
};

exports.hamming = hamming;
exports.detectCorrect = detectCorrect;