const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categoryModelWomenSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [4, "Minimal 4 karakter"],
      maxlength: [30, "Max 30 karakter"],
      require: [true, "Isi category"],
    },
  },
  { timestamps: true }
);

module.exports = model("categoryWomen", categoryModelWomenSchema);
