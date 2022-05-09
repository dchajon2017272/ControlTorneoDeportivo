// IMPORTACIONES
const Equipo = require('../models/equipo.models');
const bcrypt = require('bcrypt-nodejs');
const { param } = require('express/lib/request');

// AGREGAR PRODUCTOS
function AgregarEquipo (req, res){
    // var { nombre, cantidad, precio } = req.body;
    var parametros = req.body;
    var equipoModelo = new Equipo();

    if( parametros.nombreEquipo) {
        equipoModelo.nombreEquipo = parametros.nombreEquipo;
        equipoModelo.puntos = 0;
        equipoModelo.golesFavor = 0;
        equipoModelo.golesContra = 0;
        equipoModelo.difenreciaGoles = 0;
        equipoModelo.partidosJugados = 0;
        equipoModelo.idUsuarios = req.user.sub;
        equipoModelo.idLigas = parametros.idLigas;
        
        Equipo.find((err, equiposObtenidos) => {
            if (err) return res.send({ mensaje: "Error: " + err })

        if(equiposObtenidos.length < 3){
        equipoModelo.save((err, equipoGuardado) => {
           
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!equipoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun equipo"});
        
        
            return res.status(200).send({ equipo: equipoGuardado });
       
        })
    }else{
        res.status(500).send( { mensaje: "Ya agrego más de 3 equipos"});
   }
})
    }

}


// Obtener datos Productos de Mongo
function ObtenerEquipos (req, res) {
    Equipo.find((err, equiposObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < equiposObtenidos.length; i++) {
            console.log(equiposObtenidos[i].nombreEquipo)
        }

        return res.send({ equipos: equiposObtenidos })
        /* Esto retornara
            {
                productos: ["array con todos los productos"]
            }
        */ 
    })
}

// OBTENER PRODUCTO POR ID
/*function ObtenerProductoId(req, res) {
    var idProd = req.params.idProductos;

    Productos.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ producto: productoEncontrado });
    })
}*/

// OBTENER PRODUCTO POR NOMBRE
/*function ObtenerProductoNombre(req, res) {
    var nomProd = req.params.nombreProducto;

    Productos.find( { nombre : { $regex: nomProd, $options: 'i' } }, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}*/


// EDITAR PRODUCTO
/*function EditarEquipo (req, res) {
    var idEqui = req.params.idEquipo;
    var parametros = req.body;

    Equipo.findByIdAndUpdate(idEqui, parametros, { new: true } ,(err, equipoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!equipoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Equipo'});

        return res.status(200).send({ equipo: equipoActualizado});
    });
}*/

function EditarEquipo(req, res) {
    var idEqui = req.params.idEquipo;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Equipo.findOneAndUpdate({ _id: idEqui, idUsuarios: req.user.sub }, 
        { nombreEquipo: parametros.nombreEquipo, puntos: parametros.puntos, 
        golesFavor: parametros.golesFavor,golesContra: parametros.golesContra,
        diferenciaGoles: parametros.diferenciaGoles,partidosJugados: parametros.partidosJugados,
        idUsuarios:parametros.idUsuarios,idLigas:parametros.idLigas }, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!equipoActualizado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede editar empleados de otra empresa" })

            return res.status(200).send({ equipo: equipoActualizado })
        })
    } else {
        Equipo.findByIdAndUpdate(idEqui, parametros, { new: true } ,(err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!equipoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Equipo'});
    
            return res.status(200).send({ equipo: equipoActualizado});
        });
    }
}

// ELIMINAR PRODUCTO
/*function EliminarEquipo(req, res) {
    var idEqui = req.params.idEquipo;

    Equipo.findByIdAndDelete(idEqui, (err, equipoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!equipoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el Equipo'});

        return res.status(200).send({ equipo: equipoEliminado});
    })
}*/

function EliminarEquipo(req, res) {
    var idEqui = req.params.idEquipo;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Equipo.findOneAndDelete({ _id: idEqui, idUsuarios: req.user.sub }, (err, equipoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!equipoEliminado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede eliminar equipos de otros usuarios" })

            return res.status(200).send({ equipo: equipoEliminado })
        })
    } else {
        Equipo.findByIdAndDelete(idEqui, (err, equipoEliminado) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!equipoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el Equipo'});
    
            return res.status(200).send({ equipo: equipoEliminado});
        })
    }
}

// INCREMENTAR/RESTAR LA CANTIDAD DEL PRODUCTO

/*function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findById(productoId, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
        if(!productoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener el Producto'});
        if (parametros.cantidad*-1 > productoEncontrado.cantidad) {
            return res.status(500).send({ mensaja: "Productos insuficientes en el stock para realizar esta compra."})
        } else {

    Productos.findOneAndUpdate(productoId, { $inc : { cantidad: parametros.cantidad } }, { new: true },
    (err, productoModificado) => {
       
            
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar la cantidad del Producto'});

            return res.status(200).send({ producto: productoModificado});
            
    })
}
})
    
}*/

// OBTENER PRODUCTO POR NOMBRE
function verEquipoLiga(req, res) {
    var idLiga = req.params.idLigas;

    Equipo.find( { liga : { $regex: idLiga, $options: 'i' } }, (err, equipoLigaEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!equipoLigaEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ equipos: equipoLigaEncontrado });
    })
}








// Parametro en ruta obligatorio
function EjemploParametroRuta (req, res) {
    var id = req.params.idKinal;

    res.send("Hola Mundo, el id obtenido es: " + id);
}

// Paramentro en ruta opcional
function EjemploParametroRutaOpcional (req, res) {
    var idOp = req.params.idOpcional;

    if(idOp) {
        res.send("Hola Mundo, el id Opcional obtenido es: " + idOp);
    } else {
        res.send("El correo del Usuario es: " + req.user.email)
    }    
}

/*function TokenProductos(req, res) {
    var parametros = req.body;
    Productos.findOne({ nombre : parametros.nombre }, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(productoEncontrado){
           
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwtProductos.crearToken(productoEncontrado) })
                        } else {
                            return  res.status(200)
                                .send({ usuario: productoEncontrado })
                        }

                  

        }else{
            return res.status(500)
                .send({ mensaje: 'Error, este producto no se encuentra registrado.'})
        }
    })
}*/

/*function ObtenerProductosAgotados (req, res) {
        
        Productos.find( { cantidad : 0}, (err, productoEncontrado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });
                
            return res.status(200).send({ productosAgotados: productoEncontrado });
        })
        
 
}*/

module.exports = {
    ObtenerEquipos,
    EjemploParametroRuta,
    EjemploParametroRutaOpcional,
    AgregarEquipo,
    EditarEquipo,
    EliminarEquipo,
    verEquipoLiga
}