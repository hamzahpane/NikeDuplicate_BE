const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoInc = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

let userSchema = Schema(
  {
    username: {
      type: String,
      required: [true, "Nama Harus Di Isi"],
      maxlength: [25, "Panjang Nama Harus 2-15 karakter"],
      minlength: [3, "Panjang Nama Minimal 3 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email Harus Di Isi"],
      maxlength: [255, "Panjang Email Maksimal 255 karakter"],
      minlength: [5, "Panjang Email Minimal 5 karakter"],
      validate: {
        validator: function (value) {
          if (!value) return false; // Menambahkan validasi untuk memeriksa apakah email tidak kosong
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          return emailRegex.test(value); // Validasi dengan regex yang lebih baik
        },
        message: (attr) => `${attr.value} harus merupakan email valid`,
      },
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [10, "Panjang password minimal harus 10 karakter"],
      maxlength: [255, "Panjang password maksimal adalah 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

// Validasi agar email unik
userSchema.path("email").validate(
  async function (value) {
    try {
      if (!value) return false; // Memeriksa apakah email kosong
      const count = await this.model("User").countDocuments({ email: value });
      return count === 0; // Pastikan email belum terdaftar
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// Pre-save untuk mengenkripsi password
const Has_round = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, Has_round);
  next();
});

userSchema.plugin(AutoInc, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
