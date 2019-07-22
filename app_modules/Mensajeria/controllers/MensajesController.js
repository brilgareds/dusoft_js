
/* global G */

var Mensajeria = function (m_mensajes) {

    this.m_mensajes = m_mensajes;
};

/**
 * @author German Galvis
 * +Descripcion lista los mensajes del usuario en sesion
 * @fecha 2019-06-29
 */
Mensajeria.prototype.listarMensajesTotal = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        termino_busqueda: args.termino_busqueda,
        filtro: args.filtro,
        pagina_actual: args.paginaActual
    };
    
    G.Q.ninvoke(that.m_mensajes, 'listarMensajesTotal', parametros).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Consultar listar mensajes total ok!!!!', 200, {mensajes: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar listado de mensajes', 500, {mensajes: {}}));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion lista los lectores del mensaje
 * @fecha 2019-07-02
 */
Mensajeria.prototype.ConsultarLecturasMensajes = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        id: args.id
    };
    G.Q.ninvoke(that.m_mensajes, 'ConsultarLecturasMensajes', parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Consultar lectura de mensajes ok!!!!', 200, {lectores: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar lectura de mensajes', 500, {lectores: {}}));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion lista los lectores del mensaje
 * @fecha 2019-07-02
 */
Mensajeria.prototype.ConsultarRolesMensajes = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        id: args.id
    };

    G.Q.ninvoke(that.m_mensajes, 'ConsultarRolesMensajes', parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Consultar roles del mensaje ok!!!!', 200, {roles: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar los roles del mensaje', 500, {roles: {}}));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion lista los mensajes dirigidos al usuario en sesion
 * @fecha 2019-07-17
 */
Mensajeria.prototype.ConsultarMensajesUsuario = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        usuario_id: args.mensaje.usuario_id
    };

    G.Q.ninvoke(that.m_mensajes, 'ConsultarMensajesUsuario', parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Consultar mensajes del usuario ok!!!!', 200, {mensajes: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar los mensajes del usuario', 500, {mensajes: {}}));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion registra la lectura de un mensaje
 * @fecha 2019-07-19
 */
Mensajeria.prototype.IngresarLectura = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        usuario_id: args.mensaje.usuario_id,
        mensaje_id: args.mensaje.mensaje_id
    };

    G.Q.ninvoke(that.m_mensajes, 'IngresarLectura', parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'registro lectura ok!!!!', 200, {mensajes: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al registrar la lectura del mensaje', 500, {mensajes: {}}));
    }).done();

};

Mensajeria.$inject = ["m_mensajes"];

module.exports = Mensajeria;