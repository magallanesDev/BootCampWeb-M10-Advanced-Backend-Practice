'use strict';

const express = require('express');
const multer = require('multer');
const createError = require('http-errors');
const Anuncio = require('../../models/Anuncio');
const router = express.Router();

// configuración multer
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/anuncios/')
  },
  filename: function (req, file, cb) {
    cb(null, hoy.toISOString() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })


// esta app necesita que otro servicio le cree los thumbnails
const { Requester } = require('cote');
const requester = new Requester({ name: 'app' });


// GET  /api/anuncios
// Devuelve lista de anuncios
router.get('/', async (req, res, next) => {
  try {
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tag = req.query.tag;
    const skip = req.query.skip;
    const limit = req.query.limit;
    const select = req.query.select; // seleccionamos los campos deseados
    const sort = req.query.sort;

    console.log('El usuario que ha hecho esta petición tiene el _id:', req.apiUserId);

    const filtros = {};

    if (nombre) {
      filtros.nombre = new RegExp('^' + req.query.nombre, "i");;
    }

    if (venta) {
      filtros.venta = venta;
    }

    if (precio) {
      filtros.precio = precio
    }

    if (tag) {
      filtros.tags = tag;
    }

    const anuncios = await Anuncio.lista(filtros, skip, limit, select, sort);

    res.json({ results: anuncios })

  } catch (err) {
    next(err);
  }
});

// GET  /api/anuncios/id
// Devuelve un anuncio
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const anuncio = await Anuncio.findOne({ _id: id });

    if (!anuncio) {
      next(createError(404));
      return;
    }

    res.json({ result: anuncio });
  } catch (err) {
    next(err);
  }
});

// POST  /api/anuncios
// Crea un nuevo anuncio
router.post('/', upload.single('foto'), async (req, res, next) => {
  try {
    const anuncioDataInicial = req.body;
    const fotoInicial = req.file.path;
    const foto = fotoInicial.slice(7);
    const anuncioData = {...anuncioDataInicial, foto};

    const evento = {
      type: 'crear-thumbnail',
      //parámetros
      path: (process.env.MICROSERVICE_PATH + req.file.path),
    };

    console.log(Date.now(), 'pido la creación de un thumbnail');

    requester.send(evento,  resultado => {
      resultado = console.log(Date.now(), 'app obtiene thumbnail 100*100px en la ruta ', fotoInicial+'_TN');
    });

    // creo un objeto de anuncio EN MEMORIA
    const anuncio = new Anuncio(anuncioData);
    const anuncioGuardado = await anuncio.save();
    res.status(201).json({ result: anuncioGuardado });

  } catch (err) {
    next(err);
  }
})

// DELETE  /api/anuncios/id
// Elimina un anuncio
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Anuncio.deleteOne({ _id: id });

    res.json();
  } catch (err) {
    next(err)
  }

})

// PUT  /api/anuncios/id
// Modifica un anuncio
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const anuncioData = req.body;

    let anuncioActualizado
    try {
      anuncioActualizado = await Anuncio.findByIdAndUpdate(id, anuncioData, {
        new: true // esta opción sirve para que nos devuelva el estado final del documento
      });
    } catch (err) {
      next(createError(422, 'invalid id'));
      return;
    }

    if (!anuncioActualizado) {
      next(createError(404));
      return;
    }

    res.json({ result: anuncioActualizado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;