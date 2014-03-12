
var Autenticacion = function() {

    console.log("Modulo Autenticacion Cargado ");

};



Autenticacion.prototype.loginUsuario = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.login === undefined || args.login.usuario === undefined || args.login.contrasenia === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.login.usuario === "" || args.login.contrasenia === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }


    var nombre_usuario = args.login.usuario;
    var contrasenia = args.login.contrasenia;
    var socket = args.login.socket;

    /*console.log(nombre_usuario);
     console.log(contrasenia);
     console.log(socket);
     return;*/

    G.auth.login(nombre_usuario, contrasenia, function(err, usuario) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Interno', 500, {}));
        else {
            if (usuario.length === 0) {
                res.send(G.utils.r(req.url, 'Usuario no Válido', 404, {}));
            } else {

                usuario = usuario[0];
                usuario.socket = socket;

                G.auth.set(usuario, function(err, sesion_usuario) {
                    if (err) {
                        res.send(G.utils.r(req.url, 'No se ha podido Autenticar el Usuario', 500, {sesion: {}}));
                    } else {
                        res.send(G.utils.r(req.url, 'Usuario Autenticado Correctamente', 200, {sesion: sesion_usuario}));
                    }
                });
            }
        }
    });
};

Autenticacion.prototype.logoutUsuario = function(req, res) {

    G.auth.logout(req.session.user.usuario_id, req.session.user.auth_token, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Se ha Generado un Error Cerrando la Sesion del Usuario', 500, {sesion: {}}));
        else
            res.send(G.utils.r(req.url, 'Sesion Cerrada Correctamente', 200, {}));
    });
};

Autenticacion.$inject = [];

module.exports = Autenticacion;