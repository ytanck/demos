### 日常demo合集

https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js

```js
// crypto加密
function encryptByAES(queryString, outKey) {
    const key = CryptoJS.enc.Utf8.parse(outKey);
    const dataBytes = CryptoJS.enc.Utf8.parse(queryString);
    const encrypted = CryptoJS.AES.encrypt(dataBytes, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    let encodeEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
    // FE716056BDF7C4BA15649871CE70E0B1xxx
    return encodeEncrypted;
}
```
