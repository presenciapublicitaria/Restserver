const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let CategoriaSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Categoria', CategoriaSchema);