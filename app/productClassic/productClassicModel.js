const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productNewsSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang produk minimal 3 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      minlength: [3, "Deskripsi minimal 3 karakter"],
    },
    rating: {
      type: Number,
      min: [0, "Rating minimal 0"],
      max: [5, "Rating maksimal 5"],
      default: 0,
    },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = model("productNews", productNewsSchema);
