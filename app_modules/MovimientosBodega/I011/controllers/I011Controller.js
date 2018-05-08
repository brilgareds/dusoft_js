
var I011Controller = function (movimientos_bodegas, m_i011) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_i011 = m_i011;

};
/**
 * @author German Galvis
 * +Descripcion lista las bodegas
 * @fecha 2018-02-17
 */
I011Controller.prototype.listarBodegas = function (req, res) {
    var that = this;
    var parametro = req.session.user;
    G.Q.nfcall(that.m_i011.listarBodegas, parametro).
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
I011Controller.prototype.listarBodegaId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var bodega_id = args.id;

    G.Q.nfcall(that.m_i011.listarBodegaId, bodega_id).
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
 * +Descripcion lista las novedades
 * @fecha 2018-02-17
 */
I011Controller.prototype.listarNovedades = function (req, res) {
    var that = this;
    var parametro = req.session.user;
    G.Q.nfcall(that.m_i011.listarNovedades).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {listarNovedades: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {listarNovedades: {}}));
            }).
            done();
};
/**
 * @author German Galvis
 * +Descripcion lista las novedades
 * @fecha 2018-04-20
 */
I011Controller.prototype.listarTorres = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        prefijo: args.prefijo,
        numero: args.numero
    };
    G.Q.nfcall(that.m_i011.listarTorres, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar torres ok!!!!', 200, {listarTorres: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de torres', 500, {listarTorres: {}}));
            }).
            done();
};
/**
 * @author German Galvis
 * +Descripcion lista las devoluciones que pertenecen a la bodega seleccionada
 * @fecha 2018-02-19
 */
I011Controller.prototype.listarDevoluciones = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametro = args.bodega;
    G.Q.nfcall(that.m_i011.listarDevoluciones, parametro).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {listarDevoluciones: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {listarDevoluciones: {}}));
            }).
            done();
};
/**
 * @author German Galvis
 * +Descripcion lista los productos del documento de devolución
 * @fecha 2018-02-19
 */
I011Controller.prototype.consultarDetalleDevolucion = function (req, res) {
    var that = this;
    var usuarioId = req.session.user.usuario_id;
    var args = req.body.data;
    if (args.numero_doc === undefined || args.numero_doc === '00000') {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }
    if (args.prefijo === undefined || args.prefijo === '00000') {
        res.send(G.utils.r(req.url, 'prefijo no esta definido', 404, {}));
        return;
    }

    var parametros = {
        numero_doc: args.numero_doc,
        prefijo: args.prefijo,
        usuario_id: usuarioId
    };
    that.m_i011.consultarDetalleDevolucion(parametros, function (err, lista_productos) {

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
 * +Descripcion lista los productos del documento de devolución
 * @fecha 2018-02-19
 */
I011Controller.prototype.consultarProductosValidados = function (req, res) {
    var that = this;
    var usuarioId = req.session.user.usuario_id;
    var args = req.body.data;
    if (args.numero_doc === undefined || args.numero_doc === '00000') {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }

    var parametro = {
        numero_doc: args.numero_doc,
        usuario_id: usuarioId
    };
    G.Q.nfcall(that.m_i011.consultarProductosValidados, parametro).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {lista_productos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {lista_productos: {}}));
            }).
            done();
};
/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2018-02-19
 */
I011Controller.prototype.newDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var empresaId = args.empresaId;
    var centroUtilidad = args.centroUtilidad;
    var bodega = args.bodega;
    var prefijo = 'EDB';
    var bodega_doc_id = args.bodega_doc_id;
    var empresa_envia = args.empresa_envia;
    var numero = args.numero_doc;
    var abreviatura = args.abreviatura;
    var observacion = args.observacion;
    var movimiento_temporal_id;
    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function (doc_tmp_id) {
        movimiento_temporal_id = doc_tmp_id;
        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodega_doc_id, observacion, transaccion).then(function () {
                var parametros = {
                    abreviatura: abreviatura,
                    doc_tmp_id: movimiento_temporal_id
                };
                return G.Q.nfcall(that.m_i011.modificarIngresoDevolucionTmp, parametros, transaccion);
            }).then(function () {
                var parametros2 = {
                    prefijo: prefijo,
                    numeracionDocumento: numero,
                    empresa_envia: empresa_envia,
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id
                };
                return G.Q.nfcall(that.m_i011.generarMovimientoDevolucionFarmaciaTmp, parametros2, transaccion);
            }).then(function () {
                var parametros = {
                    prefijo: prefijo,
                    numero: numero,
                    empresa_envia: empresa_envia,
                    empresaId: empresaId,
                    centroUtilidad: centroUtilidad,
                    bodega: bodega,
                    usuarioId: usuarioId,
                    doc_tmp_id: movimiento_temporal_id
                };
                return G.Q.nfcall(that.m_i011.agregarDocumentoVerificacionTmp, parametros, transaccion);
            }).then(function () {
                transaccion.commit(movimiento_temporal_id);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (movimiento_temporal_id) {
            res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {movimiento_temporal_id: movimiento_temporal_id}));
        }).catch(function (err) {
            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
        }).done();
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal y tablas tmp
 * @fecha 2018-02-15
 */
I011Controller.prototype.agregarItem = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    var parametros = {
        empresaId: args.empresaId,
        centroUtilidad: args.centroUtilidad,
        bodega: args.bodega,
        codigoProducto: args.codigoProducto,
        cantidad: args.cantidad,
        lote: args.lote,
        fechaVencimiento: args.fechaVencimiento,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId,
        empresa_envia: args.empresa_envia,
        prefijo: 'EDB',
        numero: args.numero_doc,
        movimiento_id: args.item_id,
        novedad_id: args.novedadId,
        novedad_anexa: args.novedadAnexa
    };

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
        if (resultado.length > 0) {

            G.knex.transaction(function (transaccion) {

                G.Q.nfcall(that.m_i011.agregarItem, parametros, transaccion).then(function (resul) {
                    parametros.item_id = resul[0];

                    return G.Q.nfcall(that.m_i011.agregarMovimientoDevolucionFarmaciaTmpD, parametros, transaccion);

                }).then(function () {

                    return G.Q.nfcall(that.m_i011.agregarDocumentoVerificacionTmpD, parametros, transaccion);

                }).then(function () {

                    return G.Q.nfcall(that.m_i011.updateMovimientoD, parametros, transaccion);

                }).then(function () {
                    transaccion.commit();
                }).fail(function (err) {
                    transaccion.rollback(err);
                }).done();
            }).then(function (resultado) {
                res.send(G.utils.r(req.url, 'producto agregado correctamente', 200, {agregarItem: resultado}));
            }).catch(function (err) {
                console.log("EROR ", err);
                res.send(G.utils.r(req.url, 'Error al insertar el cuerpo del temporal', 500, {}));
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
 * +Descripcion modifica la cantida enviada del registro
 * @fecha 2018-02-26
 */
I011Controller.prototype.modificarCantidad = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        cantidad: args.cantidad,
        movimiento_id: args.item_id
    };
    G.Q.nfcall(that.m_i011.updateMovimientoD, parametros, false).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'producto modificado correctamente!!!!', 200, {modificarCantidad: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al modificar el producto', 500, {modificarCantidad: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-02-15
 */
I011Controller.prototype.eliminarItem = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }

    var parametros = {
        item_id: args.item_id,
        docTmpId: args.docTmpId,
        lote: args.lote,
        cantidad: args.cantidad,
        movimiento_id: args.movimiento_id,
        usuarioId: usuarioId
    };

    G.knex.transaction(function (transaccion) {


        G.Q.nfcall(that.m_i011.eliminarItem, parametros, transaccion).then(function (result) {
            return G.Q.nfcall(that.m_i011.eliminarItemMovimientoDevolucionFarmacia, parametros, transaccion);
        }).then(function () {

            return G.Q.nfcall(that.m_i011.restarCantidadMovimientoD, parametros, transaccion);

        }).then(function () {
            transaccion.commit();
        }).fail(function (err) {
            transaccion.rollback(err);
        }).done();
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminarItem: resultado}));
    }).catch(function (err) {
        console.log("eliminarItem  ", err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento temporal
 * @fecha 2018-02-14
 */
I011Controller.prototype.eliminarGetDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var listado = args.listado;
    var usuarioId = req.session.user.usuario_id;


    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }

    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    var parametros = {
        docTmpId: args.doc_tmp_id,
        numero: args.numero,
        prefijo: args.prefijo,
        cantidad: 0,
        usuarioId: usuarioId
    };


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_i011.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_i011.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function () {
            return G.Q.nfcall(that.m_i011.eliminarMovimientoDevolucionFarmacia, parametros, transaccion);

        }).then(function () {

            return G.Q.nfcall(__updateMovimiento, that, listado, parametros, 0, transaccion);

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
 * +Descripcion genera el documento definitivo EDB
 * @fecha 2018-02-15
 */
I011Controller.prototype.crearDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var datoSeleccion = args.datoSeleccion;
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
    var detallea = [];

    G.knex.transaction(function (transaccion) {
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

            parametros.empresaId = result.empresa_id; //getDoc
            parametros.empresa_id = result.empresa_id; //creacion_documento
            parametros.prefijoDocumento = result.prefijo_documento; //creacion_documento
            parametros.numeracionDocumento = result.numeracion_documento; //creacion_documento
            parametros.numero_doc = args.numero_doc; //creacion_documento
            parametros.prefijo_doc = args.prefijo_doc; //creacion_documento
            parametros.empresa_envia = args.empresa_envia; //creacion_documento
            parametros.docTmpId = args.docTmpId; // eliminarDocumentoTemporal 
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId; // eliminarDocumentoTemporal

            return G.Q.nfcall(that.m_i011.agregarMovimientoFarmacia, parametros, transaccion);

        }).then(function () {
            if (datoSeleccion === 0) {
                return G.Q.nfcall(that.m_i011.creacion_documento, parametros, transaccion);
            } else {
                return 0;
            }

        }).then(function (result) {
            return G.Q.nfcall(that.m_i011.eliminarMovimientoDevolucionFarmacia, parametros, transaccion);

        }).then(function (result) {
            if (result >= 1) {
                return G.Q.nfcall(that.m_i011.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {
                throw 'eliminar_movimiento_devolucion_farmacia_temporal_d Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_i011.eliminarDocumentoTemporal, parametros, transaccion);
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
        return G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros);

    }).then(function (resultado) {
        cabecera = resultado;
        if (resultado.length > 0) {
            return G.Q.nfcall(that.m_i011.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function (resultado) {
        detallea = resultado;
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        for (var i = 0; i < detallea.length; i++) {
            detallea[i].index = i + 1;
        }
        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].edb_id = parametros.prefijo_doc + " " + parametros.numero_doc;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                archivoHtml: 'documentoI011.html',
                reporte: "documentoI011"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
    }).done();



};

// imprime el documento desde buscador de documentos
I011Controller.prototype.crearHtmlDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var cabecera = [];
    var detallea = [];


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
        prefijo_doc: args.prefijoFactura,
        numero_doc: args.numeroFactura,
        numeracionDocumento: args.numeracion
    };

    try {
        var nomb_pdf = "documentoI011" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
            return;
        }
    } catch (e) {
        console.log("NO EXISTE ARCHIVO  ");
    }

    G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros).then(function (result) {
        cabecera = result;

        if (result.length > 0) {
            return G.Q.nfcall(that.m_i011.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function (resultado) {
        detallea = resultado;
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};


        for (var i = 0; i < detallea.length; i++) {
            detallea[i].index = i + 1;
        }

        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].edb_id = parametros.prefijo_doc + " " + parametros.numero_doc;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                archivoHtml: 'documentoI011.html',
                reporte: "documentoI011"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearHtmlDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el html del Documento', 500, {err: err}));
    }).done();
};

// imprime el documento para la torre seleccionada desde buscador de documentos
I011Controller.prototype.crearTorreDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var cabecera = [];
    var detallea = [];
    var torre = args.torre;


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
        numeracionDocumento: args.numeracion,
        prefijo_doc: args.prefijoFactura,
        numero_doc: args.numeroFactura,
        torre: torre
    };

    try {
        var nomb_pdf = "documentoI011" + parametros.prefijoDocumento + parametros.numeracionDocumento + torre + ".html";
        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
            return;
        }
    } catch (e) {
        console.log("NO EXISTE ARCHIVO  ");
    }

    G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros).then(function (result) {
        cabecera = result;

        if (result.length > 0) {
            return G.Q.nfcall(that.m_i011.consultar_torre_documento, parametros);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function (resultado) {
        detallea = resultado;
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};


        for (var i = 0; i < detallea.length; i++) {
            detallea[i].index = i + 1;
        }

        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].edb_id = parametros.prefijo_doc + " " + parametros.numero_doc;
            __generarPdfTorre({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                archivoHtml: 'documentoI011.html',
                torre: torre,
                reporte: "documentoI011"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearHtmlDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el html del Documento', 500, {err: err}));
    }).done();
};
/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I011/reports/javascripts/rotulos.js', 'utf8'),
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
function __generarPdfTorre(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I011/reports/javascripts/rotulos.js', 'utf8'),
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

            var nombreTmp = datos.reporte + datos.cabecerae.prefijo + datos.cabecerae.numero + datos.torre + ".html";

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


function __updateMovimiento(that, listado, parametros, index, transaccion, callback) {

    var item = listado[index];
    if (!item) {
        callback(false, 0);
        return;
    }

    parametros.movimiento_id = item.movimiento;

    G.Q.nfcall(that.m_i011.updateAllMovimientoD, parametros, transaccion).then(function (resultado) {
        var timer = setTimeout(function () {
            clearTimeout(timer);
            index++;
            __updateMovimiento(that, listado, parametros, index, transaccion, callback);
        }, 0);

    }).fail(function (err) {
        console.log("error", err);
        callback(err);

    }).done();

}
;



I011Controller.$inject = ["m_movimientos_bodegas", "m_i011"];
module.exports = I011Controller;
