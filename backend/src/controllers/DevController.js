const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");
const Dev = require("../models/Dev");
const { findConnections, sendMesssage } = require ('../websocket')

module.exports = {
  //Listar Usuarios
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },
  //Cadastar Usuarios
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      //Caso n existir
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = response.data; // name = login, caso o usuario não existir, pega o login da api do git

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      const sendSocketMessageTo = findConnections({ latitude, longitude}, techsArray)
      
      sendMesssage(sendSocketMessageTo, 'new-dev', dev)

    }
    return res.json(dev);
  },

  async update(req, res) {
    const {
      github_username,
      name,
      avatar_url,
      bio,
      techs,
      latitude,
      longitude
    } = req.body;
    //Falta techs e location

    let user = await Dev.findOne({ github_username });

    if (user) {
      (user.name = name),
        (user.avatar_url = avatar_url),
        (user.bio = bio),
        (user.techs = parseStringAsArray(techs)),
        (user.location.cordinates.latitude = latitude),
        (user.location.cordinates.longitude = longitude);

      const userUpdated = await Dev.updateOne(user);
    }
    return response.json(userUpdated);
    // const dev = await Dev.findByIdAndUpdate(
    //   id,
    //   {
    //     name,
    //     avatar_url,
    //     bio
    //   },
    //   { new: true }
    // );

    // await dev.save();
  },
  async destroy(req, res) {
    const id = req.params.id;

    try {
      await Dev.findByIdAndDelete(id);
      return res.json("Deletado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }
};
