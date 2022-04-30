'use strict';

// micro-servicio de creación de thumbnail

const { Responder } = require('cote');
const jimp = require('jimp');

const responder = new Responder({ name: 'servicio de creacion de thumbnail' });

responder.on('crear-thumbnail', async (req, done) => {
  const { path } = req;

  try {
    // Leer la imagen
    const image = await jimp.read(path);

    // Redimensionar la imagen a 100*100 px
    await image.resize(100, 100);

    // Guardar el thumbnail añadiendo el sufijo _TN para conservar la imagen original
    await image.writeAsync(path + '_TN');

    done();
  } catch (err) {
    done({ message: err.message }, null);
  }
});
