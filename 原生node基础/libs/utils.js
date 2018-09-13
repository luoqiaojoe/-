module.exports = {
    parseEncodedStr(str){
        if(str){
            str = str.split('=')[1];
            str = str.substring(1, str.length-1);
        }
        return str;
    }
}