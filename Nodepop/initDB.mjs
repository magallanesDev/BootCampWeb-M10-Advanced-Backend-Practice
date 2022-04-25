'use strict';

import './loadEnv.mjs'

import fsPromise from 'fs/promises';
import readline from 'readline';

// conexión a la base de datos
import dbConnection from "./lib/connectMongoose.js";

// cargar modelos
import Anuncio from './models/Anuncio.js';
import Usuario from './models/Usuario.js';

dbConnection.once('open', () => {
  main().catch(err => console.log('Hubo un error', err));
})


async function main() {

  const borrar = await pregunta('Estas seguro de que quieres borrar la base de datos? (si/no)  ');
  if (!borrar) {
    process.exit(0);
  }

  // inicializar anuncios
  await initAnuncios();

  // inicializar usuarios
  await initUsuarios();

  // desconectar la base de datos
  dbConnection.close();
}

async function initUsuarios() {
  // borrar los usuarios existentes
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear usuarios
  const usuarios = await Usuario.insertMany([
    {
      email: 'admin@example.com',
      password: await Usuario.hashPassword('1234'),
      rol: 'admin'
    },
    {
      email: 'user@example.com',
      password: await Usuario.hashPassword('1234'),
      rol: 'user'
    }
  ]);
  console.log(`Creados ${usuarios.length} usuarios.`);
}


async function initAnuncios() {
  // borrar todos los documentos de anuncios que haya en la colección
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

  const data = await fsPromise.readFile('initDB.anuncios.json', 'utf-8');
  const anuncioData = JSON.parse(data);

  // crear anuncios iniciales
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