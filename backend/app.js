var path = require("path");
var bodyParser = require("body-parser");
//server
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var artistsRoutes = require("./routes/reservations");

mongoose.connect(
  "mongodb://alinaaldea:alinaaldeaDS123@ds157204.mlab.com:57204/reservationdb",
  { useNewUrlParser: true }
);

const port = 3000;
app.listen(port, () => {
  console.log("Server running on port %d ", port);
});

app.get("/", function(eq, res) {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
