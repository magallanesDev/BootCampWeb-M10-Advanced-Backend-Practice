'use strict';

// esta app necesita que otro servicio le cree los thumbnails

const { Requester } = require('cote');

const requester = new Requester({ name: 'app' });

const evento = {
  type: 'crear-thumbnail',

  //parámetros
  imagen: 100,
  desde: 'usd',
  hacia: 'eur',
};

setInterval(() => {

  console.log(Date.now(), 'pido la creación de un thumbnail');

  requester.send(evento, resultado => {
    console.log(Date.now(), 'app obtiene resultado:', resultado);
  });

}, 1000);