const express = require('express');
const Categoria = require('../modelos/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

// ===============================================
// Mostrar todas las categorias
// ===============================================

app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .populate('usuario', 'email nombre')
        .sort('nombre')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });



            })

        })

});

// ===============================================
// Mostrar una categoria por ID
// ===============================================

app.get('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    Categoria.findById(id, 'nombre idusuario estado')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });



            })

        });

});

// ===============================================
// Crear una nueva categoria
// ===============================================

app.post('/categoria', verificaToken, function(req, res) {

    // Obtengo la información de body
    let body = req.body;
    // Asigno los datos del body al Esquema
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });


    // Grabo los datos en la DB y lo muestro
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });



});

// ===============================================
// Actualizar categoria
// ===============================================

app.put('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ===============================================
// Eliminar categoria
// ===============================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    // Sólo por el ADMIN_ROLE

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, { useFindAndModify: false }, (err, CategoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!CategoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaBorrado
        });
    });



});



module.exports = app;