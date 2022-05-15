const https = require("https");
const http = require('http');
const usersDB = require('./auth/users/services/mongoose.service');

const express = require("express");
const cors = require('cors');
require("dotenv").config();

const db = require("./app");

// Routes
const persons = require("./routes/persons");
const expositions = require("./routes/expositions");
const tumors = require("./routes/tumors");
const surgeries = require("./routes/surgeries");
const metastasis = require("./routes/metastasis");
const livingPlaces = require("./routes/livingplaces");
const relatives = require("./routes/relatives");
const worklifes = require("./routes/worklifes");
const suggestions = require("./routes/suggestions");
const postalCodes = require("./routes/postalCodes");
const forms = require("./routes/forms");
const AuthorizationRouter = require('./routes/auth');
const UsersRouter = require('./routes/users');

// Middleware
const { endpointProtection } = require('./middlewares/endpoint.protection.middleware');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://localhost:4000'
    ],
    optionsSuccessStatus: 200 // some legacy browsers didn't work with 204
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});



// Routers
app.use('/persons', persons);
app.use('/tumors', tumors);
app.use('/metastasis', metastasis);
app.use('/surgeries', surgeries);
app.use('/livingplaces', livingPlaces);
app.use('/worklifes', worklifes);
app.use('/relatives', relatives);
app.use('/suggestions', suggestions);
app.use('/postalCodes', postalCodes);
app.use('/upload', forms);
app.use('/expositions', expositions);

//JWT protection
//app.use(endpointProtection);

//Index page (static HTML)
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/index.html");
});

(async function start() {
    try{
        await db.connect();
    }
    catch (error) {
        console.error(error);
    }
    try{
        await usersDB.start();
    }
    catch(error){
        console.log(error);
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