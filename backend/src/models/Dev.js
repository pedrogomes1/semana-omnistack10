const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String], //Vetor de strings
  location: {
    type: PointSchema,
    index: "2dsphere" //Indice .. basicamente o eixo x e y
  }
});

module.exports = mongoose.model("Dev", DevSchema);
