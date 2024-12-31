const controller = require("./categoryControler");
const Router = require("express").Router();

Router.get("/categories", controller.getCategory);
Router.post("/categories", controller.createCategory);
Router.put("/categories/:id", controller.updateCategory);
Router.delete("/categories/:id", controller.deleteCategory);

module.exports = Router;
