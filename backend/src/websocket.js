const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io;
const connections = [];

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query; //Recebo os parâmetros do connect lá do mobile
      
        //Salvando todas conexões feitas na aplicação
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        })
    })
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10 && connection.techs.some(item => techs.includes(item))//Comparo as coordenadas do novo dev cadastrado com as coordenadas armazenadas em cada uma das conexões ali em cima
    })
}

exports.sendMesssage = (to, message, data) => { //Data é o valor, dados do dev cadastrado
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)// p quem quero enviar a msg
    })
}