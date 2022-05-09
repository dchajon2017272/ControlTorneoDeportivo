// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const EquipoRutas =require('./src/routes/equipo.routes');
const PartidosRutas =require('./src/routes/partidos.routes');
const JornadasRutas =require('./src/routes/jornadas.routes');
const LigasRutas =require('./src/routes/ligas.routes');


// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', EquipoRutas, UsuarioRutas,PartidosRutas,JornadasRutas,LigasRutas);


module.exports = app;