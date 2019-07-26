module.exports = function (app, di_container) {

    var c_mensajes = di_container.get("c_mensajes");
    var e_mensajes = di_container.get("e_mensajes");
    var io = di_container.get("socket");

    app.post('/api/Mensajeria/listarMensajesTotal', function (req, res) {
        c_mensajes.listarMensajesTotal(req, res);
    });

    app.post('/api/Mensajeria/consultarPerfiles', function (req, res) {
        c_mensajes.consultarPerfiles(req, res);
    });

    app.post('/api/Mensajeria/ConsultarLecturasMensajes', function (req, res) {
        c_mensajes.ConsultarLecturasMensajes(req, res);
    });

    app.post('/api/Mensajeria/ConsultarMensajesUsuario', function (req, res) {
        c_mensajes.ConsultarMensajesUsuario(req, res);
    });

    app.post('/api/Mensajeria/IngresarLectura', function (req, res) {
        c_mensajes.IngresarLectura(req, res);
    });

    app.post('/api/Mensajeria/IngresarMensaje', function (req, res) {
        c_mensajes.IngresarMensaje(req, res);
    });

    // Events 
    io.sockets.on('connection', function (socket) {

        e_mensajes.onConnected1(socket.id);

        socket.on('onConsultarMensaje', function (datos) {
            e_mensajes.ConsultarMensajes(datos);
        });

        socket.on('guardarTokenPush', function (datos) {
            e_mensajes.guardarTokenPush(datos);
        });


    });

};