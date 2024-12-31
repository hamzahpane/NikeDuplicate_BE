const fs = require("fs");
const config = require("../config");
const Product = require("./productModel");
const path = require("path");
const Category = require("../Category/categoryModel");
const Tags = require("../Tags/tagsModel");
const productModel = require("./productModel");

const createProduct = async (req, res, next) => {
  try {
    let payload = req.body;

    // Proses kategori jika ada
    if (payload.category && payload.category.length > 0) {
      let category = await Category.find({ name: { $in: payload.category } });
      if (category.length > 0) {
        payload.category = category.map((ctgry) => ctgry._id);
      } else {
        delete payload.category;
      }
    }

    // Proses tag jika ada
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length > 0) {
        payload.tags = tags.map((tag) => tag._id);
      } else {
        delete payload.tags;
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
    const productMan = await productModel.find();
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
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    return res.status(200).json({
      message: " Show Prodcut susccesful",
      data: product,
    });
  } catch (error) {
    console.error(" Error in getProduct Id :", error);
    return next(error);
  }
};
module.exports = {
  createProduct,
  getProductMan,
  getProductId,
};
