const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
//Obtener el esquema de BD Usuario
const Usuario = require('../modelos/usuario');
const Producto = require('../modelos/producto');
//Importar un File System para verificar la ruta
const fs = require('fs');
const path = require('path');


app.use(fileUpload({
    useTempFiles: true
}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "Archivos no Subidos"
                }
            });
    }

    // Validar Tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "Los tipos permitidos son " + tiposValidos.join(', '),
                    ntipo: tipo
                }
            });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extArchivo = nombreCortado[nombreCortado.length - 1];

    // console.log(extArchivo);
    // Extensiones Permitidas
    let extVal = ['jpg', 'png', 'gif', 'jpeg']

    if (extVal.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensiones permitidas son ' + extVal.join(', '),
                ext: extArchivo
            }
        });
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`;
    // archivo.name
    archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            ImagenUsuario(id, res, nombreArchivo);
        }

        if (tipo === 'productos') {
            ImagenProducto(id, res, nombreArchivo);
        }

    });

});

function ImagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            BorraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            BorraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        BorraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function ImagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            BorraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            BorraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        BorraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });

}



function BorraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


}

module.exports = app;