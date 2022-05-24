const https = require("https");
const http = require('http');
const usersDB = require('./auth/users/services/mongoose.service');

const express = require("express");
const cors = require("cors");
const db = require("./app");

require("dotenv").config();

// Routes
const persons = require("./routes/persons");
const radon = require("./routes/stations/radon");
const tumors = require("./routes/tumors");
const surgeries = require("./routes/surgeries");
const metastasis = require("./routes/metastasis");
const livingPlaces = require("./routes/livingplaces");
const relatives = require("./routes/relatives");
const worklifes = require("./routes/worklifes");
const expositions = require("./routes/expositions");
const suggestions = require("./routes/suggestions");
const postalCodes = require("./routes/postalCodes");
const contaminants = require("./routes/contaminants");
const forms = require("./routes/forms");
const AuthorizationRouter = require('./routes/auth');
const UsersRouter = require('./routes/users');

//Middleware, JWT Protection
const { endpointProtection } = require('./services/middlewares/endpoint.protection.middleware');

const app = express();
app.use(express.json()); //parses incoming requests as JSON
app.use(express.urlencoded({ extended: false }));
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);


// Routers
app.use('/persons', persons);
app.use('/tumors', tumors);
app.use('/metastasis', metastasis);
app.use('/surgeries', surgeries);
app.use('/worklifes', worklifes);
app.use('/expositions', expositions);
app.use('/livingplaces', livingPlaces);
app.use('/relatives', relatives);
app.use('/radon',radon);
app.use('/suggestions', suggestions);
app.use('/postalCodes', postalCodes);
app.use('/contaminants', contaminants);
app.use('/upload', forms);

app.use(cors({
   origin: [
      "https://git.heroku.com/apiclinic",
      "https://lungtrackerweb.web.app"
   ],
   optionsSuccessStatus: 200 // some legacy browsers didn't work with 204
  }
));

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
  try{
      await usersDB.start();
  }
  catch(error){
      console.log(error);
  }
  try{
      app.listen(process.env.PORT, () => {
          console.log("Server started at port " + process.env.PORT);
      });
  }
  catch(error){
      console.log(error);
  }
})()

//app.listen(process.env.PORT || 4000);
//https options
// const options = {};

// https
//     .createServer(options, app)
//     .listen(process.env.PORT, ()=>{
//             console.log('Server is running at port ' + process.env.PORT);
//     }
// );


app.get('/', (req, res) => res.sendStatus(200));
