const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sizeModelSchema = new Schema({
  value: {
    type: Number,
    min: [1, "Minimal value adalah 1"],
    max: [1000, "Max value adalah 1000"],
    required: [true, "Size harus diisi"],
  },
});

module.exports = model("Size", sizeModelSchema);
