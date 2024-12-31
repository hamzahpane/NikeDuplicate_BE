const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tagsModelSchema = new Schema({
  name: {
    type: String,
    minlength: [1, " Minimal 4 karakter "],
    maxlength: [30, "Max 30 karekrer"],
    required: [true, "Tags harus diisi"],
  },
});

module.exports = model("Tags", tagsModelSchema);
