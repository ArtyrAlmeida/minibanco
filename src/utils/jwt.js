import pkg from 'jsonwebtoken';
import * as dotenv from "dotenv";

const { sign, verify } = pkg;
dotenv.config();

const login = (id) => {
    return sign({
        data: id
    }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    });
}

const validateJWT = (token) => {
    try {
        const { data } = verify(token, process.env.JWT_SECRET);
        return data;
    } catch {
        throw new Error;
    }
}

export { login, validateJWT };
