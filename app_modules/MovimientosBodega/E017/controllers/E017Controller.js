
var E017Controller = function (movimientos_bodegas, m_e017) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_e017 = m_e017;
};

/**
 * @author German Galvis
 * +Descripcion lista las bodegas
 * @fecha 2018-05-03
 */
E017Controller.prototype.listarBodegas = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.nfcall(that.m_e017.listarBodegas, args).
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
 * @fecha 2018-05-03
 */
E017Controller.prototype.newDocTemporal = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var bodega_doc_id = args.bodega_doc_id;
    var bodega_seleccionada = args.bodega_seleccionada;
    var observacion = args.observacion;
    var movimiento_temporal_id;

    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }
    if (args.bodega_seleccionada === undefined || args.bodega_seleccionada === null) {
        res.send(G.utils.r(req.url, 'La bodega NO esta definida', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function (doc_tmp_id) {
        movimiento_temporal_id = doc_tmp_id;

        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodega_doc_id, observacion, transaccion).then(function () {

                var parametros = {
                    bodega_destino: bodega_seleccionada.bodega,
                    doc_tmp_id: movimiento_temporal_id
                };

                return G.Q.nfcall(that.m_e017.insertarBodegasMovimientoTmp, parametros, transaccion);

            }).then(function () {

                var parametros2 = {
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id,
                    farmacia_id: bodega_seleccionada.empresa_id,
                    centro_utilidad: bodega_seleccionada.centro_utilidad,
                    bodega: bodega_seleccionada.bodega
                };

                return G.Q.nfcall(that.m_e017.insertarTrasladoFarmaciaTmp, parametros2, transaccion);
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
 * +Descripcion elimina el documento temporal
 * @fecha 2018-05-03
 */
E017Controller.prototype.eliminarGetDocTemporal = function (req, res) {
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

        G.Q.nfcall(that.m_e017.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_e017.eliminarDocumentoTrasladoFarmaciaTemporal, parametros, transaccion);

        }).then(function () {

            return G.Q.nfcall(that.m_e017.eliminarDocumentoTemporal, parametros, transaccion);
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
 * +Descripcion lista los productos buscados
 * @fecha 2018-05-04
 */
E017Controller.prototype.listarProductos = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        descripcion: args.descripcion,
        tipoFiltro: args.tipoFiltro,
        paginaActual: args.paginaActual
    };

    G.Q.nfcall(that.m_e017.listarProductos, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos de la farmacia', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos de la farmacia', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
E017Controller.prototype.agregarItem = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.empresa_id === undefined || args.centro_utilidad === undefined || args.bodega === undefined) {
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
        empresaId: args.empresa_id,
        centroUtilidad: args.centro_utilidad,
        bodega: args.bodega,
        codigoProducto: args.codigoProducto,
        cantidad: args.cantidad,
        lote: args.lote,
        fechaVencimiento: args.fechaVencimiento,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId
    };
    var msj;

//    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
//        if (resultado.length > 0) {

    G.Q.nfcall(that.m_e017.consultarItem, parametros).then(function (result) {
        if (result.length > 0) {
            msj = "El producto " + parametros.codigoProducto + " ya se encuentra registrado en el documento de traslado.";
        } else {
            msj = "producto agregado correctamente";
            return G.Q.nfcall(that.m_e017.agregarItem, parametros);
        }
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, msj, 200, {agregarItem: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al consultar el Producto', 500, {}));
    }).done();
//        } else {
//            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en bodegas_existencias.", status: 403};
//        }
//    }).fail(function (err) {
//        res.send(G.utils.r(req.url, err.msj, err.status, {agregarItem: []}));
//    }).done();

};


/**
 * @author German Galvis
 * +Descripcion lista los productos del documento temporal 
 * @fecha 2018-05-05
 */
E017Controller.prototype.consultarProductosTraslados = function (req, res) {
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

    G.Q.nfcall(that.m_e017.consultarProductosTraslados, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos a trasladar', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos a trasladar', 500, {}));
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-05-05
 */

E017Controller.prototype.eliminarItem = function (req, res) {
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

    G.Q.nfcall(that.m_e017.eliminarItem, parametros).then(function (result) {
        res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminarItem: result}));
    }).fail(function (err) {
        console.log("eliminarItem  ", err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion Lista la bodega seleccionada
 * @fecha 2018-05-07
 */

E017Controller.prototype.listarBodegaId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.empresa_id === undefined || args.centro_utilidad === undefined || args.bodega === undefined) {
        res.send(G.utils.r(req.url, 'Algunos datos no estan definidos', 404, {}));
        return;
    }

    parametros = {empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega};

    G.Q.nfcall(that.m_e017.listarBodegaId, parametros).then(function (result) {
        res.send(G.utils.r(req.url, 'Listar bodega id OK', 200, {listarBodega: result}));
    }).fail(function (err) {
        console.log("listarBodegaId  ", err);
        res.send(G.utils.r(req.url, 'Error al listar la bodega', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo ETF
 * @fecha 2018-05-07
 */
E017Controller.prototype.crearDocumento = function (req, res) {
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

    G.knex.transaction(function (transaccion) {
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

            parametros.empresaId = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.docTmpId = args.docTmpId;
            parametros.empresa_envia = args.empresa_envia;
            parametros.bodega_destino = args.bodega_destino;
            parametros.sw_estado = '1';
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;

            return G.Q.nfcall(that.m_e017.agregarMovimientoTrasladoFarmacia, parametros, transaccion);

        }).then(function () {
            return G.Q.nfcall(that.m_e017.eliminarMovimientoTrasladoFarmacia, parametros, transaccion);

        }).then(function (result) {
            if (result >= 1) {
                return G.Q.nfcall(that.m_e017.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {
                throw 'eliminar_movimiento_traslado_farmacia_temporal_d Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_e017.eliminarDocumentoTemporal, parametros, transaccion);
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
            return G.Q.nfcall(that.m_e017.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function (resultado) {

        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].farmaciaD = parametros.bodega_destino.descripcion;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: resultado,
                impresion: impresion,
                archivoHtml: 'documentoE017.html',
                reporte: "documentoE017"}, function (nombre_pdf) {
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
E017Controller.prototype.crearHtmlDocumento = function (req, res) {
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
        numeracionDocumento: args.numeracion
    };

    try {
        var nomb_pdf = "documentoE017" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
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
            return G.Q.nfcall(that.m_e017.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function (resultado) {

        detallea = resultado;
        return G.Q.nfcall(that.m_e017.consultarFarmaciaDestino, parametros);
    }).then(function (resultado) {

        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        if (detallea.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].farmaciaD = resultado[0].descripcion;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                archivoHtml: 'documentoE017.html',
                reporte: "documentoE017"}, function (nombre_pdf) {
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

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/E017/reports/javascripts/rotulos.js', 'utf8'),
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

E017Controller.$inject = ["m_movimientos_bodegas", "m_e017"];
module.exports = E017Controller;
