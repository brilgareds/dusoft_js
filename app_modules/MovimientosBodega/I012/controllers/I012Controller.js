
var I012Controller = function (movimientos_bodegas, m_i012) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_i012 = m_i012;

};

/*
 * @author German Galvis
 * @fecha 20/03/2018
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
I012Controller.prototype.listarTiposTerceros = function (req, res) {

    var that = this;
    G.Q.nfcall(that.m_i012.listarTiposTerceros).
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
 * @fecha 2018-03-24
 */
I012Controller.prototype.listarClientes = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        filtro: args.filtro,
        terminoBusqueda: args.terminoBusqueda,
        empresaId: args.empresaId,
        paginaActual: args.paginaActual
    };
    G.Q.nfcall(that.m_i012.listarClientes, parametros).
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
 * +Descripcion lista las facturas que pertenecen al cliente seleccionado
 * @fecha 2018-03-26
 */
I012Controller.prototype.listarFacturas = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        documento: args.documento,
        tipo_documento: args.tipo_documento,
        empresaId: args.empresaId
    };
    G.Q.nfcall(that.m_i012.listarFacturas, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar facturas ok!!!!', 200, {listarFacturas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar facturas del cliente', 500, {listarFacturas: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos de la factura
 * @fecha 2018-03-26
 */
I012Controller.prototype.listarProductosFacturas = function (req, res) {
    var that = this;
    var args = req.body.data;
    if (args.numero_doc === undefined) {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }
    if (args.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'prefijo no esta definido', 404, {}));
        return;
    }

    var parametros = {
        numero_doc: args.numero_doc,
        prefijo: args.prefijo,
        empresa_id: args.empresaId
    };
    that.m_i012.listarProductosFacturas(parametros, function (err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'productos factura', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};

/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2018-03-26
 */
I012Controller.prototype.newDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var empresaId = args.empresaId;
    var bodega_doc_id = args.bodega_doc_id;
    var tipo_id_tercero = args.tipo_id_tercero;
    var tercero_id = args.tercero_id;
    var prefijo = args.prefijo_factura;
    var numero = args.numero_factura;
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
                return G.Q.nfcall(that.m_i012.modificarDevolucionFacturaTmp, parametros, transaccion);
            }).then(function () {
                var parametros2 = {
                    prefijoFactura: prefijo,
                    numeroFactura: numero,
                    empresa_id: empresaId,
                    tipo_id_tercero: tipo_id_tercero,
                    tercero_id: tercero_id,
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id
                };
                return G.Q.nfcall(that.m_i012.generarMovimientoDevolucionClienteTmp, parametros2, transaccion);
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
 * @fecha 2018-03-27
 */
I012Controller.prototype.eliminarGetDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var listado = args.listado;
    var usuarioId = req.session.user.usuario_id;
    var tablaUpdate;


    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }

    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }

    if (args.tipoDocumento === 1) {
        tablaUpdate = "inv_facturas_agrupadas_despacho_d";
    } else if (args.tipoDocumento === 0) {
        tablaUpdate = "inv_facturas_despacho_d";
    }

    var parametros = {
        docTmpId: args.doc_tmp_id,
        numero_doc: args.numero_doc,
        prefijo: args.prefijo,
        tabla: tablaUpdate,
        usuarioId: usuarioId
    };


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_i012.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_i012.eliminarDocumentoTemporal, parametros, transaccion);

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
 * +Descripcion agrega productos al documento temporal y tablas tmp
 * @fecha 2018-03-27
 */
I012Controller.prototype.agregarItem = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var tablaUpdate;

    if (args.tipoDocumento === 1) {
        tablaUpdate = "inv_facturas_agrupadas_despacho_d";
    } else if (args.tipoDocumento === 0) {
        tablaUpdate = "inv_facturas_despacho_d";
    }


    var parametros = {
        usuarioId: usuarioId,
        bodega: args.bodega,
        cantidad: args.cantidad,
        centroUtilidad: args.centroUtilidad,
        codigoProducto: args.codigoProducto,
        docTmpId: args.docTmpId,
        empresaId: args.empresaId,
        fechaVencimiento: args.fechaVencimiento,
        lote: args.lote,
        item_id: args.item_id,
        gravamen: args.gravamen,
        totalCosto: args.totalCosto,
        valorU: args.valorU,
        totalCostoPedido: args.totalCostoPedido,
        numero_doc: args.numero_doc,
        prefijo: args.prefijo,
        tabla: tablaUpdate

    };

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function (resultado) {
        if (resultado.length > 0) {

            G.knex.transaction(function (transaccion) {

                G.Q.nfcall(that.m_i012.agregarItem, parametros, transaccion).then(function () {

                    return G.Q.nfcall(that.m_i012.updatefacturaD, parametros, transaccion);

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
 * +Descripcion lista los productos del documento tmp
 * @fecha 2018-03-27
 */
I012Controller.prototype.consultarProductosDevueltos = function (req, res) {
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
    G.Q.nfcall(that.m_i012.consultarProductosDevueltos, parametro).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar productos devueltos ok!!!!', 200, {lista_productos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos devueltos', 500, {lista_productos: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-03-28
 */
I012Controller.prototype.eliminarItem = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var tablaUpdate;

    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }

    if (args.tipoDocumento === 1) {
        tablaUpdate = "inv_facturas_agrupadas_despacho_d";
    } else if (args.tipoDocumento === 0) {
        tablaUpdate = "inv_facturas_despacho_d";
    }

    var parametros = {
        item_id: args.item_id,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId,
        cantidad: args.cantidad,
        codigo_producto: args.codigo_producto,
        fechaVencimiento: args.fechaVencimiento,
        lote: args.lote,
        numero_doc: args.numero_doc,
        prefijo: args.prefijo,
        tabla: tablaUpdate
    };

    G.knex.transaction(function (transaccion) {


        G.Q.nfcall(that.m_i012.eliminarItem, parametros, transaccion).then(function (result) {

            return G.Q.nfcall(that.m_i012.restarCantidadFacturaD, parametros, transaccion);

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
 * +Descripcion lista las retenciones deacuerdo al año
 * @fecha 2018-04-02
 */
I012Controller.prototype.consultarRetenciones = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        anio: args.anio,
        empresaId: args.empresaId
    };
    G.Q.nfcall(that.m_i012.parametrosRetencion, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar retenciones clientes ok!!!!', 200, {consultarRetenciones: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar retenciones de facturas', 500, {consultarRetenciones: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo IDC
 * @fecha 2018-04-03
 */
I012Controller.prototype.crearDocumento = function (req, res) {
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

            parametros.empresaId = result.empresa_id; //getDoc
            parametros.prefijoDocumento = result.prefijo_documento; 
            parametros.numeracionDocumento = result.numeracion_documento; 
            parametros.tipo_id_tercero = args.tipo_id_tercero; 
            parametros.tercero_id = args.tercero_id;
            parametros.prefijo_doc_cliente = args.prefijo_doc_cliente;
            parametros.numero_doc_cliente = args.numero_doc_cliente; 
            parametros.docTmpId = args.docTmpId; 
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;         

            return G.Q.nfcall(that.m_i012.agregarMovimientoCliente, parametros, transaccion);

        }).then(function () {
            return G.Q.nfcall(that.m_i012.eliminarMovimientoDevolucionCliente, parametros, transaccion);

        }).then(function (result) {
            if (result >= 1) {
                return G.Q.nfcall(that.m_i012.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {
                throw 'eliminar_movimiento_devolucion_farmacia_temporal_d Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_i012.eliminarDocumentoTemporal, parametros, transaccion);
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

//    }).then(function (resultado) {
//        var fecha = new Date();
//        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
//        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
//        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
//
//        if (resultado.length > 0) {
//
//            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
//            cabecera[0].edb_id = parametros.prefijo_doc + " " + parametros.numero_doc;
//            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
//                cabecerae: cabecera[0],
//                detalle: resultado,
//                impresion: impresion,
//                archivoHtml: 'documentoI011.html',
//                reporte: "documentoI011"}, function (nombre_pdf) {
//                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
//            });
//        } else {
//            throw 'Consulta consultar_detalle_documento sin resultados';
//        }

    }).catch(function (err) {
        console.log("crearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
    }).done();



};

// imprime el documento desde buscador de documentos
/*I011Controller.prototype.crearHtmlDocumento = function (req, res) {
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
 var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
 var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
 
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
 /*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

/*function __generarPdf(datos, callback) {
 
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
 }*/


function __updateMovimiento(that, listado, parametros, index, transaccion, callback) {

    var item = listado[index];
    if (!item) {
        callback(false, 0);
        return;
    }

    parametros.codigo_producto = item.codigo_producto;
    parametros.lote = item.lote;
    parametros.fechaVencimiento = item.fecha_vencimiento;
    parametros.cantidad = item.cantidad;

    G.Q.nfcall(that.m_i012.restarCantidadFacturaD, parametros, transaccion).then(function (resultado) {
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



I012Controller.$inject = ["m_movimientos_bodegas", "m_i012"];
module.exports = I012Controller;
