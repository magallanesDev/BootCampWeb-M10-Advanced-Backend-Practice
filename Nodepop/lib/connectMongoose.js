'use strict';

const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
  console.log('Error de conexión a MongoDB', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('Conectado a MongoDB en la BD:', mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

// opcional
module.exports = mongoose.connection;