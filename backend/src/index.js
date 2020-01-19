const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http'); //Vai ouvir tanto as requisiçoes http quato as de websocket
const routes = require("./routes");
const { setupWebSocket } = require('./websocket')

const app = express();

const server = http.Server(app) //Tenho um servidor http fora do express

setupWebSocket(server) // A função vai ser disparada assim que a aplicação inicializar

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-h5u5v.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

app.use(cors()); //Libera para que possa acessar externamente, como acessar através do react
app.use(express.json()); //Tem que vir antes do routes
app.use(routes);
server.listen(3333);
