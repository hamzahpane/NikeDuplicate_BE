const Category = require("./categoryModel");

const createCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);
  } catch (error) {
    console.log("Error tidak masuk:", error); // Perbaikan pada console.log
    next(error); // Menggunakan next untuk meneruskan error ke middleware
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    console.log("Error tidak terupdate:", error);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  // Perbaikan nama fungsi
  try {
    let category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.log("Category tidak terhapus:", error);
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    let category = await Category.find({}, "name");
    return res.json(category);
  } catch (error) {
    console.log("Tidak dapat menampilkan data category:", error);
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory, // Pastikan export menggunakan nama yang benar
  getCategory,
};
