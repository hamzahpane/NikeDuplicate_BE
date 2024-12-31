const controller = require("./categoryControler");
const Router = require("express").Router();

Router.get("/category", controller.getCategory);
Router.post("/category", controller.createCategory);
Router.put("/category/:id", controller.updateCategory);
Router.delete("/category/:id", controller.deleteCategory); // Perbaikan nama fungsi

module.exports = Router;
