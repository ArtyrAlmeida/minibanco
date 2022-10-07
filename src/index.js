import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { prismaClient } from "./prismaClients.js";
import { encryptPassword } from "./utils/cripto.js";
import { login, validateJWT } from "./utils/jwt.js";
import { match } from "./utils/match.js";

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
                id: true,
                cpf: true
            }
        })
        if (!data) return res.status(400).json({ error: "User not found" });
        req.userId = data.id;
        req.userCPF = data.cpf;
    
        next();
    } catch {
        return res.status(400).json({ data: error, has_error: true })
    }
}

const validateUser = (req, res, next) => {
    const token = req.headers.authentication;

    try {
        const id = validateJWT(token);
    } catch (error) {
        return res.status(401).json({ error: "Unauthenticated" });
    }

    next();
}

const getBalance = async (cpf) => {
    try {
        const data = await prismaClient.user.findFirst({
            where: {
                cpf
            },
            select: {
                statement: true
            }
        });
        return data.statement.reduce((acc, operation) => {
            if(operation.type === "credit") {
                return acc + operation.value;
            }
            else {
                return acc - operation.value;
            }
        }, 0);
    } catch (error) {
        return error;
    }
}

app.get("/", (req, res) => {
    res.json({ message: "Executando!" }).send();
});

app.get("/accountsList", async (req, res) => {
    try {
        const data = await prismaClient.user.findMany({
            select: {
                name: true,
                id: true
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

app.post("/deposit", userExists, validateUser,async (req, res) => {
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

app.post("/withdraw", userExists, validateUser, async (req, res) => {
    const body = req.body;
    const userId = req.userId;
    const userCPF = req.userCPF;
    
    const balance = await getBalance(userCPF);

    if(balance < body.value) {
        return res.status(400).json({ error: "Insufficient funds" }).send();
    }
    
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

app.put("/editAccount", userExists, validateUser, async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

    try {
        const data = await prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                name: name
            }
        });
        return res.status(204).json({ updated: name });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
});

app.get("/statement", userExists, validateUser, async (req, res) => {
    const userId = req.userId;

    try {
        const data = await prismaClient.statement.findMany({
            where: {
                userId: userId
            }
        });
        return res.status(200).json({ userStatement: data });
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }
});

app.delete("/deleteAccount", userExists, validateUser, async (req, res) => {
    const userId = req.userId;

    try {
        const data = await prismaClient.user.delete({
            where: {
                id: userId
            }
        });
        return res.status(200).json({ deleted: userId });
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }
})

app.post("/login", async (req, res) => {
    const { cpf, password } = req.body;
    
    try {
        const data = await prismaClient.user.findUnique({
            where: {
                cpf
            }
        });
        if (!data) {
            return res.status(403).json({ error: "User not found" });
        }
        else if (match(password, data.password)) {
            if(data.id != undefined) return res.status(200).json({token: login(data.id)});
        }
        else {
            return res.status(403).json({ error: "Incorrect password" });
        }
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }
});

app.listen(port, () => console.log(`Executando na porta ${port}`));