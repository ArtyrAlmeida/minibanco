const express = require("express");
const fs = require("fs");
const app = express();

const port = 3000;
const database = JSON.parse(fs.readFileSync('src/database.json'));

app.use(express.json());

function getNewId() {
    const accountList = database.accountList;
    if(accountList.length == 0) return 1;

    const ids = accountList.map(account => account.id);

    return Math.max(ids) + 1;
}


app.get("/", (req, res) => {
    res.json({ message: "Executando!" }).send();
});

app.get("/accountsList", (req, res) => {
    res.json(database).send();
});

app.post("/createAccount", (req, res) => {
    const { name, cpf } = req.body;

    const newAccount = {
        name,
        cpf,
        id: getNewId(),
        statement: []
    };

    database.accountList.push(newAccount);
    fs.writeFile('src/database.json', JSON.stringify(database, null, 4), err => console.log("Writen in database"));

    return res.status(201).send();
})

app.listen(port, () => console.log(`Executando na porta ${port}`))