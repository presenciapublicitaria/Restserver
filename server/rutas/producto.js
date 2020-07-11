const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Producto = require('../modelos/producto');
const bodyParser = require('body-parser');


// ==========================================
// Obtener Productos
// ==========================================

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion disponible categoria usuario')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .sort('nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            })

        })


});

// ==========================================
// Obtener Productos por ID
// ==========================================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id, 'nombre precioUni descripcion disponible categoria usuario')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .sort('nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count(id, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            })

        })
});

// ==========================================
// Buscar Productos
// ==========================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    // Para buscar un texto exacto debe usarse 
    // nombre: termino

    // Escribir una expresion regular de busqueda
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });


});

// ==========================================
// Crear un nuevo producto
// ==========================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

});

// ==========================================
// Actualizar un producto
// ==========================================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre'], ['precioUni'], ['descripcion'], ['disponible']);
    // let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

        // En la línea inferior se muestra otra manera de realizar la actualización
        // Producto.findById
        // productoDB.nombre = body.nombre
        // productoDB.save

    });

});

// ==========================================
// Eliminar un producto
// ==========================================
app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };


    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true, useFindAndModify: false }, (err, ProductoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ProductoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: ProductoBorrado
        });
    });



});


module.exports = app;