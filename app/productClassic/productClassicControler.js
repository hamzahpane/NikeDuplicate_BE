const ProductNews = require("./productClassicModel");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const createProductNews = async (req, res, next) => {
  try {
    const payload = req.body;

    if (req.file) {
      const filename = req.file.filename; // Nama file yang diunggah
      const targetPath = path.join(
        config.rootPath,
        "public/images/productNews",
        filename // Lokasi tujuan penyimpanan file
      );

      try {
        // Membuat instance ProductNews dengan data payload dan image_url
        const productNews = new ProductNews({
          ...payload,
          image_url: `/images/productNews/${filename}`,
        });

        // Simpan ke database
        await productNews.save();

        // Kirim respons sukses
        return res.status(201).json({
          message: "Product news created successfully",
          data: productNews,
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
      const productNews = new ProductNews(payload);
      await productNews.save();

      // Kirim respons sukses
      return res.status(201).json({
        message: "Product news created successfully",
        data: productNews,
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

const getProductNews = async (req, res, next) => {
  try {
    const productNews = await ProductNews.find();
    console.log("Product News Data:", productNews);
    return res.status(200).json({
      message: "Show Product News Successfully",
      data: productNews,
    });
  } catch (error) {
    console.error("Error in getProductNews:", error);
    return next(error);
  }
};

const getProductNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productNews = await ProductNews.findById(id);

    if (!productNews) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Show Product Successfully",
      data: productNews,
    });
  } catch (error) {
    console.error("Error in getProductNewsById:", error);
    return next(error);
  }
};

module.exports = { createProductNews, getProductNews, getProductNewsById };
