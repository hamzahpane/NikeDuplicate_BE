const categoryWomen = require("./categoryModel");

const createCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new categoryWomen(payload);
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    console.error("Error tidak masuk:", error);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = await categoryWomen.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    console.error("Error tidak terupdate:", error);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    let category = await categoryWomen.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.error("Category tidak terhapus:", error);
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    let category = await categoryWomen.find({});
    return res.json(category);
  } catch (error) {
    console.error("Tidak dapat menampilkan data category:", error);
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
