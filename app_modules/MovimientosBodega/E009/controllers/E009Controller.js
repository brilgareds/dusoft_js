
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
 * +Descripcion trae registro de la bodega seleccionada
 * @fecha 2018-03-06
 */
E009Controller.prototype.listarBodegaId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var bodega_id = args.id;

    G.Q.nfcall(that.m_e009.listarBodegaId, bodega_id).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodega id ok!!!!', 200, {listarBodegas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar la bodega', 500, {listarBodegas: {}}));
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
    var bodega_doc_id = args.bodega_doc_id;
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
                    movimiento_temporal_id, usuarioId, bodega_doc_id, observacion, transaccion).then(function () {
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
        empresa_id: args.empresa_id,
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
    var msj;

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
        if (resultado.length > 0) {

            G.Q.nfcall(that.m_e009.consultarItem, parametros).then(function (result) {
                if (result.length > 0) {
                    msj = "El producto " + parametros.codigoProducto + " ya se encuentra registrado en el documento de devolucion.";
                } else {
                    msj = "producto agregado correctamente";
                    return G.Q.nfcall(that.m_e009.agregarItem, parametros);
                }
            }).then(function (resultado) {
                res.send(G.utils.r(req.url, msj, 200, {agregarItem: resultado}));
            }).fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al consultar el Producto', 500, {}));
            }).done();
        } else {
            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en bodegas_existencias.", status: 403};
        }
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
    var cabecera = [];
    var detalle = [];
    ;

    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

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
        return G.Q.ninvoke(that.m_movimientos_bodegas, "getDoc", parametros);

    }).then(function (resultado) {

        cabecera = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "consultar_detalle_documento_despacho", parametros.numeracionDocumento, parametros.prefijoDocumento, parametros.empresaId);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function (resultado) {
        detalle = resultado;
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detalle[0],
                impresion: impresion,
                archivoHtml: 'documentoE009.html',
                reporte: "documentoE009"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta eliminar_documento_temporal_d sin resultados';
        }

    }).catch(function (err) {
        console.log("execCrearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
    }).done();



};

// imprime el documento desde buscador de documentos
E009Controller.prototype.crearDocumentoImprimir = function (req, res) {
    var that = this;
    var args = req.body.data;
    var cabecera = [];


    if (args.empresaId === '' || args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'El empresa_id esta vacío', 404, {}));
        return;
    }
    if (args.prefijo === '' || args.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo esta vacío', 404, {}));
        return;
    }
    if (args.numeracion === '' || args.numeracion === undefined) {
        res.send(G.utils.r(req.url, 'El numeracion esta vacío', 404, {}));
        return;
    }

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        prefijoDocumento: args.prefijo,
        numeracionDocumento: args.numeracion
    };

    try {
        var nomb_pdf = "documentoE009" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
            return;
        }
    } catch (e) {
        console.log("NO EXISTE ARCHIVO  ");
    }

    G.Q.ninvoke(that.m_movimientos_bodegas, "getDoc", parametros).then(function (result) {
        cabecera = result;
        if (result.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "consultar_detalle_documento_despacho", parametros.numeracionDocumento, parametros.prefijoDocumento, parametros.empresaId);
        } else {
            throw 'Consulta sin resultados';
        }
    }).then(function (resultado) {
        detalle = resultado;
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detalle[0],
                impresion: impresion,
                archivoHtml: 'documentoE009.html',
                reporte: "documentoE009"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta eliminar_documento_temporal_d sin resultados';
        }

    }).catch(function (err) {
        console.log("crearHtmlDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el html del Documento', 500, {err: err}));
    }).done();
};

function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/E009/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();

            var nombreTmp = datos.reporte + datos.cabecerae.prefijo + datos.cabecerae.numero + ".html";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log("err [__generarPdf]: ", err);
                    callback(true, err);
                    return;
                } else {

                    callback(nombreTmp);
                    return;
                }
            });
        });
    });
}

E009Controller.$inject = ["m_movimientos_bodegas", "m_e009"];

module.exports = E009Controller;
