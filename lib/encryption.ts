import CryptoJS from "crypto-js";

const SECRET = process.env.COOKIE_SECRET || "1234-6543-7390-1239-4445";

export function encrypt(text: any) {
    const stringified = typeof text === 'string' ? text : JSON.stringify(text);
    return CryptoJS.AES.encrypt(stringified, SECRET).toString();
}

export function decrypt(cipher: string) {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}
