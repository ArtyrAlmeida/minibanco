import express from "express";
import { prismaClient } from "./prismaClients.js";
import { encryptPassword, decryptPassword } from "./utils/cripto.js";
const app = express();

const port = 3000;

app.use(express.json());

const userExists = async (req, res, next) => {
    const { cpf } = req.headers;
    try {
        const data = await prismaClient.user.findFirst({
            where: {
                cpf
            },
            select: {
                id: true
            }
        })
        if (!data) return res.status(400).json({ error: "User not found" });
        req.userId = data.id;
    
        next();
    } catch {
        return res.status(400).json({ data: error, has_error: true })
    }
}

app.get("/", (req, res) => {
    res.json({ message: "Executando!" }).send();
});

app.get("/accountsList", async (req, res) => {
    try {
        const data = await prismaClient.user.findMany({
            include: {
                statement: {
                    select: {
                        id: true,
                        type: true,
                        value: true
                    }
                }
            }
        });
        return res.status(200).json({ accounts: data });
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }
});

app.post("/createAccount", async (req, res) => {
    const { name, cpf, password } = req.body;
    

    try {  
        const data = await prismaClient.user.create({ 
            data: {
                name,
                cpf,
                password: encryptPassword(password)
            }
         })
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }

    return res.status(201).send();
});

app.post("/deposit", userExists, async (req, res) => {
    const body = req.body;
    const userId = req.userId;

    try {  
        const data = await prismaClient.statement.create({ 
            data: {
                ...body,
                userId
            }
         })
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }

    return res.status(201).send();
});

app.post("/login", (req, res) => {
    
});

app.listen(port, () => console.log(`Executando na porta ${port}`));