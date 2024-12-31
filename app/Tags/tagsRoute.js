const controler = require("./tagsControler");
const Route = require("express").Router();

Route.post("/Tags", controler.createTags);
Route.get("/Tags", controler.getTags);
Route.put("/Tags/:id", controler.updateTags);
Route.delete("/Tags/:id", controler.deleteTags);

module.exports = Route;
