const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categoryModelSchema = new Schema({
  name: {
    type: String,
    minlength: [4, " Minimal 4 karakter "],
    maxlength: [30, "Max 30 karekrer"],
    require: [true, " isi category"],
  },
});

module.exports = model("Category", categoryModelSchema);
