### 日常demo合集

https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js

```js
// 加密
// ECB模式不需要偏移量。如果选择加密模式为CBC，则还需要生成16位数的iv
const msgEncrypted => (word, key) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let kkey =  CryptoJS.enc.Utf8.parse(key)
  let encrypted = CryptoJS.AES.encrypt(srcs, kkey, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

// 解密
// 解密模式同上，如果选择CBC，也需要传入相应的iv
const msgDecrypted => (content, key) {
  var sKey = CryptoJS.enc.Utf8.parse(key);
  var decrypt = CryptoJS.AES.decrypt(content, sKey, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  let deRes = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
  return deRes
}

```
