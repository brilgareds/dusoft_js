
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

Mensajeria.$inject = ["m_mensajes"];

module.exports = Mensajeria;