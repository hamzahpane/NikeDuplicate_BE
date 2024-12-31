const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const config = require("../config");
const Product = require("./productModel");
const categoryWomen = require("../CategoryWomen/categoryModel");
const Size = require("../size/sizeModel");

const createProduct = async (req, res, next) => {
  try {
    let payload = req.body;

    // Proses kategori jika ada
    if (payload.category) {
      let category = await categoryWomen.findOne({ name: payload.category });
      if (category) {
        payload.category = category._id;
      } else {
        delete payload.category;
      }
    }

    // Proses ukuran jika ada
    if (payload.size) {
      let size = await Size.findOne({ value: payload.size });
      if (size) {
        payload.size = size._id;
      } else {
        delete payload.size;
      }
    }

    // Proses file gambar jika ada
    if (req.file) {
      let filename = req.file.filename;
      let target_path = path.join(config.rootPath, "public/uploads", filename);

      try {
        let product = new Product({ ...payload, image_url: filename });
        await product.save();
        return res.json(product);
      } catch (error) {
        // Hapus file jika terjadi error saat menyimpan produk
        fs.unlink(target_path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
        if (error.name === "ValidationError") {
          return res.status(400).json({
            error: 1,
            message: error.message,
            fields: error.errors,
          });
        }
        next(error);
      }
    } else {
      // Jika tidak ada file, langsung simpan produk
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const getProductMan = async (req, res, next) => {
  try {
    const productMan = await Product.find();
    console.log("Product Man Data :", productMan);
    return res.status(200).json({
      message: " Show Product Man Successfully",
      data: productMan,
    });
  } catch (error) {
    console.error("Error in getProductMan: ", error);
    return next(error);
  }
};

const getProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validasi format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Show Product Successful",
      data: product,
    });
  } catch (error) {
    console.error("Error in getProductId:", error.message);

    // Kembalikan respon JSON dengan error message
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProductMan,
  getProductId,
};
