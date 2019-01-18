const express = require("express");
const router = express.Router();
var Reservation = require("../models/reservation.js");
const nodemailer = require("nodemailer");

/*SAVE RESERVATION*/
router.post("/add", function(req, res, next) {
  var newReservation = req.body;
  var date_start = new Date(newReservation.start_dateTime);
  var date_end = new Date(newReservation.end_dateTime);
  var token =
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);
  new Reservation({
    name: newReservation.name,
    email: newReservation.email,
    phone_number: newReservation.phone_number,
    start_dateTime: date_start,
    end_dateTime: date_end,
    table_id: newReservation.table_id,
    token: token
  }).save(function(err) {
    if (err) {
      console.log("Couldn't save the reservation in the database ");
      res.status(400).json("Could not save your reservation. ");
    } else {
      console.log("SAVED!");
      monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var day =
        date_start.getDate() +
        " " +
        monthNames[date_start.getMonth()] +
        " " +
        date_start.getFullYear();
      var hourstart = (date_start.getHours()-1) + ":";
      hourstart += date_start.getMinutes() == 0 ? "00" : date_start.getMinutes();
      var hourend = (date_end.getHours()-1) + ":";
      hourend += date_end.getMinutes() == 0 ? "00" : date_end.getMinutes();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "webProgr.test.41@gmail.com",
          pass: "webProgr.test.41AA"
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"LotusGarden 🌼" <webProgr.test.41@gmail.com>', // sender address
        to: newReservation.email, // list of receivers
        subject: "Confirmation of reservation", // Subject line
        html: `<h2> Thank you for joining us! </h2> <br> <p>You have a reservation for ${day}, from ${hourstart} to ${hourend}. <br> <p>We look forward to serving you!</p><br>If you want to cancel the reservation, please enter this code on our webpage: <b>${token}</b><br><br>Have a wonderful day, <br>Team LotusGarden` // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log("Message sent: %s", info.messageId);
      });

      res.status(200).json("Reservation saved succesfully");
    }
  });
});

/*CANCEL RESERVATION*/
router.post("/cancel", function(req, res, next){
  var token = req.body.token;
  Reservation.deleteOne({token : token}, function(err) {
    if(err){
      res.status(400).json("Reservation could not be deleted");
    } else {
      res.status(200).json("Reservation cancelled succesfully");
    }
  })
})

/*GET THE TABLES FOR A TIMESLOT*/
router.get("/tables", function(req, res, next) {
  var body_date = new Date(req.body.dt);
  var dt = new Date(
    body_date.getFullYear(),
    body_date.getMonth(),
    body_date.getDate(),
    body_date.getHours(),
    body_date.getMinutes()
  );
  console.log(body_date.getHours());
  var start_of_day = new Date(
    body_date.getFullYear(),
    body_date.getMonth(),
    body_date.getDate(),
    13, //hour 12
    0
  );
  var end_of_day = new Date(
    body_date.getFullYear(),
    body_date.getMonth(),
    body_date.getDate(),
    24, //hour 23
    0
  );

  var tables = [];
  console.log(dt);
  console.log(start_of_day);
  console.log(end_of_day);
  //in case the datetime is during a reservation
  Reservation.find(
    {
      $or: [
        {
          $and: [
            //this means that our datetime is overlapping a reservation
            { start_dateTime: { $lt: dt, $gte: start_of_day } },
            { end_dateTime: { $gt: dt, $lt: end_of_day } }
          ]
        },
        {
          //return the next reservation after our datetime
          $and: [{ end_dateTime: { $gt: dt, $lt: end_of_day } }]
        }
      ]
    },
    function(err, reservations) {
      if (err) console.log(err);
      if (reservations) {
        // console.log(reservations);
        return reservations;
      }
    }
  ).then(function(reservations) {
    reservations.forEach(function(reservation) {
      console.log("start_dateTime: " + reservation.start_dateTime);
      console.log("dt: " + dt);
      console.log(reservation.start_dateTime - dt);
      //find out the next reservation at this table
      if (
        reservation.start_dateTime - dt > 3600000 &&
        reservation.start_dateTime - dt < 7200000
      ) {
        var minutes_available = Math.floor(
          (reservation.start_dateTime - dt) / 60000
        );
        var message = `Reservation available at table ${
          reservation.table_id
        } for ${minutes_available} minutes.`;
        var table1 = {
          info: message,
          minutes_available: minutes_available,
          table_id: reservation.table_id
        };
        console.log(message + "  " + reservation._id);
        tables.push(table1);
      } else if (reservation.start_dateTime - dt >= 7200000) {
        // var message = `Reservation available at table ${reservation.table_id}.`;
        // var table1 = {
        //   info: message,
        //   minutes_available: minutes_available,
        //   table_id: reservation.table_id
        // };
        // tables.push(table1);
      } else {
        var message = "Table not available at this time";
        var table2 = {
          info: message,
          minutes_available: 0,
          table_id: reservation.table_id
        };
        console.log(reservation);
        tables.push(table2);
      }
    });
    // console.log(tables);
    res.json(tables);
  });
});

/*GET ALL THE RESERVATIONS FOR A SPECIFIC DAY - FOR THE RESTAURANT*/
router.get("/restaurant/all_reservations", function(req, res, next) {
  var body_date = new Date(req.body.dt);

  var start_of_day = new Date(
    body_date.getFullYear(),
    body_date.getMonth(),
    body_date.getDate(),
    13, //hour 12
    0
  );
  var end_of_day = new Date(
    body_date.getFullYear(),
    body_date.getMonth(),
    body_date.getDate(),
    24, //hour 23
    0
  );

  Reservation.find(
    {
      $and: [
        { start_dateTime: { $gte: start_of_day } },
        { end_dateTime: { $lt: end_of_day } }
      ]
    },
    function(err, reservations) {
      if (err) console.log(err);

      if (reservations) {
        return reservations;
      }
    }
  ).then(function(reservations) {
    res.json(reservations);
  });
});

module.exports = router;
