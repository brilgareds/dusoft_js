
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
    var bodega_destino = args.bodega_destino;
    var abreviatura = args.abreviatura;
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
                    movimiento_temporal_id, usuarioId, bodega_destino, observacion, transaccion).then(function () {
                var parametros = {
                    abreviatura: abreviatura,
                    bodega_destino: bodega_seleccionada,
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
E009Controller.prototype.eliminarGetDocTemporal = function (req, res) {
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


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function () {

            transaccion.commit();

        }).fail(function (err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);

        }).done();

    }).then(function () {

        res.send(G.utils.r(req.url, 'SE HA BORRADO EL DOCUMENTO EXITOSAMENTE', 200, {eliminarGetDocTemporal: parametros}));

    }).catch(function (err) {

        console.log("eliminarGetDocTemporal>>>>", err);
        res.send(G.utils.r(req.url, 'ERROR AL BORRAR EL DOCUMENTO', 500, {err: err}));

    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
E009Controller.prototype.agregarItem = function (req, res) {

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

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
        if (resultado.length > 0) {
            return G.Q.nfcall(that.m_e009.agregarItem, parametros);
        } else {
            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en bodegas_existencias.", status: 403};
        }
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'producto agregado correctamente', 200, {agregarItem: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, err.msj, err.status, {agregarItem: []}));
    }).done();

};


/**
 * @author German Galvis
 * +Descripcion lista los productos del documento temporal
 * @fecha 2018-02-15
 */
E009Controller.prototype.consultarDetalleDevolucion = function (req, res) {
    var that = this;
    var usuarioId = req.session.user.usuario_id;
    var args = req.body.data;
    if (args.numero_doc === undefined || args.numero_doc === '00000') {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }

    var parametros = {
        numero_doc: args.numero_doc,
        usuario_id: usuarioId
    };

    that.m_e009.consultarDetalleDevolucion(parametros, function (err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'devolucion', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};


/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-02-15
 */
E009Controller.prototype.eliminarItem = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    console.log("eliminarItem  ", args);
    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }

    parametros = {item_id: args.item_id,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId};

    G.Q.nfcall(that.m_e009.eliminarItem, parametros).then(function (result) {
        res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminarItem: result}));
    }).fail(function (err) {
        console.log("eliminarItem  ", err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo EDB
 * @fecha 2018-02-15
 */
E009Controller.prototype.crearDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var parametros = {};

    if (args.docTmpId === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.usuario_id === '') {
        usuarioId = req.session.user.usuario_id;
    } else {
        usuarioId = args.usuario_id;
    }

    var docTmpId = args.docTmpId;

    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

console.log("lo q devuelve la consulta crear_documento ", result);
            parametros.empresaId = result.empresa_id;
            parametros.empresa_id = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.numero_doc = args.docTmpId;
            parametros.bodega_destino = args.bodega_seleccionada;
            parametros.docTmpId = args.docTmpId;
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;
            return G.Q.nfcall(that.m_e009.consultarDetalleDevolucion, parametros);

        }).then(function (result) {
            return G.Q.nfcall(that.m_e009.modificarDocumentoDevolucion, parametros, transaccion);


        }).then(function (result) {
            //if (result >= 1) 
            console.log("lo q devuelve la consulta eliminarDocumentoTemporal_d 1", result);
            return G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal_d, parametros, transaccion);


        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_e009.eliminarDocumentoTemporal, parametros, transaccion);
            } else {
                throw 'eliminar_documento_temporal_d Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                transaccion.commit();
                return false;
            } else {
                throw ' Fallo ';
            }

        }).fail(function (err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);

        }).done();

    }).then(function () {
        console.log("llego a getDoc ");
        return G.Q.ninvoke(that.m_movimientos_bodegas, "getDoc", parametros);

    }).then(function (resultado) {
console.log(" getDoc ",resultado);
        /*    var fecha = new Date();
         var formatoFecha = fecha.toFormat('DD-MM-YYYY');
         var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
         var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
         
         if (resultado.length > 0) {
         
         cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
         __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
         cabecerae: cabecera[0],
         detalle: detalle[0],
         orden: consulta[0],
         impresion: impresion,
         impuestos: resultado[0],
         archivoHtml: 'documentoI002.html',
         reporte: "documentoI002"}, function (nombre_pdf) {
         res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero, recepcion_parcial_id: resultadoProducto.recepcion_parcial_id}));
         });
         } else {
         throw 'Consulta listarParametrosRetencion sin resultados';
         }*/

        res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {agregarItem: resultado}));
    }).catch(function (err) {
        console.log("execCrearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
        //res.send(G.utils.r(req.url, err.msj, err.status, {agregarItem: []}));
    }).done();



};

E009Controller.$inject = ["m_movimientos_bodegas", "m_e009"];

module.exports = E009Controller;
