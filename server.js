var express = require("express");
var dotEnv = require("dotenv");
dotEnv.load();

var userDetails = require("./routes/users")


var app = express();

var port = process.env.PORT || 4001;

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
   res.send("Welcome to MongoDb API server")
})

app.use("/api/users", userDetails);
app.listen(port, () => {
   console.log("Server running");
})