const express = require("express");
const fs = require("fs");
const app = express();

const port = 3000;
const database = JSON.parse(fs.readFileSync('src/database.json'));

app.use(express.json());


app.get("/", (req, res) => {
    res.json({ message: "Executando!" }).send();
});

app.get("/accountsList", (req, res) => {
    res.json(database).send();
})

app.listen(port, () => console.log(`Executando na porta ${port}`))