import express from "express";
import { prismaClient } from "./prismaClients.js";
const app = express();


const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Executando!" }).send();
});

app.get("/accountsList", async (req, res) => {
    try {
        const data = await prismaClient.user.findMany();
        return res.status(200).json({ accounts: data });
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }
});

app.post("/createAccount", async (req, res) => {
    const body = req.body;

    try {  
        const data = await prismaClient.user.create({ 
            data: {
                ...body
            }
         })
    } catch (error) {
        return res.status(400).json({ data: error, has_error: true });
    }

    return res.status(201).send();
});

app.listen(port, () => console.log(`Executando na porta ${port}`))