const controller = require("./sizeControler");
const Route = require("express").Router();

Route.post("/sizes", controller.createSize);
Route.get("/sizes", controller.getSizes);
Route.put("/sizes/:id", controller.updateSize);
Route.delete("/sizes/:id", controller.deleteSize);

module.exports = Route;
