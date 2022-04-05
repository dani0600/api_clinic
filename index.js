const express = require("express");
const cors = require('cors');

const db = require("./app");

// Routes
const persons = require("./routes/persons");
const tumors = require("./routes/tumors");
const surgeries = require("./routes/surgery");
const metastasis = require("./routes/metastasis");
const livingPlaces = require("./routes/livingplaces");

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
app.use('/tumors', tumors);

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
