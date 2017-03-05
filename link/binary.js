const fs = require('fs');

const msgFile = 'mensajes.txt';
const maxSize = 1023;

const leftPad = (str, pad) => "0".repeat(pad-str.length) + str;

function* bytes2Bits(chunk) {
	
	let cont = 0;
	let byteArray = [];

	for (const byte of chunk) {

		bin = byte.toString(2);
		bin = leftPad(bin, 8);

		byteArray.push(bin);
		cont++;

		if (byte == 0x0a || cont >= maxSize) {

			console.log(`${cont} bytes`);
			console.log(`${cont * 8} bits`);

			yield byteArray.join('');
			byteArray = [];
			cont = 0;
		}
	}
}

function bits2Bytes(bits) {

	
	while (bits) {
		
	}
}

function processChunk(chunk) {

	for (let b of bytes2Bits(chunk)) {
		console.log(b);
	}
}

function readFile(path) {
	let stream = fs.createReadStream(path);
	stream.on('data' , processChunk);
	stream.on('error', (err) => {
		console.log(err);
	});
}

readFile(msgFile);

/*
fs.open(msgFile, 'r', (err, fd) => {

	if (err) throw err;

	console.log(fd);

	let buf = Buffer.alloc(1024);

	fs.read(fd, buf, 0, buf.length, 0, (err, bytes) => {
		
		if (err) throw err;

		console.log(bytes + " bytes read");

		if(bytes > 0){
			console.log(buf.slice(0, bytes));
		}

	});
});
*/