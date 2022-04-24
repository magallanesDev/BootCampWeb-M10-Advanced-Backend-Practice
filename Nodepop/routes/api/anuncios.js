'use strict';

const express = require('express');
const createError = require('http-errors');
const Anuncio = require('../../models/Anuncio');

const router = express.Router();

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

// GET  /api/anuncios/:id
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
router.post('/', async (req, res, next) => {
  try {
    const anuncioData = req.body;

    // creo un objeto de anuncio EN MEMORIA
    const anuncio = new Anuncio(anuncioData);

    const anuncioGuardado = await anuncio.save();

    res.status(201).json({ result: anuncioGuardado });

  } catch (err) {
    next(err);
  }
})

// DELETE  /api/anuncios/:id
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

// PUT  /api/anuncios/:id
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