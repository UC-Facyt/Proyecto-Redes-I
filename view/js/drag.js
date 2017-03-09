(function () {

    const dragCthullu = 'url(images/cthullu-logo-drag.svg), none';

    const body = document.getElementsByTagName('body')[0];
    const modal = document.getElementById('dragomonster');
    const chatarea = document.getElementsByClassName('chat-textarea-inner')[0];
    const chatMsgs = $('.chat-messages');
    const fs = require('fs');
    const chatsito = document.getElementById('chatc');
    const app = require('../../dll/app.js');
    const bin = require('../../dll/binary.js');

    // Cthulito
    const cthulluButt = $('#cthullu-btn')

    body.ondragover = (e) => {
        modal.style.display = "block";
        chatMsgs.css('background-image', dragCthullu);
        return false;
    };

    body.ondragleave = (e) => false;
    body.ondragend = (e) => false;
    body.ondrop = () => false;

    modal.ondragover = (e) => {
        modal.style.display = "block";
        chatMsgs.css('background-image', dragCthullu);
        return false;
    };

    modal.ondragleave = (e) => {
        modal.style.display = "none";
        chatMsgs.css('background-image', '');
        return false
    };

    modal.ondragend = (e) => false;

    modal.ondrop = (e) => {
        e.preventDefault();
        modal.style.display = "none";
        chatMsgs.css('background-image', '');

        let f = e.dataTransfer.files[0]
        console.log('File(s) you dragged here: ', f.path)
        console.log('File(s) name ',f.name)
        if(isTxt(f.name)){
            dataFileTxt(f.path);
        }
        else {
            app.readFile(f.path);
            app.readChannel(updateNoTxt);
        }

        return false;
    };

    const isTxt = (s) => {
        return s.substring(s.length -3 ,s.length) == "txt"
    }

    const dataFileTxt = (s) => {
        fs.readFile(s, 'utf8', (err, data) => {
            if (err) throw err;
            modChat(data);
        });
    }

    const modChat = (s)=>{
        chatarea.value = s.slice(0,-1);
    }

    chatarea.onkeyup = function(e){
        e = e || event;
        if (e.keyCode === 13) {
            envio();
        }
        return true;
    }

    const envio = () => {
        text = chatarea.value
        chatarea.value = "";

        if(text.slice(-1) != "\n") {
            text = text + "\n";
        }

        if (text != "\n" && text != "") {
            console.log(text);
            chatsito.innerHTML = chatsito.innerHTML + "<p>Emisor : " + text + "</p>";
            const buf = Buffer.from(text, 'utf8');
            app.writeChannel(buf, readChannelText, true);
        }
    }

    function readChannelText() {
        console.log('Epale');
        console.log(updateMsgs);
        app.readChannel(updateMsgs);
    }

    function updateMsgs(tramas) {

        const bits = tramas.join('');
        const bytes = bin.bits2Bytes(bits);

        let msg = bin.decodeBytes(bytes);
        console.log(msg);
        chatsito.innerHTML = chatsito.innerHTML + "<p>Receptor : " + msg + "</p>";
        chatsito.scrollTop = chatsito.scrollHeight;
    }

    function updateNoTxt(tramas) {

        const bits = tramas.join('');
        const bytes = bin.bits2Bytes(bits);

        console.log('Algo que no es texto ha llegado!');
    }

    cthulluButt.on('click', () => app.readChannel(updateMsgs));

})();
