const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
  },
});

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
