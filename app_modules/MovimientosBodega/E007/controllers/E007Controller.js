
var E007Controller = function (movimientos_bodegas, m_e007) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_e007 = m_e007;

};

/**
 * @author German Galvis
 * +Descripcion lista los tipos de egreso
 * @fecha 2018-05-17
 */
E007Controller.prototype.listarEgresos = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.nfcall(that.m_e007.listarEgresos).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar egresos ok!!!!', 200, {listarEgresos: resultado}));
            }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar tipos de egresos', 500, {listarEgresos: {}}));
    }).done();
};

/*
 * @author German Galvis
 * @fecha 2018-05-18
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
E007Controller.prototype.listarTiposTerceros = function (req, res) {

    var that = this;
    G.Q.nfcall(that.m_e007.listarTiposTerceros).
            then(function (resultado) {

                if (resultado.length > 0) {
                    res.send(G.utils.r(req.url, 'Consulta lista tipos terceros', 200, {listar_tipo_terceros: resultado}));
                } else {
                    throw 'Consulta sin resultados';
                }

            }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar lista tipos terceros', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los clientes que concuerden con la busqueda
 * @fecha 2018-05-18
 */
E007Controller.prototype.listarClientes = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        filtro: args.filtro,
        terminoBusqueda: args.terminoBusqueda,
        empresaId: args.empresaId,
        paginaActual: args.paginaActual
    };
    G.Q.nfcall(that.m_e007.listarClientes, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar clientes ok!!!!', 200, {listarClientes: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de clientes', 500, {listarClientes: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion trae registro del cliente seleccionado
 * @fecha 2018-05-24
 */
E007Controller.prototype.listarClienteId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        id: args.id,
        tipoId: args.tipoId
    };


    G.Q.nfcall(that.m_e007.listarClienteId, parametros)
            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar cliente id ok!!!!', 200, {listarCliente: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar el cliente', 500, {listarCliente: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion trae registro del egreso seleccionado
 * @fecha 2018-05-24
 */
E007Controller.prototype.listarEgresoId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        egreso_id: args.egreso_id
    };


    G.Q.nfcall(that.m_e007.listarEgresoId, parametros)
            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar egreso id ok!!!!', 200, {listarEgreso: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar el egreso', 500, {listarEgreso: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2018-05-21
 */
E007Controller.prototype.newDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var empresaId = args.empresaId;
    var bodega_doc_id = args.bodega_doc_id;
    var tipo_id_tercero = args.tipo_id_tercero;
    var tercero_id = args.tercero_id;
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
                    doc_tmp_id: movimiento_temporal_id,
                    sw_costo_manual: '0',
                    concepto_egreso_id: args.concepto_egreso_id,
                    empresa_id: empresaId,
                    tipo_id_tercero: tipo_id_tercero,
                    tercero_id: tercero_id,
                    usuario_id: usuarioId
                };
                return G.Q.nfcall(that.m_e007.generarMovimientoConceptoEgresoTmp, parametros, transaccion);
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
 * +Descripcion elimina el documento temporal
 * @fecha 2018-05-21
 */
E007Controller.prototype.eliminarGetDocTemporal = function (req, res) {
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

    var parametros = {
        docTmpId: args.doc_tmp_id,
        usuarioId: usuarioId
    };


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_e007.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_e007.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function () {

            return G.Q.nfcall(that.m_e007.eliminarConceptoEgresoTemporal, parametros, transaccion);

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
 * @fecha 2018-05-21
 */
E007Controller.prototype.listarProductos = function (req, res) {
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

    G.Q.nfcall(that.m_e007.listarProductos, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos a trasladar', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos a trasladar', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los lotes del producto seleccionado
 * @fecha 2018-05-26
 */
E007Controller.prototype.consultarLotesProducto = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        codigo_producto: args.codigo_producto
    };
    G.Q.nfcall(that.m_e007.consultarLotesProducto, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar lotes ok!!!!', 200, {lotesProducto: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar lotes del producto', 500, {lotesProducto: {}}));
            }).
            done();
};


/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal y tablas tmp
 * @fecha 2018-03-27
 */
E007Controller.prototype.agregarItem = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    var parametros = {
        usuarioId: usuarioId,
        cantidad: args.cantidad,
        codigoProducto: args.codigoProducto,
        bodega: args.bodega,
        centro: args.centro_utilidad,
        lote: args.lote,
        fechaVencimiento: args.fechaVencimiento,
        disponible: args.disponible,
        empresa: args.empresa_id,
        docTmpId: args.docTmpId

    };

    G.Q.nfcall(that.m_e007.agregarItem, parametros)

            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'producto agregado correctamente', 200, {agregarItem: resultado}));
            }).fail(function (err) {
        console.log("EROR ", err);
        res.send(G.utils.r(req.url, 'Error al insertar el cuerpo del temporal', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos del documento tmp
 * @fecha 2018-05-24
 */
E007Controller.prototype.consultarProductosTraslado = function (req, res) {
    var that = this;
    var usuarioId = req.session.user.usuario_id;
    var args = req.body.data;
    if (args.docTmpId === undefined || args.docTmpId === '00000') {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }

    var parametro = {
        docTmpId: args.docTmpId,
        usuario_id: usuarioId
    };
    G.Q.nfcall(that.m_e007.consultarProductosTraslado, parametro).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar productos a trasladar ok!!!!', 200, {lista_productos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos a trasladar', 500, {lista_productos: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-05-24
 */
E007Controller.prototype.eliminarItem = function (req, res) {
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
        usuarioId: usuarioId
    };


    G.Q.nfcall(that.m_e007.eliminarItem, parametros)

            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminarItem: resultado}));
            }).fail(function (err) {
        console.log("eliminarItem  ", err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo ETB
 * @fecha 2018-05-24
 */
E007Controller.prototype.crearDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var nombreTercero = args.nombreTercero;
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
        G.Q.nfcall(that.m_e007.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

            parametros.empresaId = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.tipo_id_tercero = args.tipo_id_tercero;
            parametros.sw_costo_manual = '0';
            parametros.tercero_id = args.tercero_id;
            parametros.concepto_egreso_id = args.concepto_egreso_id;
            parametros.docTmpId = args.docTmpId;
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;

            return G.Q.nfcall(that.m_e007.agregarMovimientoConceptoEgreso, parametros, transaccion);
        }).then(function () {
            return G.Q.nfcall(that.m_e007.agregardocumento_d, parametros, transaccion);
        }).then(function () {
            console.log("agregardocumento_d");
            return G.Q.nfcall(that.m_e007.eliminarMovimientoConceptoEgreso, parametros, transaccion);

        }).then(function (result) {
            if (result >= 1) {
                return G.Q.nfcall(that.m_e007.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {
                throw 'eliminarMovimientoConceptoEgreso Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_e007.eliminarDocumentoTemporal, parametros, transaccion);
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
            return G.Q.nfcall(that.m_e007.consultar_detalle_documento, parametros);
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
            cabecera[0].cliente = parametros.tipo_id_tercero + " " + parametros.tercero_id + " : " + nombreTercero;
            cabecera[0].egreso = args.concepto_egreso;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: resultado,
                impresion: impresion,
                archivoHtml: 'documentoE007.html',
                reporte: "documentoE007"}, function (nombre_pdf) {
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
//
//// imprime el documento desde buscador de documentos
//E007Controller.prototype.crearHtmlDocumento = function (req, res) {
//    var that = this;
//    var args = req.body.data;
//    var nombreTercero = "";
//    var valorTotalFactura = "0";
//    var cabecera = [];
//    var detallea = [];
//
//    if (args.empresaId === '' || args.empresaId === undefined) {
//        res.send(G.utils.r(req.url, 'El empresa_id esta vacío', 404, {}));
//        return;
//    }
//    if (args.prefijo === '' || args.prefijo === undefined) {
//        res.send(G.utils.r(req.url, 'El prefijo esta vacío', 404, {}));
//        return;
//    }
//    if (args.numeracion === '' || args.numeracion === undefined) {
//        res.send(G.utils.r(req.url, 'El numeracion esta vacío', 404, {}));
//        return;
//    }
//
//    var parametros = {
//        empresaId: args.empresaId,
//        empresa_id: args.empresaId,
//        prefijoDocumento: args.prefijo,
//        numeracionDocumento: args.numeracion,
//        prefijo_doc_cliente: args.prefijoFactura,
//        numero_doc_cliente: args.numeroFactura,
//        tipo_id_tercero: args.tipoTercero,
//        tercero_id: args.terceroId,
//        id: args.terceroId,
//        tipoId: args.tipoTercero.trim()
//    };
//
//    try {
//        var nomb_pdf = "documentoI012" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
//        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
//            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
//            return;
//        }
//    } catch (e) {
//        console.log("NO EXISTE ARCHIVO  ");
//    }
//
//    G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros).then(function (result) {
//        cabecera = result;
//        if (result.length > 0) {
//            
//            valorTotalFactura = parseFloat(cabecera[0].total_costo).toFixed(2);
//            
//            return G.Q.nfcall(that.m_e007.consultar_detalle_documento, parametros);
//        } else {
//            throw 'Consulta getDoc sin resultados';
//        }
//    }).then(function (resultado) {
//        detallea = resultado;
//
//        return G.Q.nfcall(that.m_e007.listarClienteId, parametros);
//
//    }).then(function (resultado) {
//
//        if (resultado.length > 0) {
//
//            nombreTercero = resultado[0].nombre_tercero;
//        }
//
//        var fecha = new Date();
//        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
//        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
//        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
//
//        if (detallea.length > 0) {
//
//            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
//            cabecera[0].cliente = parametros.tipo_id_tercero + " " + parametros.tercero_id + " : " + nombreTercero;
//            cabecera[0].num_factura = parametros.prefijo_doc_cliente + " - " + parametros.numero_doc_cliente;
//            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
//                cabecerae: cabecera[0],
//                detalle: detallea,
//                impresion: impresion,
//                valorTotal: valorTotalFactura,
//                archivoHtml: 'documentoI012.html',
//                reporte: "documentoI012"}, function (nombre_pdf) {
//                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
//            });
//        } else {
//            throw 'Consulta consultar_detalle_documento sin resultados';
//        }
//
//    }).catch(function (err) {
//        console.log("crearDocumento>>>>", err);
//        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
//    }).done();
//};
//
///*==================================================================================================================================================================
// * 
// *                                                          FUNCIONES PRIVADAS
// * 
// * ==================================================================================================================================================================*/

function __generarPdf(datos, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/E007/reports/javascripts/rotulos.js', 'utf8'),
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
;


E007Controller.$inject = ["m_movimientos_bodegas", "m_e007"];
module.exports = E007Controller;
