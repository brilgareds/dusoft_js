
var E009Controller = function (movimientos_bodegas, m_e009) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_e009 = m_e009;
};

/**
 * @author German Galvis
 * +Descripcion lista las bodegas
 * @fecha 2018-02-12
 */
E009Controller.prototype.listarBodegas = function (req, res) {
    var that = this;
    G.Q.nfcall(that.m_e009.listarBodegas).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {listarBodegas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {listarBodegas: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2018-02-14
 */
E009Controller.prototype.newDocTemporal = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var bodega_seleccionada = args.bodega_seleccionada;
    var observacion = args.observacion;
    var movimiento_temporal_id;

    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }
    if (args.bodega_seleccionada === undefined || args.bodega_seleccionada === '') {
        res.send(G.utils.r(req.url, 'La bodega NO esta definida', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function (doc_tmp_id) {
        movimiento_temporal_id = doc_tmp_id;

        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodega_seleccionada, observacion, transaccion).then(function () {
                var parametros = {
                    abreviatura: "EDB",
                    doc_tmp_id: movimiento_temporal_id
                };
                return G.Q.nfcall(that.m_e009.insertarBodegasMovimientoDevolucionTmp, parametros, transaccion);

            }).then(function () {
                transaccion.commit(movimiento_temporal_id);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();

        }).then(function (movimiento_temporal_id) {
            res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {movimiento_temporal_id: movimiento_temporal_id}));
        }).catch(function (err) {
            console.log("EROR ", err);
            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
        }).done();

    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos buscados
 * @fecha 2018-02-12
 */
E009Controller.prototype.listarProductos = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresa_id: args.empresa_id, //Sesion.getUsuarioActual().getEmpresa().getCodigo()
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        descripcion: args.descripcion,
        tipoFiltro: args.tipoFiltro
    };

    G.Q.nfcall(that.m_e009.listarProductos, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos Para Asignar', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos Para Asignar', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento temporal
 * @fecha 2018-02-14
 */
E009Controller.prototype.eliminarGetDocTemporal = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;


    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }

    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }

    var docTmpId = args.doc_tmp_id;
    var parametros = {docTmpId: docTmpId, usuarioId: usuarioId};


    G.knex.transaction(function(transaccion) {
        
        G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal_d,parametros, transaccion).then(function () {

                return G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function() {

            transaccion.commit();

        }).fail(function(err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);

        }).done();

    }).then(function() {

        res.send(G.utils.r(req.url, 'SE HA BORRADO EL DOCUMENTO EXITOSAMENTE', 200, {eliminarGetDocTemporal: parametros}));

    }). catch (function(err) {

        console.log("eliminarGetDocTemporal>>>>", err);
        res.send(G.utils.r(req.url, 'ERROR AL BORRAR EL DOCUMENTO', 500, {err: err}));

    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
E009Controller.prototype.agregarItem = function(req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.empresaId === undefined || args.centroUtilidad === undefined || args.bodega === undefined) {
        res.send(G.utils.r(req.url, 'Algunos valores de la empresa no estan definidos', 404, {}));
        return;
    }
    if (args.codigoProducto === undefined) {
        res.send(G.utils.r(req.url, 'El codigo Producto no esta definida', 404, {}));
        return;
    }
    if (args.cantidad === undefined) {
        res.send(G.utils.r(req.url, 'La cantidad no esta definida', 404, {}));
        return;
    }
    if (args.lote === undefined) {
        res.send(G.utils.r(req.url, 'El lote no esta definida', 404, {}));
        return;
    }
    if (args.fechaVencimiento === undefined) {
        res.send(G.utils.r(req.url, 'La fecha vencimiento no esta definida', 404, {}));
        return;
    }
    if (args.docTmpId === undefined) {
        res.send(G.utils.r(req.url, 'El docTmpId no esta definida', 404, {}));
        return;
    }


    var parametros = {
        empresaId: args.empresaId,
        centroUtilidad: args.centroUtilidad,
        bodega: args.bodega,
        codigoProducto: args.codigoProducto,
        cantidad: args.cantidad,
        lote: args.lote,
        fechaVencimiento: args.fechaVencimiento,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId
    };

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function(resultado) {
        if (resultado.length > 0) {
            return G.Q.nfcall(that.m_e009.agregarItem, parametros);
        } else {
            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en bodegas_existencias.", status: 403};
        }
    }).then(function(resultado) {
        res.send(G.utils.r(req.url, 'producto agregado correctamente', 200, {agregarItem: resultado}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, err.msj, err.status, {agregarItem: []}));
    }).done();

};

E009Controller.$inject = ["m_movimientos_bodegas", "m_e009"];

module.exports = E009Controller;
