
var ActasTecnicas = function (actasTecnicas) {
    this.m_actasTecnicas = actasTecnicas;
};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que lista el item del pedido
 * @params termino: numero de orden,codigoProveedor: codigo del proveedor
 * @fecha 2018-02-20
 */
ActasTecnicas.prototype.listarOrdenesParaActas = function (req, res) {
    var that = this;
    var args = req.body.data;

    if (args.proveedores.terminoBusqueda === undefined && args.proveedores.codigoProveedor === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var parametros = {
        termino: args.proveedores.terminoBusqueda,
        codigoProveedor: args.proveedores.codigoProveedor
    };

    G.Q.ninvoke(that.m_actasTecnicas, 'listarOrdenesParaActas', parametros).then(function (data) {

        res.send(G.utils.r(req.url, 'Listado de Ordenes para Actas Tecnica!!!!', 200, {listarOrdenesParaActas: data}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error Listado de Ordenes para Actas Tecnica', 500, {listarOrdenesParaActas: err}));

    }).
            done();

};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que lista todos los productos de la orden
 * @params ordenPedido: numero de orden
 * @fecha 2018-02-20
 */
ActasTecnicas.prototype.listarProductosParaActas = function (req, res) {
    var that = this;
    var args = req.body.data;

    if (args.orden.ordenPedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var parametros = {
        ordenPedido: args.orden.ordenPedido
    };

    G.Q.ninvoke(that.m_actasTecnicas, 'listarProductosParaActas', parametros).then(function (data) {

        res.send(G.utils.r(req.url, 'Listado de Productos para Actas Tecnica!!!!', 200, {listarProductosParaActas: data}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error Listado de Productos para Actas Tecnica', 500, {listarProductosParaActas: err}));

    }).
            done();

};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que lista el detalle del producto de la orden
 * @params codigoProducto: codigo del producto, orden pedido: orden del pedido
 * @fecha 2018-02-20
 */
ActasTecnicas.prototype.listarProducto = function (req, res) {
    var that = this;
    var args = req.body.data;


    if (args.codigoProducto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var parametros = {
        codigoProducto: args.codigoProducto,
        ordenPedido: args.ordenPedido
    };

    G.Q.ninvoke(that.m_actasTecnicas, 'listarProducto', parametros).then(function (data) {

        res.send(G.utils.r(req.url, 'Lista de Producto para Actas Tecnica!!!!', 200, {listarProducto: data}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error Lista de Producto para Actas Tecnica', 500, {listarProducto: err}));

    }).
            done();

};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que almacena los datos del la orden tecnica
 * @params formulario de acta tecnica
 * @fecha 2018-02-20
 */
ActasTecnicas.prototype.guardarActa = function (req, res) {
    var that = this;
    var args = req.body.data;

    args.formulario.empresa = req.session.user.empresa;
    args.formulario.centro_utilidad = req.session.user.centro_utilidad;
    args.formulario.bodega = req.session.user.bodega;
    args.formulario.usuario_id = req.session.user.usuario_id;
    args.formulario.nombre_usuario = req.session.user.nombre_usuario;

    var parametros = {
        form: args.formulario
    };

    G.knex.transaction(function (transaccion) {

        parametros.transaccion = transaccion;

        G.Q.ninvoke(that.m_actasTecnicas, 'guardarActa', parametros).then(function (data) {

            parametros.form.acta_tecnica_id = data[0];
            return G.Q.nfcall(__insertarEvaluacionVisual, that, parametros, 0);

        }).then(function (err) {

            transaccion.commit();

        }).fail(function (err) {

            transaccion.rollback(err);

        }).done();

    }).then(function (result) {

        res.send(G.utils.r(req.url, 'Se Guardo el Acta Tecnica Correctamente !!!!', 200, {guardarActa: "ok"}));

    }).catch(function (err) {

        res.send(G.utils.r(req.url, 'Error al Guardar el Actas Tecnica', 500, {guardarActa: err}));

    }).done();

};

/**
 * @author Andres M Gonzalez
 * +Descripcion funcion recursiva para almacenar la evaluzacion visual
 * @params formulario de acta tecnica
 * @fecha 2018-02-20
 */
function __insertarEvaluacionVisual(that, parametros, index, callback) {

    var evaluacion = parametros.form.visual[index];

    if (!evaluacion) {
        callback(false);
        return;
    }

    evaluacion.acta_tecnica_id = parametros.form.acta_tecnica_id;
    evaluacion.transaccion = parametros.transaccion;
    evaluacion.observacionEvaluacion = "";

    if (evaluacion.sw_cumple === '0') {

        evaluacion.observacionEvaluacion = parametros.form.observacionEvaluacion;

    }

    G.Q.ninvoke(that.m_actasTecnicas, 'evalucacionVisual', evaluacion).then(function (data) {

        var time = setTimeout(function () {
            index++;
            __insertarEvaluacionVisual(that, parametros, index, callback);
            clearTimeout(time);
        }, 0);

    }).catch(function (err) {

        callback(err);

    }).done();

}


ActasTecnicas.$inject = [
    "m_actasTecnicas"
];

module.exports = ActasTecnicas;