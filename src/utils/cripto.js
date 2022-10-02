import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";

dotenv.config();

const encryptPassword = (password) => {
    const encrypted = CryptoJS.AES.encrypt(
        password, process.env.SECRET
    ).toString();


    console.log(encrypted);
    return encrypted;
}

const decryptPassword = (password) => {
    const decrypted = CryptoJS.AES.decrypt(
        password, process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);

    return decrypted;
}

export { encryptPassword, decryptPassword };