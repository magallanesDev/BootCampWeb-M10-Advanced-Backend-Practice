'use strict';

const mongoose = require('mongoose');

// definir un esquema
const anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
});

// creamos método estático (del modelo)
anuncioSchema.statics.lista = function(filtros, skip, limit, select, sort) {
  const query = Anuncio.find(filtros);
  query.skip(skip);
  query.limit(limit);
  query.select(select);
  query.sort(sort);
  return query.exec();
}

// creo el modelo con ese esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// opcional - exporto el modelo
module.exports = Anuncio;

  