const express = require("express");
const cors = require('cors');

const db = require("./app");

// Routes
const persons = require("./routes/persons");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    optionsSuccessStatus: 200 // some legacy browsers didn't work with 204
}));

// Routers
app.use('/persons', persons);


app.get('/', (req, res) => res.sendStatus(200));

(async function start() {
    try{
        await db.connect();
        app.listen(port, () => {
            console.log("Server started at port " + port);
        });
    }
    catch (error) {
        console.error(error);
    }
})()
