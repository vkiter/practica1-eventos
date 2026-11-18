const express = require('express');
const mongoose = require('mongoose');

const recintos = require(__dirname + '/routes/recintos.js');
const eventos = require(__dirname + '/routes/eventos.js');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventos';
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGODB_URI);

app.use(express.json());

app.use('/recintos', recintos);
app.use('/eventos', eventos);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
