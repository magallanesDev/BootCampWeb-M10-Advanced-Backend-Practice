## MICROSERVICIO de creación de thumbnails de tamaño 100\*100 px

El thumbnail se guarda en la misma carpeta que el upload de la imagen original de la aplicación Nodepop y añadiendo el sufijo _TN al nombre.

Para utilizar el microservicio, primero instalamos todas las dependencias:

```sh
npm install
```

Después, para ejecutar el microservicio en producción:

```sh
node thumbnailService.js
```

En desarrollo, mejor con nodemon para actualizar los cambios:

```sh
nodemon thumbnailService.js
```
