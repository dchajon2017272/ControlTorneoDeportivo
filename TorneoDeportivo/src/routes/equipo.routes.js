const express = require('express');
const equipoControlador = require('../controllers/equipo.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarEquipo',md_autenticacion.Auth, equipoControlador.AgregarEquipo);
api.get('/equipos', equipoControlador.ObtenerEquipos);

//api.post('/registrarAdministrador', usuarioControlador.RegistrarAdministrador);
//api.post('/login', usuarioControlador.Login);
api.put('/editarEquipo/:idEquipo', md_autenticacion.Auth, equipoControlador.EditarEquipo);
//api.put('/agregarProductoCarrito', md_autenticacion.Auth, usuarioControlador.agregarProductoCarrito);
//api.put('/carritoAfactura/:idProducto', md_autenticacion.Auth, usuarioControlador.carritoAfactura);
//api.put('/editarRolUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.editarRol);
api.delete('/eliminarEquipo/:idEquipo', md_autenticacion.Auth, equipoControlador.EliminarEquipo);
api.get('/verEquipoLiga/:idLigas',equipoControlador.verEquipoLiga);
//api.get('/productosFactura/:idFactura',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.ObtenerProductosFacturas);


module.exports = api;