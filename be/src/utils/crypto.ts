import CryptoJS from 'crypto-js'

export function encrypt(clearText: string, secret: string): string {
   return CryptoJS.AES.encrypt(clearText, secret).toString();
}

export function decrypt(ciphertext: string, secret: string): string {
   return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8);
}
