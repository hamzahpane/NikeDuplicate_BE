const Tags = require("./tagsModel");

// CREATE
const createTags = async (req, res, next) => {
  try {
    let payload = req.body;
    let tags = await Tags.create(payload);
    return res.status(201).json(tags);
  } catch (error) {
    console.log("Error creating tag:", error);
    next(error);
  }
};

// READ
const getTags = async (req, res, next) => {
  try {
    let tags = await Tags.find({}, "name");
    return res.json(tags);
  } catch (error) {
    console.log("Error retrieving tags:", error);
    next(error);
  }
};

// UPDATE
const updateTags = async (req, res, next) => {
  try {
    let payload = req.body;
    let tags = await Tags.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!tags) {
      return res.status(404).json({ message: "Tag not found" });
    }
    return res.json(tags);
  } catch (error) {
    console.log("Error updating tag:", error);
    next(error);
  }
};

// DELETE
const deleteTags = async (req, res, next) => {
  try {
    let tags = await Tags.findByIdAndDelete(req.params.id);
    if (!tags) {
      return res.status(404).json({ message: "Tag not found" });
    }
    return res.json({ message: "Tag deleted successfully", tags });
  } catch (error) {
    console.log("Error deleting tag:", error);
    next(error);
  }
};

module.exports = {
  createTags,
  getTags,
  updateTags,
  deleteTags,
};
