//Esse arquivo fica responsável apenas para converter as techs em array, já que searchController.js
//e o DevController.js precisam do método para retirar os espaços e separar por virgulas as techs

module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(",").map(tech => tech.trim()); // //Percorre um array e para cada tech, ele remove os espaços
};
