const ProductFuture = require("./productFutureModel");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const productFutureModel = require("./productFutureModel");

const createProductFuture = async (req, res, next) => {
  try {
    const payload = req.body;

    if (req.file) {
      const filename = req.file.filename; // Nama file yang diunggah
      const targetPath = path.join(
        config.rootPath,
        "public/images/productsFuture",
        filename // Lokasi tujuan penyimpanan file
      );

      try {
        // Membuat instance ProductFuture dengan data payload dan image_url
        const productFuture = new ProductFuture({
          ...payload,
          image_url: `/images/productsFuture/${filename}`, // Menggunakan path yang benar
        });

        // Simpan ke database
        await productFuture.save();

        // Kirim respons sukses
        return res.status(201).json({
          message: "Product news created successfully",
          data: productFuture,
        });
      } catch (error) {
        // Jika ada error, hapus file yang sudah diunggah
        if (fs.existsSync(targetPath)) {
          await fs.promises.unlink(targetPath).catch((err) => {
            console.error(`Failed to delete file at ${targetPath}:`, err);
          });
        }

        // Jika error adalah validasi, kirim respons khusus
        if (error.name === "ValidationError") {
          return res.status(400).json({
            error: true,
            message: error.message,
            fields: error.errors,
          });
        }

        // Jika error lain, lanjutkan ke middleware error handler
        return next(error);
      }
    } else {
      // Jika tidak ada file yang diunggah, hanya simpan data payload
      const productFuture = new ProductFuture(payload);
      await productFuture.save();

      // Kirim respons sukses
      return res.status(201).json({
        message: "Product news created successfully",
        data: productFuture, // Perbaiki nama objek data yang dikirim
      });
    }
  } catch (error) {
    // Tangani error validasi
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: true,
        message: error.message,
        fields: error.errors,
      });
    }

    // Tangani error lain
    return next(error);
  }
};

const getProductFuture = async (req, res, next) => {
  try {
    const productFuture = await ProductFuture.find();
    console.log("Product News Data:", productFuture);
    return res.status(200).json({
      message: "Show Product News Successfully",
      data: productFuture,
    });
  } catch (error) {
    console.error("Error in getProductNews:", error);
    return next(error);
  }
};

const getProductFutureById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productFuture = await productFutureModel.findById(id);

    if (!productFuture) {
      return res.status(404).json({
        message: "Product not Found",
      });
    }

    return res.status(200).json({
      message: "Show Product Successfully",
      data: productFuture,
    });
  } catch (error) {
    console.error("Error in getProductFutureById:", error);
    return next(error); // Tangani error lain dengan middleware
  }
};

module.exports = {
  createProductFuture,
  getProductFuture,
  getProductFutureById,
};
