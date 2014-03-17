
var Autenticacion = function(usuarios, emails) {

    console.log("Modulo Autenticacion Cargado ");

    this.m_usuarios = usuarios;
    this.emails = emails;
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



    G.auth.login(nombre_usuario, contrasenia, function(err, usuario) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Interno', 500, {}));
        else {
            if (usuario.length === 0) {
                res.send(G.utils.r(req.url, 'Usuario o Contraseña Invalidos', 404, {}));
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


Autenticacion.prototype.recuperarContrasenia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.login === undefined || args.login.usuario === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.login.usuario === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }

    var nombre_usuario = args.login.usuario;
    var constrasenia = G.random.randomKey(2, 8);
  

    var smtpTransport = this.emails.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "desarrollo1@duanaltda.com",
            pass: "S0p0rt3."
        }
    });


    this.m_usuarios.obtenerUsuarioPorLogin(nombre_usuario, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error Interno al Cambiar la Contraseña del Usuario.', 500, {}));
            return;
        }

        if (rows.length > 0) {

            var usuario = rows[0];

            if (usuario.email) {

                var configuracion_email = {};
                configuracion_email.from = G.settings.email_sender;
                configuracion_email.to = usuario.email;
                configuracion_email.subject = "Dusoft :: Nueva Contraseña Generada"
                configuracion_email.text = "La Aplicacion Dusoft Ha generado una nueva contraseña, por favor no olvide cambiarla cuando inicie sesion.";
                configuracion_email.html = "Su nueva contraseña es : <b>" + constrasenia + "</b>";

                smtpTransport.sendMail(configuracion_email, function(error, response) {
                    if (error) {
                        res.send(G.utils.r(req.url, 'No se ha podido Enviar el Correo', 500, {}));
                        return;
                    } else {
                        smtpTransport.close();

                        that.m_usuarios.cambiar_contrasenia(nombre_usuario, constrasenia, function(err, rows, result) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha Generado un Error Interno al Cambiar la Contraseña del Usuario', 500, {}));
                                return;
                            }
                            if (result.rowCount > 0) {
                                res.send(G.utils.r(req.url, 'Se ha enviado un correo electronico con la nueva contraseña, por favor revicelo e Ingrese Nuevamente!!!!', 200, {}));
                                return;
                            } else {
                                res.send(G.utils.r(req.url, 'El Usuario No se Encuentra Registrado en la Aplicacion', 404, {}));
                                return;
                            }
                        });
                    }
                });
            } else {
                var msj = 'El Usuario NO tiene configurado una cuenta de correo Electronico, por lo tanto no es Posible generar la Nueva Contraseña. Consulte con el Administrador del Sistema'
                res.send(G.utils.r(req.url, msj, 200, {}));
                return;
            }
        } else {
            res.send(G.utils.r(req.url, 'El Usuario No se Encuentra Registrado en la Aplicacion', 404, {}));
            return;
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

Autenticacion.$inject = ["m_usuarios", "emails"];

module.exports = Autenticacion;