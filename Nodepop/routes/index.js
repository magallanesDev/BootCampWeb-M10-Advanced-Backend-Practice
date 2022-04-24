'use strict';

var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');

/* GET home page. */

/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nodepop' });
});
*/


router.get('/', async (req, res, next) => {
  try {
    
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tag = req.query.tag;
    const skip = req.query.skip;
    const limit = req.query.limit;
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

    
    const anuncios = await Anuncio.lista(filtros, skip, limit, sort);

    res.render('index', { results: anuncios });

  } catch (err) {
    next(err);
  }
});

module.exports = router;