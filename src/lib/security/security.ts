
var arc4 = require('arc4/min/lib/normal/arc4');
var CryptoJS = require("crypto-js");

export class Crypto {

  constructor() {

  }

  arc4Encode(content:any, key:any){
    var cipher = arc4(key);
    var d = cipher.encodeString(content);
    return d;
  }

  hmacEncode(content:any, key:any) {
    return CryptoJS.HmacSHA1(content, key).toString();
  }

  md5Encode(content:string) {
    return CryptoJS.MD5(content).toString();
  }
  base64Decode(content: string) {
    var words = CryptoJS.enc.Base64.parse(content);
    return CryptoJS.enc.Utf8.stringify(words);
  }
  base64DecodeLatin1(content: string) {
    var words = CryptoJS.enc.Base64.parse(content);
    return CryptoJS.enc.Latin1.stringify(words);
  }

}
