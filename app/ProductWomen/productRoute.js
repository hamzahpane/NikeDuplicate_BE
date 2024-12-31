const router = require("express").Router();
const mime = require("mime-types"); // Gunakan mime-types
const controler = require("./productControler");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/productsWomen");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `product-${Date.now()}${Math.floor(Math.random() * 100)}.${mime.extension(
        file.mimetype
      )}` // Gunakan mime.extension
    );
  },
});

const upload = multer({ storage });
router.post("/products", upload.single("image_url"), controler.createProduct);
router.get("/getProductwomen", controler.getProductMan);
router.get("/getProductwomen/:id", controler.getProductId);
module.exports = router;
