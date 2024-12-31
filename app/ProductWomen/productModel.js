const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productModelSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama minimal 3 karakter"],
      required: [true, "Nama produk harus diisi"],
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      maxlength: [1000, "Deskripsi maksimal 1000 karakter"],
      required: [true, "Isi deskripsi"],
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size", // Referensi ke model Size
    },
    rating: {
      type: Number,
      min: [0, "Rating minimal 0"],
      max: [5, "Rating maksimal 5"],
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categoryWomen",
    },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = model("ProductWomen", productModelSchema);
