function randomString(_string_length) {
    
    var string_length = _string_length;
    if(string_length < 3)
        string_length = 2;
    	
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    
    var str = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        str += chars.substring(rnum,rnum+1);
    }
    return str;
}

function randomNumber(_length) {
    
    var string_length = _length;
    if(string_length < 3)
        string_length = 2;
    	
    var chars = "0123456789";
    
    var num = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        num += chars.substring(rnum,rnum+1);
    }
    return num*1;
}

function randomKey(_numOfBlocks, _blockLength) {
    var numOfBlocks = _numOfBlocks;
    var blockLength = _blockLength;
    
    if(numOfBlocks == undefined || numOfBlocks < 3) numOfBlocks = 2;
    if(blockLength == undefined || blockLength < 3) blockLength = 2;
    
    var key = "";
    
    for (var i=0; i<numOfBlocks; i++) {
        if(key.length == 0)
            key = randomString(blockLength);
        else
            key = key + "-" + randomString(blockLength);
    }
	
    return key;
}

exports.randomString = randomString;
exports.randomNumber = randomNumber;
exports.randomKey = randomKey;

