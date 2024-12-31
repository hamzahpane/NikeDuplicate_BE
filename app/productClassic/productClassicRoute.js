const express = require("express");
const router = express.Router();
const mime = require("mime-types"); // Untuk menentukan ekstensi file berdasarkan MIME type
const multer = require("multer");
const controller = require("./productClassicControler");

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Direktori tujuan penyimpanan file
    cb(null, "public/images/productNews");
  },
  filename: function (req, file, cb) {
    // Nama file unik berdasarkan timestamp
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const ext = mime.extension(file.mimetype); // Dapatkan ekstensi file dari MIME type

    // Pastikan file memiliki ekstensi yang valid
    if (!ext) {
      return cb(new Error("Invalid file type"), false);
    }

    cb(null, `product-${uniqueSuffix}.${ext}`);
  },
});

// Middleware upload menggunakan Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validasi MIME type file (hanya menerima gambar)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only .jpg, .jpeg, and .png files are allowed!"),
        false
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // Maksimal ukuran file: 2MB
  },
});

// Endpoint untuk membuat product news
router.post(
  "/createClasic",
  upload.single("image_url"), // Middleware Multer untuk upload file
  (req, res, next) => {
    controller.createProductNews(req, res, next).catch(next); // Menangani error dari async controller
  }
);

router.get("/getClasic", controller.getProductNews);
router.get("/getClasic/:id", controller.getProductNewsById);
module.exports = router;
