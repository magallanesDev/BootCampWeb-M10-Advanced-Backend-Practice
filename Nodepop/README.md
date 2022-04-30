## Información de cómo arrancar un servidor de MongoDB

```sh
./bin/mongod --dbpath ./data/db
```

## Microservicio de creación de thumbnails de tamaño 100*100 px
Este microservicio sobreescribe la imagen original.
Ejecutar en la carpeta del microservicio:

```sh
node thumbnailService.js
```


# Nodepop

To start the application use:

```sh
npm install
```

In production:

Copy .env.example to .env and set config values

```sh
cp .env.example .env
```

```sh
npm start
```

In development:

```sh
npm run dev
```

## Inicializar la BD

Para inicializar la BD al estado inicial, se puede usar el comando:

```sh
npm run initdb
```

***ATENCIÓN*** - Esto borrará todos los datos de la BD y cargará el estado inicial, una muestra con 3 anuncios (Bicicleta, iPhone 3GS e iPad Pro) y 2 usuarios (user@example.com y admin@example.com).   

## Métodos del API

El API se accede en /api

Autenticación con JWT. Obtenemos un TOKEN con la siguiente petición POST al pasar un usuario válido en el body ( email y password):

POST  /api/authenticate


Después habría que pasar ese TOKEN en la petición (query string, headers o body)

Lista de anuncios:

- GET  /api/anuncios

FILTROS:
Por nombre podemos poner la/s primera/s letra/s.
Por tipo de anuncio, venta (venta=true) o búsqueda (venta=false).
Por precio.
Por tag
- /api/anuncios/?nombre=Bic&venta=true&precio=230.15&tag=motor

Paginación:
- /api/anuncios/?skip=1&limit=2

Eligiendo qué campos queremos:
- /api/anuncios/?select=nombre -_id precio

Ordenación:
- /api/anuncios/?sort=nombre precio


Buscar un anuncio por ID:

- GET  /api/anuncios/id

Crear un anuncio:

- POST  /api/anuncios
Para hacer el upload de la imagen, usar form-data para los datos del body. En el campo de la imagen elegir tipo file y seleccionar la imagen a subir.

Eliminar un anuncio por ID:

- DELETE  /api/anuncios/id

Modifica un anuncio por ID:

- PUT  /api/anuncios/id


## Página Web

Para entrar en la página web, mostrándonos la lista de anuncios (no hace falta autenticación):
- http://localhost:3000

FILTROS:
Por nombre podemos poner la/s primera/s letra/s.
Por tipo de anuncio, venta (venta=true) o búsqueda (venta=false).
Por precio.
Por tag.
- http://localhost:3000/?nombre=Bic&venta=true&precio=230.15&tag=motor

Paginación:
- http://localhost:3000/?skip=1&limit=2

Ordenación:
- http://localhost:3000/?sort=nombre precio



## Imágenes de los anuncios

Las imágenes de los anuncios están en la carpeta ./public/images/anuncios

Podemos ver cada imagen haciendo una petición en la url http://localhost:3000/images/anuncios/<imagen>