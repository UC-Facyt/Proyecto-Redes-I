exports.relleno = function(s){
	return s.replace(/(11111)/g,"111110");
}

exports.desRelleno = (s)=>{
    s = s.replace(/(111110)/g,"11111");
    return s.replace(/(111111)/g,"11111");
}

exports.banderiador = (s)=>{
    return "01111110" + s + "01111110";
}

exports.apatrida = (s)=>{
    return s.slice(8).slice(0,-8)
}

exports.flagVerification = (s)=>{
	flag = "01111110";
	coolBruh = true;

	if(s.slice(8) != flag)
	{
		coolBruh = false;
	}

	if(s.slice(-8) != flag)
	{
		coolBruh = false;
	}

	return coolBruh;

}
