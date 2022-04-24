'use strict';

import fsPromise from 'fs/promises';
import readline from 'readline';

// conexión a la base de datos
import dbConnection from "./lib/connectMongoose.js";

// cargar modelo
import Anuncio from './models/Anuncio.js';

dbConnection.once('open', () => {
  main().catch(err => console.log('Hubo un error', err));
})


async function main() {

  const borrar = await pregunta('Estas seguro de que quieres borrar la base de datos? ');
  if (!borrar) {
    process.exit(0);
  }

  // inicializar agentes
  await initAnuncios();

  // desconectar la base de datos
  dbConnection.close();
}

async function initAnuncios() {
  // borrar todos los documentos de anuncios que haya en la colección
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

  const data = await fsPromise.readFile('initDB.anuncios.json', 'utf-8');
  const anuncioData = JSON.parse(data);

  // crear agentes iniciales
  const anuncios = await Anuncio.insertMany(anuncioData);
  console.log(`Creados ${anuncios.length} anuncios.`);
}

function pregunta(texto) {
  return new Promise((resolve, reject) => {
    // conectar readline a la consola
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // hacemos pregunta
    rl.question(texto, respuesta => {
      rl.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  });
}