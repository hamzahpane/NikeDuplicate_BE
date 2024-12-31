var mongoose = require("mongoose");
var { dbHost, dbName, dbPort } = require("../app/config");

mongoose
  .connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

var db = mongoose.connection;

db.on("error ", (error) => {
  console.error("Mongodb conenection", error);
});

module.exports = db;
