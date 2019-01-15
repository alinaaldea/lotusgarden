const express = require("express");
const router = express.Router();
var Reservation = require("../models/reservation.js");

/*SAVE RESERVATION*/
router.post("/add", function(req, res, next) {
  var newReservation = req.body;
  var date_start = new Date(newReservation.start_dateTime);
  var date_end = new Date(
    date_start.getFullYear(),
    date_start.getMonth() + 1,
    date_start.getDate(),
    date_start.getHours() + 2,
    date_start.getMinutes()
  );

  new Reservation({
    name: newReservation.name,
    email: newReservation.email,
    phone_number: newReservation.phone_number,
    start_dateTime: date_start,
    end_dateTime: date_end,
    table_id: newReservation.table_id,
    token:
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
  }).save(function(err) {
    if (err) {
      console.log("Couldn't save the reservation in the database ");
      res.status(400).json("Could not save your reservation. ");
    } else {
      console.log("SAVED!");
      res.status(200).json("Reservation saved succesfully");
    }
  });
});

/*GET THE TABLES FOR A TIMESLOT*/
router.get("/tables/:dateTime", function(req, res, next) {
  var dt = req.params.dateTime;
  var tables = [];
  Reservation.find({}).exec(function(err, reservations) {
    if (err) return next(err);
    for (var i = 0; i < reservations.length; i++) {
      var currentTable = null;
      var next_reservation = Reservation.findOne({
        table_id: reservations[i].table_id,
        start_dateTime: { $gt: dt }
      });
      if (
        dt > reservations[i].start_dateTime &&
        dt < reservations[i].end_dateTime
      ) {
        //the searched timeslot is during a reservation
        if (
          next_reservation.start_dateTime - reservations[i].end_dateTime <
          3600000
        ) {
          //3,600,000 ms = 1 h
          currentTable = {
            info: "Table unavailable (less then one hour).",
            value: 0
          };
          tables.push(currentTable);
        } else if (
          next_reservation.start_dateTime - reservations[i].end_dateTime >
            3600000 &&
          next_reservation.start_dateTime - reservations[i].end_dateTime <
            7200000
        ) {
          var minutes_available = available(
            next_reservation.start_dateTime,
            reservations[i].end_dateTime
          );
          currentTable = {
            info:
              "Table available for {$minutes_available} minutes, between {$reservations[i].end_dateTime} and {$next_reservation.start_dateTime}",
            value: minutes_available
          };
          tables.push(currentTable);
        } else {
          currentTable = {
            info: "Cloose a time later",
            value: 0
          };
          tables.push(currentTable);
        }
      } else {
        // the seached timeslot is outside a reservation
        if (next_reservation.start_dateTime - dt < 3600000) {
          currentTable = {
            info: "Table unavailable (less then one hour).",
            value: 0
          };
          tables.push(currentTable);
        } else if (
          next_reservation.start_dateTime - dt > 3600000 &&
          next_reservation.start_dateTime - dt < 7200000
        ) {
          var minutes_available = available(
            next_reservation.start_dateTime,
            dt
          );
          currentTable = {
            info:
              "Table available for {$minutes_available} minutes, between {$dt} and {$next_reservation.start_dateTime}",
            value: minutes_available
          };
          tables.push(currentTable);
        } else {
          currentTable = {
            info:
              "Table available for the next 2 hours. Default behavior => table green",
            value: 1
          };
          tables.push(currentTable);
        }
      }
    }
  });
  res.json(tables);
});

/*GET ALL THE RESERVATIONS FOR A SPECIFIC DAY - FOR THE RESTAURANT*/
router.get("/restaurant/reservations/:year/:month/:day", function(
  req,
  res,
  next
) {
  var reservations = Reservation.find(
    {
      start_dateTime: {
        $dateFromParts: {
          year: req.params.year,
          month: req.params.month,
          day: req.params.day
        }
      }
    },
    function(err) {
      console.log("An error has occured " + err);
    }
  );
  res.json(reservations);
});

function available(a, b) {
  //computes the minutes between 2 timestamps
  return Math.floor(b - a / 60000);
}

module.exports = router;
