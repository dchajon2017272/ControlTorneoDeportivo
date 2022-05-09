const express = require('express');
const ligasControlador = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarLiga',md_autenticacion.Auth, ligasControlador.AgregarLiga);
api.get('/ligas', ligasControlador.ObtenerLigas);
api.get('/tabla/:idLiga', ligasControlador.tabla);

//api.post('/registrarAdministrador', usuarioControlador.RegistrarAdministrador);
//api.post('/login', ligasControlador.Login);
api.put('/editarLiga/:idLigas', md_autenticacion.Auth, ligasControlador.EditarLiga);
//api.put('/agregarProductoCarrito', md_autenticacion.Auth, usuarioControlador.agregarProductoCarrito);
//api.put('/carritoAfactura/:idProducto', md_autenticacion.Auth, usuarioControlador.carritoAfactura);
//api.put('/editarRolUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.editarRol);
api.delete('/eliminarLiga/:idLigas', md_autenticacion.Auth, ligasControlador.EliminarLiga);
///api.get('/facturasUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.ObtenerFacturasUsuario);
//api.get('/productosFactura/:idFactura',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.ObtenerProductosFacturas);


module.exports = api;