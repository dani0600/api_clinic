var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
// get MongoDB driver connection
const dbo = require('./db/conn');
var router = express.Router();

app.use(router);
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
  app.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
  });
});

router.get("/", async function (req, res) {
 
  res.send("Hello World")

});





