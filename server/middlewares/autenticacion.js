const jwt = require('jsonwebtoken');

//==============================
// Verifica Token
//==============================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.FIRMA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

    // console.log(token);


    // res.json({
    //     token: token
    // });

};

//==============================
// Verifica ADMIN_ROLE
//==============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};



module.exports = {
    verificaToken,
    verificaAdmin_Role
}