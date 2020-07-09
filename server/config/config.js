// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del Token
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ======================
// SEED de Autenticacion
// ======================

process.env.FIRMA = process.env.FIRMA || 'este-es-seed';


// ======================
// Base de datos Local y Mongo
// ======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.urlDB = urlDB;

// ======================
// Google Client ID
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '707518802390-qcten3ck9ur8t39mou3ngor0fiscu2m4.apps.googleusercontent.com';