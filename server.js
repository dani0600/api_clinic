const https = require("https");
const http = require('http');

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./app");

require("dotenv").config();

// Routes
const persons = require("./routes/persons");
const tumors = require("./routes/tumors");
const surgeries = require("./routes/surgeries");
const metastasis = require("./routes/metastasis");
const livingPlaces = require("./routes/livingplaces");
const relatives = require("./routes/relatives");
const postalCodes = require("./routes/postalCodes");
const forms = require("./routes/forms");

const app = express();

// Routers
app.use('/persons', persons);
app.use('/tumors', tumors);
app.use('/metastasis', metastasis);
app.use('/surgeries', surgeries);
app.use('/livingplaces', livingPlaces);
app.use('/relatives', relatives);
app.use('/postalCodes', postalCodes);
app.use('/upload', forms);

app.use(cors({
   origin: "https://git.heroku.com/apiclinic" ,
   optionsSuccessStatus: 200 // some legacy browsers didn't work with 204
  }
));

app.use(express.json()); //parses incoming requests as JSON

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});

//establish connection to database
(async function start() {
  try{
      await db.connect();
  }
  catch (error) {
      console.error(error);
  }
})()

//app.listen(process.env.PORT || 4000);
//https options
const options = {};

https
    .createServer(options, app)
    .listen(process.env.PORT, ()=>{
            console.log('Server is running at port ' + process.env.PORT);
    }
);

http
    .createServer(app)
    .listen(process.env.HTTP_PORT, ()=>{
            console.log('Server is running at port ' + process.env.HTTP_PORT);
    }
);

app.get('/', (req, res) => res.sendStatus(200));
