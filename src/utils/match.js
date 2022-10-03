import { decryptPassword } from "./cripto.js"

export const match = (incomingPassword, userPassword) => {
    return incomingPassword === decryptPassword(userPassword);
}