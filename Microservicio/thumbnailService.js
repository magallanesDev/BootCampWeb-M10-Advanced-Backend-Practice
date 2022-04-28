'use strict';

// micro-servicio de creación de thumbnail

const { Responder } = require('cote');

// almacén de datos del microservicio
const rates = {
  usd_eur: 0.89,
  eur_usd: 1.11
};

// lógica del microservicio

const responder = new Responder({ name: 'servicio de creacion de thumbnail'});

responder.on('crear-thumbnail', (req, done) => {
  const { cantidad, desde, hacia } = req;

  console.log(Date.now(), 'servicio:', cantidad, desde, hacia);

  const rate = rates[`${desde}_${hacia}`];

  const resultado = cantidad * rate;

  done(resultado);

});