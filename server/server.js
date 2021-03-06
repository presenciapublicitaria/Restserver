require("./config/config");

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./rutas/index'));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public/')));

mongoose.connect(process.env.urlDB, {
        // mongoose.connect('mongodb: //localhost:27017/cafe', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err
        console.log('Base de datos Online');
    }
);

app.listen(process.env.PORT, () => {
    console.log('Escuchando Puerto ', process.env.PORT);
});