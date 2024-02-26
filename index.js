const express = require("express"); //Importa la librería.
const app = express(); //Inicialización de la variable que usará la librería.
const router = express.Router(); //Enrutar los servicios web.
const port = 9090; //Puerto por el que escuchará el servidor.
require("dotenv").config(); //Se importan las variables de entorno.

const socket = require('socket.io'); //Importa la librería de socket.io
const http = require('http').Server(app);//Importa la librería http y configura el server con la variable app que es la que contiene todo el programa.
const io = socket(http);//Crea el servidor con el socket y le pasa la variable http.

const DB_URL = process.env.DB_URL || '';

const mongoose = require("mongoose"); //Importa la libería de mongoose.
mongoose.connect(DB_URL); //Crear la cadena de conexión con Atlas en este caso.

const userRoutes = require("./routes/UserRoutes");
const houseRoutes = require("./routes/HouseRoutes");
const messageRoutes = require('./routes/messageRoutes');

const messageSchema = require('./models/message');

io.on('connect', (socket) => {
  console.log("Connected");
  //Con el metodo ON se escuchan eventos desde el servidor.
  socket.on('message', (data) => {
    let payload = JSON.parse(data);
    messageSchema(payload).save().then((result) => {
      console.log(payload.body);
      socket.emit('message-receipt', {"message" : "This is the message sent from vs code"});
    }).catch((error) => {
      console.log("Error" + error.message);
    })
    //Con el metodo emit, se emiten eventos hacia el cliente.
    //En el postman para que funcione el servicio, se debe configurar como socket.io y configurarlo con http://localhost:9090
    
  });

  socket.on('disconnect', (socket) => {
    console.log("Disconnected");
  })

});

app.use(express.urlencoded({ extended: true })); //Acceder a la información de las URLs.
app.use(express.json()); //Analizar información en formato JSON.

app.use((req, res, next) => {
  res.io = io;
  next();
})

app.use(router);
app.use('/uploads', express.static('uploads'));
app.use("/", userRoutes);
app.use("/", houseRoutes);
app.use('/', messageRoutes);
http.listen(port, () => {
  console.log("Listen on port: " + port);
});
