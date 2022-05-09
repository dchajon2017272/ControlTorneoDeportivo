// IMPORTACIONES
const Ligas = require('../models/ligas.models');
const Equipos = require('../models/equipo.models');
const PDF = require('pdfkit');
const fs = require('fs');   

const bcrypt = require('bcrypt-nodejs');

// AGREGAR PRODUCTOS
function AgregarLiga (req, res){
    // var { nombre, cantidad, precio } = req.body;
    var parametros = req.body;
    var ligasModelo = new Ligas();

    if( parametros.nombreLiga) {
        ligasModelo.nombreLiga = parametros.nombreLiga;
        ligasModelo.idUsuarios = req.user.sub;        

        ligasModelo.save((err, ligaGuardada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!ligaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ningun equipo"});

            return res.status(200).send({ liga: ligaGuardada });
        })
    }
}


// Obtener datos Productos de Mongo
function ObtenerLigas (req, res) {
    Ligas.find((err, ligasObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < ligasObtenidas.length; i++) {
            console.log(ligasObtenidas[i].nombreLiga)
        }

        return res.send({ equipos: ligasObtenidas })
        /* Esto retornara
            {
                productos: ["array con todos los productos"]
            }
        */ 
    })
}

// OBTENER PRODUCTO POR ID
function tabla(req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    Ligas.findOne(idLiga, (err, ligaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!ligaEncontrada) return res.status(404).send( { mensaje: 'Error al obtener los datos1' });

        Equipos.find(parametros.idLigas, (err, equiposEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!equiposEncontrados) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({liga: ligaEncontrada, equipos: equiposEncontrados})
        })
    })
}

/*function tablaPDF(req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    Ligas.findOne(idLiga, (err, ligaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!ligaEncontrada) return res.status(404).send( { mensaje: 'Error al obtener los datos1' });

        Equipos.find(parametros.idLigas, (err, equiposEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!equiposEncontrados) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

            const doc = new PDF();

            doc.pipe(fs.createWriteStream('salida.pdf'));

            doc.text(empleadosObtenidos);
            
            doc.end();

        return res.status(200).send({liga: ligaEncontrada, equipos: equiposEncontrados})
        })
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
/*function EditarLiga (req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    Ligas.findByIdAndUpdate(idLiga, parametros, { new: true } ,(err, ligaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!ligaActualizada) return res.status(404).send( { mensaje: 'Error al Editar la Liga'});

        return res.status(200).send({ equipo: ligaActualizada});
    });
}*/

function EditarLiga(req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Ligas.findOneAndUpdate({ _id: idLiga, idUsuarios: req.user.sub }, { nombreLiga: parametros.nombreLiga }, { new: true }, (err, ligaActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!ligaActualizada) return res.status(500).send({ mensaje: "Unicamente el Administrador puede editar ligas de todos los usuarios" })

            return res.status(200).send({ liga: ligaActualizada })
        })
    } else {
        Ligas.findByIdAndUpdate(idLiga, parametros, { new: true } ,(err, ligaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!ligaActualizada) return res.status(404).send( { mensaje: 'Error al Editar la Liga'});
    
            return res.status(200).send({ liga: ligaActualizada});
        });
    }
}

// ELIMINAR PRODUCTO
/*function EliminarLiga(req, res) {
    var idLiga = req.params.idLigas;

    Ligas.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!ligaEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la Liga'});

        return res.status(200).send({ equipo: ligaEliminada});
    })
}*/

function EliminarLiga(req, res) {
    var idLiga = req.params.idLigas;

    if (req.user.rol !== "Administrador") {
        Ligas.findOneAndDelete({ _id: idLiga, idUsuarios: req.user.sub }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!ligaEliminada) return res.status(500).send({ mensaje: "Unicamente el Administrador puede eliminar ligas de otro usuario" })

            return res.status(200).send({ liga: ligaEliminada })
        })
    } else {
        Ligas.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!ligaEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la Liga'});
    
            return res.status(200).send({ liga: ligaEliminada});
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
    ObtenerLigas,
    EjemploParametroRuta,
    EjemploParametroRutaOpcional,
    AgregarLiga,
    EditarLiga,
    EliminarLiga,
    tabla,
}