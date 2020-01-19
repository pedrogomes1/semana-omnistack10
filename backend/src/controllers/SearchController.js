const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  //Preciso do query param, pq preciso filtrar por latitude, longitude e tecnologias
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        //Posso ter vários filtros dentro das techs
        $in: techsArray // retorno os devs que contenha as techs digitadas pelo usario
      },
      location: {
        //Consigo encontar objetos perto de uma localização (near) ... mongodb operators
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });
    return res.json(devs);
  }
};
