var path = require("path");
var bodyParser = require("body-parser");
//server
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var reservationRoutes = require("./routes/reservations");
var config = require("./config.json");

mongoose.connect(
  "mongodb://alinaaldea:alinaaldeaDS123@ds157204.mlab.com:57204/reservationdb",
  { useNewUrlParser: true }
);

app.use(function (req, res, next) {

    // Website allowed to connect to server
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers allowed
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Cookies not allowed
    res.setHeader('Access-Control-Allow-Credentials', false);

    next();
});

const port = 3000;
app.listen(port, () => {
  console.log("Server running on port %d ", port);
});

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/reservations", reservationRoutes);

app.get("/", function(eq, res) {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/getReservations", function(eq, res) {
    res.sendFile(path.join(__dirname, "../frontend/getReservations.html"));
});