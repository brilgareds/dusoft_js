module.exports = function (app, di_container) {


    var c_mensajes = di_container.get("c_mensajes");

    app.post('/api/Mensajeria/listarMensajesTotal', function (req, res) {
        c_mensajes.listarMensajesTotal(req, res);
    });

    app.post('/api/Mensajeria/ConsultarLecturasMensajes', function (req, res) {
        c_mensajes.ConsultarLecturasMensajes(req, res);
    });

};