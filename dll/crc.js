
exports.crc_16 = function(a){
    let s = a;
    let polynome = "10001000000100001";
    s = s + "0".repeat(polynome.length -1);
    s = s.split('');
    s = limpia(s);

    while(s.length > (polynome.length -1)){
        s = excluOr(s,polynome);
        s = limpia(s);
    }

    s = s.join('');
    if(s == ""){
        a = a + "0".repeat((polynome.length -1));
    }
    else{
        if(s.length != (polynome.length - 1))
        {
            s = '0'.repeat(polynome.length - s.length) + s
        }
        a = a + s
    }
    return a
}

exports.crc_16_Ver = function(a){
    let s = a;
    let polynome = "10001000000100001";
    s = s.split('');
    s = limpia(s);

    while(s.length > (polynome.length -1)){
        s = excluOr(s,polynome);
        s = limpia(s);
    }

    s = s.join('');
    return s == "";
}

exports.unCrc = (s)=>{
    return s.slice(0,-16);
}

excluOr = function(s,polynome){
    for(let i = 0; i< polynome.length ; i++){
        s[i] = s[i] ^ polynome[i];
    }
    return s;
}

limpia = function(s){
    while(s.length > 0 && s[0] != 1){
        s.shift(1);
    }
    return s;
}
