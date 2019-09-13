
/* global G */

var I008Controller = function (movimientos_bodegas, m_i008) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_i008 = m_i008;
};

/**
 * @author German Galvis
 * +Descripcion lista los documentos de traslado
 * @fecha 2019-01-12 YYYY/MM/DD
 */
I008Controller.prototype.listarTraslados = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresaId: args.empresaId,
        centroUtilidad: args.centroUtilidad,
        bodega: args.bodega
    };

    G.Q.nfcall(that.m_i008.listarTraslados, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar traslados ok!!!!', 200, {listarTraslados: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de traslados', 500, {listarTraslados: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion lista los productos a trasladar
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.listarProductosTraslados = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        numero: args.numero,
        prefijo: args.prefijo
    };

    G.Q.nfcall(that.m_i008.listarProductosTraslados, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos del traslado ok', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos del traslado', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.newDocTemporal = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var bodega_doc_id = args.bodega_doc_id;
    var observacion = args.observacion;
    var movimiento_temporal_id;
    var tabla;

    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function (doc_tmp_id) {
        movimiento_temporal_id = doc_tmp_id;

        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodega_doc_id, observacion, transaccion).then(function () {

                if (args.empresaId === '17') {
                    tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_cliente';
                } else {
                    tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_farmacia';
                }

                var parametros = {
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id,
                    empresa_id: args.empresaEnvia,
                    prefijo: args.prefijo_documento_seleccionado,
                    numero: args.numero_documento_seleccionado,
                    tabla: tabla
                };

                return G.Q.nfcall(that.m_i008.insertarIngresoDespachoTmp, parametros, transaccion);
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
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.eliminarGetDocTemporal = function (req, res) {
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

    var docTmpId = args.doc_tmp_id;
    var tabla;

    if (args.empresa_id === '17') {
        tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_cliente';
    } else {
        tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_farmacia';
    }

    var parametros = {docTmpId: docTmpId, usuarioId: usuarioId, tabla: tabla};


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_i008.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_i008.eliminarDocumentoIngresoDespachoTemporal, parametros, transaccion);

        }).then(function () {

            return G.Q.nfcall(that.m_i008.eliminarDocumentoTemporal, parametros, transaccion);
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.agregarItem = function (req, res) {

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
    if (args.total_costo === undefined || args.total_costo === 0) {
        res.send(G.utils.r(req.url, 'El costo total no esta definido', 404, {}));
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
        cantidad_enviada: args.cantidad_enviada,
        lote: args.lote,
        fechaVencimiento: args.fechaVencimiento,
        docTmpId: args.docTmpId,
        item_id: args.item_id,
        total_costo: args.total_costo,
        usuarioId: usuarioId
    };
    var msj;
    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
        if (resultado.length > 0) {
            G.knex.transaction(function (transaccion) {


                G.Q.nfcall(that.m_i008.consultarItem, parametros).then(function (result) {
                    if (result.length > 0) {
                        return G.Q.nfcall(that.m_i008.modificarAgregarItem, parametros, transaccion);
                    } else {
                        msj = "producto agregado correctamente";
                        return G.Q.nfcall(that.m_i008.agregarItem, parametros, transaccion);
                    }
                }).then(function (resultado) {

                    return G.Q.nfcall(that.m_i008.updateMovimientoD, parametros, transaccion);

                }).then(function () {
                    transaccion.commit();
                }).fail(function (err) {
                    transaccion.rollback(err);
                }).done();
            }).then(function (resultado) {
                res.send(G.utils.r(req.url, 'producto agregado correctamente', 200, {agregarItem: resultado}));
            }).catch(function (err) {
                console.log("EROR ", err);
                res.send(G.utils.r(req.url, 'Error al insertar producto al temporal', 500, {}));
            }).done();
        } else {
            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en existencias_bodegas.", status: 403};
        }
    }).fail(function (err) {
        res.send(G.utils.r(req.url, err.msj, err.status, {agregarItem: []}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos del documento temporal 
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.listarProductosValidados = function (req, res) {
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

    G.Q.nfcall(that.m_i008.consultarProductosValidados, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos a trasladar', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos validados', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */

I008Controller.prototype.eliminarItem = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }

    parametros = {item_id: args.item_id,
        item_id_compras: args.item_id_compras,
        cantidad: args.cantidad,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId};

    G.knex.transaction(function (transaccion) {


        G.Q.nfcall(that.m_i008.eliminarItem, parametros, transaccion).then(function (result) {

            return G.Q.nfcall(that.m_i008.restarCantidadMovimientoD, parametros, transaccion);

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
 * +Descripcion Lista el documento seleccionado
 * @fecha 2019-01-15 YYYY/MM/DD
 */

I008Controller.prototype.listarDocumentoId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var tabla;

    if (args.tmp_id === undefined || args.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos datos no estan definidos', 404, {}));
        return;
    }

    parametros = {
        tmp_id: args.tmp_id,
        empresa_id: args.empresa_id
    };

    if (args.empresa_id === '17') {
        tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_cliente';
    } else {
        tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_farmacia';
    }

    parametros.tabla = tabla;


    G.Q.nfcall(that.m_i008.listarDocumentoId, parametros).then(function (result) {
        res.send(G.utils.r(req.url, 'Listar documento id OK', 200, {listarDocumento: result}));
    }).fail(function (err) {
        console.log("listarDocumentoId  ", err);
        res.send(G.utils.r(req.url, 'Error al listar el documento', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo IPF
 * @fecha 2019-01-14 YYYY/MM/DD
 */
I008Controller.prototype.crearDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var parametros = {
        prefijo_despacho: args.prefijo_despacho,
        numero_despacho: args.numero_despacho,
        empresa_origen: args.empresa_origen,
        empresa_id: args.empresa_id,
        docTmpId: args.doc_tmp_id,
        sw_estado: args.sw_estado
    };

    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.usuario_id === '') {
        usuarioId = req.session.user.usuario_id;
    } else {
        usuarioId = args.usuario_id;
    }

    var docTmpId = args.doc_tmp_id;
    var tabla;
    var modificacion;
    var tabla_1;
    var tabla_2;
    var cabecera = [];
    var bodega_o;

    G.knex.transaction(function (transaccion) {
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

            parametros.empresaId = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;

            if (args.empresa_id === '17') {
                tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_cliente';
                tabla_1 = 'inv_bodegas_movimiento_ingresosdespachos_clientes';
                tabla_2 = 'inv_bodegas_movimiento_despachos_clientes';
                modificacion = 'factura_gener';
            } else {
                tabla = 'inv_bodegas_movimiento_tmp_ingresosdespachos_farmacia';
                tabla_1 = 'inv_bodegas_movimiento_ingresosdespachos_farmacias';
                tabla_2 = 'inv_bodegas_movimiento_despachos_farmacias';
                modificacion = 'sw_confirma';
            }

            parametros.tabla = tabla;
            parametros.tabla_1 = tabla_1;
            parametros.tabla_2 = tabla_2;
            parametros.modificacion = modificacion;

            return G.Q.nfcall(that.m_i008.consultarMovimientoIngresoDespachoFarmacia, parametros, transaccion);

        }).then(function (result) {

            if (result.length > 0) {
                throw 'EFC ya registrado';
            } else {
                return G.Q.nfcall(that.m_i008.agregarMovimientoIngresoDespachoFarmacia, parametros, transaccion);
            }
        }).then(function () {
//            return G.Q.nfcall(that.m_i008.updateEstadoMovimientoDespachoFarmacia, parametros, transaccion);
//        }).then(function () {
//            console.log("llego 3");
            return G.Q.nfcall(that.m_i008.eliminarDocumentoIngresoDespachoTemporal, parametros, transaccion);

        }).then(function (result) {

            if (result >= 1) {

                return G.Q.nfcall(that.m_i008.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {

                throw 'eliminarDocumentoIngresoDespachoTemporal Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {

                return G.Q.nfcall(that.m_i008.eliminarDocumentoTemporal, parametros, transaccion);
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

        return G.Q.nfcall(that.m_i008.consultarBodegaOrigen, parametros);

    }).then(function (resultado) {

        bodega_o = resultado[0];
        return G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros);

    }).then(function (resultado) {

        cabecera = resultado;
        if (resultado.length > 0) {

            return G.Q.nfcall(that.m_i008.consultar_detalle_documento, parametros);
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
            cabecera[0].bodega_origen = bodega_o.descripcion;
            cabecera[0].numeroEfc = parametros.prefijo_despacho + " - " + parametros.numero_despacho;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: resultado,
                impresion: impresion,
                archivoHtml: 'documentoI008.html',
                reporte: "documentoI008"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento '+ err, 500, {err: err}));
    }).done();
};

// imprime el documento desde buscador de documentos
I008Controller.prototype.crearHtmlDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var cabecera = [];
    var detallea = [];
    var efc;
    var tabla_1;

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
        var nomb_pdf = "documentoI008" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
            return;
        }
    } catch (e) {
        console.log("NO EXISTE ARCHIVO ");
    }

    G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros).then(function (result) {
        cabecera = result;
        if (result.length > 0) {
            return G.Q.nfcall(that.m_i008.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function (resultado) {

        detallea = resultado;

        if (parametros.empresa_id === '17') {
            tabla_1 = 'inv_bodegas_movimiento_ingresosdespachos_clientes';

        } else {
            tabla_1 = 'inv_bodegas_movimiento_ingresosdespachos_farmacias';
        }

        parametros.tabla_1 = tabla_1;

        return G.Q.nfcall(that.m_i008.consultarEfc, parametros);
    }).then(function (resultado) {

        efc = resultado[0];
        parametros.prefijo_despacho = efc.prefijo_despacho;
        parametros.numero_despacho = efc.numero_despacho;
        return G.Q.nfcall(that.m_i008.consultarBodegaOrigen, parametros);
    }).then(function (resultado) {

        var bodega_origen = resultado[0];
        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};

        if (detallea.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].bodega_origen = bodega_origen.descripcion;
            cabecera[0].pedido = bodega_origen.pedido;
            cabecera[0].numeroEfc = efc.prefijo_despacho + " - " + efc.numero_despacho;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                archivoHtml: 'documentoI008.html',
                reporte: "documentoI008"}, function (nombre_pdf) {
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
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I008/reports/javascripts/rotulos.js', 'utf8'),
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

function __updateMovimiento(that, listado, parametros, index, transaccion, callback) {

    var item = listado[index];
    if (!item) {
        callback(false, 0);
        return;
    }

    parametros.item_id_compras = item.itemIdCompra;
    parametros.cantidad = item.cantidad;

    G.Q.nfcall(that.m_i008.restarCantidadMovimientoD, parametros, transaccion).then(function (resultado) {
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

I008Controller.$inject = ["m_movimientos_bodegas", "m_i008"];
module.exports = I008Controller;
