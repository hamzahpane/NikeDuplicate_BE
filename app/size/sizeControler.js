const Size = require("./sizeModel");

// CREATE
const createSize = async (req, res, next) => {
  try {
    let payload = req.body;
    let size = await Size.create(payload);
    return res.status(201).json(size);
  } catch (error) {
    console.log("Error creating size:", error);
    next(error);
  }
};

// READ
// READ
const getSizes = async (req, res, next) => {
  try {
    // Mengambil field 'value' bukan 'velue'
    let sizes = await Size.find({}, "value");
    return res.json(sizes);
  } catch (error) {
    console.log("Error retrieving sizes:", error);
    next(error);
  }
};

// UPDATE
const updateSize = async (req, res, next) => {
  try {
    let payload = req.body;
    let size = await Size.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }
    return res.json(size);
  } catch (error) {
    console.log("Error updating size:", error);
    next(error);
  }
};

// DELETE
const deleteSize = async (req, res, next) => {
  try {
    let size = await Size.findByIdAndDelete(req.params.id);
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }
    return res.json({ message: "Size deleted successfully", size });
  } catch (error) {
    console.log("Error deleting size:", error);
    next(error);
  }
};

module.exports = {
  createSize,
  getSizes,
  updateSize,
  deleteSize,
};
