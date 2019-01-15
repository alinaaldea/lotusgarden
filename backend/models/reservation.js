const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  email: String,
  phone_number: Number,
  start_dateTime: Date,
  end_dateTime: Date,
  table_id: Number
});

module.exports = mongoose.model("Reservation", reservationSchema);
