const mongoose = require("mongoose");

module.exports.connect = function (callback) {
  mongoose.connect("mongodb://localhost:27017/biliard");

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};
