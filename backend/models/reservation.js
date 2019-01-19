const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone_number: Number,
  start_dateTime: Date,
  end_dateTime: Date,
  table_id: Number,
  number_of_people: Number,
  token: String
});

module.exports = mongoose.model("Reservation", reservationSchema);
