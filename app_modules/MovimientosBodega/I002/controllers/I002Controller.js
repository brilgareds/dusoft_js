
var I002Controller = function(movimientos_bodegas, m_I002, e_I002, pedidos_clientes, pedidos_farmacias, eventos_pedidos_clientes, eventos_pedidos_farmacias, terceros, m_pedidos) {

    console.log("Modulo I002 Cargado ");

    this.m_movimientos_bodegas = movimientos_bodegas;

    this.m_I002 = m_I002;
    this.e_I002 = e_I002;

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

    this.m_terceros = terceros;
    this.m_pedidos = m_pedidos;
};



I002Controller.prototype.newDocTemporal = function(req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var orden_pedido_id = args.orden_pedido_id;
    var bodegas_doc_id = args.bodegas_doc_id;
    var observacion = args.observacion;
    var movimiento_temporal_id;

    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'El Numero de Orden NO esta definida', 404, {}));
        return;
    }

    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }
    if (args.bodegas_doc_id === undefined) {
        res.send(G.utils.r(req.url, 'La bodega NO esta definida', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function(doc_tmp_id) {

        movimiento_temporal_id = doc_tmp_id;

        G.knex.transaction(function(transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodegas_doc_id, observacion, transaccion).then(function() {

                var parametros = {
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id,
                    orden_pedido_id: orden_pedido_id
                };
                return G.Q.nfcall(that.m_I002.insertarBodegasMovimientoOrdenesCompraTmp, parametros, transaccion);

            }).then(function() {
                transaccion.commit(movimiento_temporal_id);
            }).fail(function(err) {
                transaccion.rollback(err);
            }).done();

        }).then(function(movimiento_temporal_id) {
            res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {movimiento_temporal_id: movimiento_temporal_id}));
        }). catch (function(err) {
	    console.log("EROR ",err);
            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
        }).done();

    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
    }).done();
};

I002Controller.prototype.agregarItemFOC = function(req, res) {

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
    if (args.porcentajeGravamen === undefined) {
        res.send(G.utils.r(req.url, 'El porcentajeGravamen no esta definida', 404, {}));
        return;
    }
    if (args.fechaIngreso === undefined) {
        res.send(G.utils.r(req.url, 'La fechaIngreso no esta definida', 404, {}));
        return;
    }
    if (args.justificacionIngreso === undefined) {
        res.send(G.utils.r(req.url, 'La justificacionIngreso no esta definida', 404, {}));
        return;
    }
    if (args.ordenPedidoId === undefined) {
        res.send(G.utils.r(req.url, 'El ordenPedidoId no esta definida', 404, {}));
        return;
    }
    if (args.totalCosto === undefined) {
        res.send(G.utils.r(req.url, 'El totalCosto no esta definida', 404, {}));
        return;
    }
    if (args.localProd === undefined) {
        res.send(G.utils.r(req.url, 'El localProd no esta definida', 404, {}));
        return;
    }
    if (args.valorUnitarioCompra === undefined) {
        res.send(G.utils.r(req.url, 'El valorUnitarioCompra no esta definida', 404, {}));
        return;
    }
    if (args.valorUnitarioFactura === undefined) {
        res.send(G.utils.r(req.url, 'El valorUnitarioFactura no esta definida', 404, {}));
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
        porcentajeGravamen: args.porcentajeGravamen,
        fechaIngreso: args.fechaIngreso,
        justificacionIngreso: args.justificacionIngreso,
        ordenPedidoId: args.ordenPedidoId,
        totalCosto: args.totalCosto,
        localProd: args.localProd,
        usuarioId: args.usuarioId,
        itemId: args.itemId,
        valorUnitarioCompra: args.valorUnitarioCompra,
        valorUnitarioFactura: args.valorUnitarioFactura,
        usuarioId: usuarioId
    };

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodegaDestino", parametros).then(function(resultado) {
        if (resultado.length > 0) {
            return G.Q.nfcall(that.m_I002.agregarItemFOC, parametros);
        } else {
            throw {msj: "El producto " + parametros.codigoProducto + " no se encuentra en bodegas_existencias.", status: 403};
        }
    }).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Temporal FOC guardado correctamente', 200, {agregarItemFOC: resultado}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, err.msj, err.status, {agregarItemFOC: []}));
    }).done();

};


I002Controller.prototype.listarInvBodegasMovimientoTmpOrden = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'La orden_pedido_id NO esta definida', 404, {}));
        return;
    }

    var parametros = {
        usuarioId: usuarioId,
        orden_pedido_id: args.orden_pedido_id
    };
    G.Q.ninvoke(that.m_I002, "listarInvBodegasMovimientoTmpOrden", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {listarInvBodegasMovimientoTmpOrden: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al listaInvBodegasMovimientoTmpOrden', 500, {}));
    }).done();
};

I002Controller.prototype.listarProductosParaAsignar = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'La orden_pedido_id NO esta definida', 404, {}));
        return;
    }
    if (args.fabricante_id === undefined || args.fabricante_id === '') {
        args.fabricante_id = "-1";
    }

    var parametros = {
        numero_orden: args.numero_orden,
        empresa_id: args.empresa_id, //Sesion.getUsuarioActual().getEmpresa().getCodigo()
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        doc_tmp_id: args.doc_tmp_id,
        descripcion: args.descripcion,
        tipoFiltro: args.tipoFiltro,
        fabricante_id: args.fabricante_id
    };

    G.Q.ninvoke(that.m_I002, "listarProductosParaAsignar", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Listar Productos Para Asignar', 200, {listarProductosParaAsignar: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos Para Asignar', 500, {}));
    }).done();
};
/*
 * @param {type} req: empresa_id,orden_pedido_id
 * @param {type} res
 * @returns lista de Productos por autorizar
 */
I002Controller.prototype.listarProductosPorAutorizar = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }

    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'La orden_pedido_id no esta definida', 404, {}));
        return;
    }

    var parametros = {
        empresa_id: args.empresa_id,
        orden_pedido_id: args.orden_pedido_id
    };
    G.Q.ninvoke(that.m_I002, "listarProductosPorAutorizar", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Lista Productos Por Autorizar', 200, {listarProductosPorAutorizar: result}));
    }).fail(function(err) {
        console.log("listarProductosPorAutorizar ", err);
        res.send(G.utils.r(req.url, 'Error al listar Productos Por Autorizar', 500, {}));
    }).done();
};

I002Controller.prototype.listarParametrosRetencion = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'La empresa_id NO esta definida', 404, {}));
        return;
    }
    var parametros = {empresa_id: args.empresa_id};
    G.Q.ninvoke(that.m_I002, "listarParametrosRetencion", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Lista Parametros Retencion', 200, {listarParametrosRetencion: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar Parametros de Retencion', 500, {}));
    }).done();
};

I002Controller.prototype.listarGetItemsDocTemporal = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }
    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'El doc_tmp_id NO esta definido', 404, {}));
        return;
    }
    var parametros = {usuario_id: usuarioId, orden_pedido_id: args.orden_pedido_id};
    G.Q.ninvoke(that.m_I002, "listarGetItemsDocTemporal", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Lista Items Documento Temporal', 200, {listarGetItemsDocTemporal: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar Items Documento Temporal', 500, {}));
    }).done();
};

I002Controller.prototype.eliminarGetDocTemporal = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    console.log("*********eliminarGetDocTemporal*****************");

    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }
    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'El orden_pedido_id NO esta definido', 404, {}));
        return;
    }
    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }

    var docTmpId = args.doc_tmp_id;
    var ordenPedidoId = args.orden_pedido_id;
    var parametros = {ordenPedidoId: ordenPedidoId, docTmpId: docTmpId, usuarioId: usuarioId};


    G.knex.transaction(function(transaccion) {

        G.Q.ninvoke(that.m_I002, "eliminarOrdenPedidoProductosFoc", parametros, transaccion).then(function(result) {

            parametros.usuario_id = usuarioId;
            return G.Q.ninvoke(that.m_I002, "eliminar_documento_temporal_d", parametros, transaccion);

        }).then(function(result) {
            return G.Q.ninvoke(that.m_I002, "eliminar_documento_temporal", parametros, transaccion);

        }).then(function(result) {

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

I002Controller.prototype.listarGetDocTemporal = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;

    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }
    if (args.orden_pedido_id === undefined) {
        res.send(G.utils.r(req.url, 'El orden_pedido_id NO esta definido', 404, {}));
        return;
    }
    var parametros = {usuario_id: usuarioId, orden_pedido_id: args.orden_pedido_id};
    G.Q.ninvoke(that.m_I002, "listarGetDocTemporal", parametros).then(function(result) {
        res.send(G.utils.r(req.url, 'Lista Documento Temporal', 200, {listarGetDocTemporal: result}));
    }).fail(function(err) {
	console.log(">>>>>>>>>>>>>>>>>>> ",err);
        res.send(G.utils.r(req.url, 'Error al Listar Documento Temporal', 500, {err: err}));
    }).done();
};


I002Controller.prototype.execCrearDocumento = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var parametros = {};


    if (args.movimientos_bodegas.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.orden_pedido_id === '') {
        res.send(G.utils.r(req.url, 'El orden_pedido_id esta vacío', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.usuario_id === '') {
        usuarioId = req.session.user.usuario_id;
    } else {
        usuarioId = args.movimientos_bodegas.usuario_id;
    }

    var ordenPedidoId = args.movimientos_bodegas.orden_pedido_id;

    var docTmpId = args.movimientos_bodegas.doc_tmp_id;
    var resultadoProducto;
    parametros.ordenPedidoId = ordenPedidoId;
    parametros.orden_pedido_id = ordenPedidoId;
    parametros.usuarioId = usuarioId;
    parametros.usuario_id = usuarioId;
    parametros.docTmpId = docTmpId;
    var cabecera = [];
    var detalle = [];
    var consulta = [];
    var impuesto = [];
    var comprasTemporal = [];
    G.knex.transaction(function(transaccion) {

        G.Q.ninvoke(that.m_movimientos_bodegas, "crear_documento", docTmpId, usuarioId, transaccion).then(function(result) {

            parametros.empresaId = result.empresa_id;
            parametros.empresa_id = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.orden_pedido_id = parametros.ordenPedidoId;

            return G.Q.ninvoke(that.m_I002, "agregarBodegasMovimientoOrdenesCompras", parametros, transaccion);

        }).then(function(result) {

            if (result.rowCount >= 1) {
                return G.Q.ninvoke(that.m_I002, "listarGetDocTemporal", parametros);//listarInvBodegasMovimientoTmpOrden
            } else {
                throw 'agregarBodegasMovimientoOrdenesCompras Fallo';
            }

        }).then(function(result) {

            parametros.porcentaje_rtf = result[0].porcentaje_rtf;
            parametros.porcentaje_ica = result[0].porcentaje_ica;
            parametros.porcentaje_cree = 0;
            parametros.porcentaje_reteiva = result[0].porcentaje_reteiva;
//throw 'agregarBodegasMovimientoOrdenesCompras Fallo';
            return G.Q.ninvoke(that.m_I002, "updateInvBodegasMovimiento", parametros, transaccion);

        }).then(function(result) {

            if (result >= 1) {
                return G.Q.ninvoke(that.m_I002, "eliminarOrdenPedidoProductosFoc", parametros, transaccion);
            } else {
                throw 'updateInvBodegasMovimiento Fallo';
            }

        }).then(function(result) {

            parametros.usuario_id = usuarioId;
            return G.Q.ninvoke(that.m_I002, "listarGetItemsDocTemporal", parametros);

        }).then(function(result) {

            resultadoProducto = result;
            return G.Q.ninvoke(that.m_I002, "eliminar_documento_temporal_d", parametros, transaccion);

        }).then(function(result) {

            if (result >= 1) {

                return G.Q.ninvoke(that.m_I002, "eliminar_documento_temporal", parametros, transaccion);
            } else {
                throw 'eliminar_documento_temporal_d Fallo';
            }

        }).then(function(result) {

            if (result >= 1) {
                return G.Q.ninvoke(that.m_I002, "fecha_ingreso_orden_compra", parametros, transaccion);
            } else {
                throw 'eliminar_documento_temporal Fallo';
            }

        }).then(function(result) {

            if (result >= 1) {
                return G.Q.nfcall(__modificarComprasOrdenesPedidosDetalle, that, 0, resultadoProducto, 0, transaccion);
            } else {
                throw 'fecha_ingreso_orden_compra Fallo';
            }

        }).then(function(result) {

            if (result >= 1) {
                return G.Q.ninvoke(that.m_I002, "listarDocumentoTempIngresoCompras", parametros);
            } else {
                throw '__modificarComprasOrdenesPedidosDetalle Fallo';
            }

        }).then(function(result) {

            comprasTemporal = result[0];

            if (result.length >= 1) {
                result[0].prefijo = parametros.prefijoDocumento;
                result[0].numero = parametros.numeracionDocumento;
                return G.Q.ninvoke(that.m_I002, "insertarRecepcionParcialCabecera", result[0], transaccion);
            } else {
                throw 'listarDocumentoTempIngresoCompras Fallo';
            }

        }).then(function(result) {

            if (result.length >= 1) {
                resultadoProducto.recepcion_parcial_id = result[0];
                return G.Q.nfcall(__insertarRecepcionParcialDetalle, that, 0, resultadoProducto, 0, transaccion);
            } else {
                throw 'insertarRecepcionParcialCabecera Fallo';
            }

        }).then(function(result) {

            if (result >= 1) {
                return G.Q.ninvoke(that.m_I002, "listarIngresosAutorizados", comprasTemporal);
            } else {
                throw '__insertarRecepcionParcialDetalle Fallo';
            }

        }).then(function(result) {

            if (result.length >= 1) {
                result.prefijo = parametros.prefijoDocumento;
                result.numero = parametros.numeracionDocumento;
                return G.Q.nfcall(__ingresoAutorizacion, that, 0, result, 0, transaccion);
            } else {
                return 1;
            }

        }).then(function(result) {

            if (result >= 1) {
                transaccion.commit();
//transaccion.rollback();
                return false;
            } else {
                throw ' Fallo ';
            }

        }).fail(function(err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);

        }).done();

    }).then(function() {

        return G.Q.ninvoke(that.m_movimientos_bodegas, "getDoc", parametros);

    }).then(function(resultado) {

        cabecera = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "consultar_detalle_documento_despacho", parametros.numeracionDocumento, parametros.prefijoDocumento, parametros.empresaId);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function(resultado) {

        detalle = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "ordenTercero", parametros);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function(resultado) {

        consulta = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_I002, "listarParametrosRetencion", parametros);
        } else {
            throw 'Consulta ordenTercero sin resultados';
        }

    }).then(function(resultado) {

        impuesto = resultado;
        if (resultado.length > 0) {
            var valores = {
                valorTotal: 0,
                porc_iva: 0,
                ValorSubTotal: 0,
                IvaProducto: 0,
                IvaTotal: 0,
                subtotal: 0,
		total:0,
		valorRetIva:0,
	        valorRetIca:0,
		valorRetFte:0
            };
            return G.Q.nfcall(__impuestos, that, 0, detalle[0], impuesto[0], valores, cabecera[0]);

        } else {
            throw 'Consulta listarParametrosRetencion sin resultados';
        }

    }).then(function(resultado) {

        var fecha = new Date();
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
                reporte: "documentoI002"}, function(nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero, recepcion_parcial_id: resultadoProducto.recepcion_parcial_id}));
            });
        } else {
            throw 'Consulta listarParametrosRetencion sin resultados';
        }

    }). catch (function(err) {

        console.log("execCrearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));

    }).done();
};

I002Controller.prototype.crearHtmlDocumento = function(req, res) {
    var that = this;
    var args = req.body.data;
    var cabecera = [];
    var detalle = [];
    var consulta = [];
    var impuesto = [];


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

//    try {
//        var nomb_pdf = "documentoI002" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
//        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
//            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
//            return;
//        }
//    } catch (e) {
//        console.log("NO EXISTE ARCHIVO  ");
//    }

    G.Q.ninvoke(that.m_movimientos_bodegas, "getDoc", parametros).then(function(result) {
        cabecera = result;

        if (result.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "consultar_detalle_documento_despacho", parametros.numeracionDocumento, parametros.prefijoDocumento, parametros.empresaId);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function(resultado) {
        detalle = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_movimientos_bodegas, "ordenTercero", parametros);
        } else {
            throw 'Consulta consultar_detalle_documento_despacho sin resultados';
        }
    }).then(function(resultado) {
        consulta = resultado;
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_I002, "listarParametrosRetencion", parametros);
        } else {
            throw 'Consulta ordenTercero sin resultados';
        }
    }).then(function(resultado) {
        impuesto = resultado;

        if (resultado.length > 0) {
            var valores = {
	        valorTotal: 0,
                porc_iva: 0,
                ValorSubTotal: 0,
                IvaProducto: 0,
                IvaTotal: 0,
                subtotal: 0,
		total:0,
		valorRetIva:0,
	        valorRetIca:0,
		valorRetFte:0
            };
            return G.Q.nfcall(__impuestos, that, 0, detalle[0], impuesto[0], valores, cabecera[0]);

        } else {
            console.log("Consulta listarParametrosRetencion sin resultados ");
            throw 'Consulta listarParametrosRetencion sin resultados';
        }

    }).then(function(resultado) {
	console.log("impuesto",resultado);
        var fecha = new Date();
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
                reporte: "documentoI002"}, function(nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            console.log("Consulta listarParametrosRetencion sin resultados ");
            throw 'Consulta listarParametrosRetencion sin resultados';
        }

    }). catch (function(err) {
        console.log("crearHtmlDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el html del Documento', 500, {err: err}));
    }).done();
};

function __impuestos(that, index, productos, impuesto, resultado, cabecera, callback) {

    var producto = productos[index];
    if (!producto) {

console.log("_____________________________________________");
console.log("index ",index);
console.log("productos ",productos);
console.log("impuesto ",impuesto);
console.log("resultado  ",resultado);
console.log("cabecera  ",cabecera);
console.log("_____________________________________________");
        if (impuesto.sw_rtf === '2' || impuesto.sw_rtf === '3')
            if (resultado.subtotal >= parseInt(impuesto.base_rtf)) {		
                resultado.valorRetFte = Math.round(resultado.subtotal * (cabecera.porcentaje_rtf / 100));//cabecera.valorRetFte
		console.log("resultado.subtotal  ",resultado.subtotal);
		console.log("impuesto.base_rtf  ",impuesto.base_rtf);
		console.log("cabecera.porcentaje_rtf ",cabecera.porcentaje_rtf);
            } else {
                resultado.valorRetFte = 0;
		console.log("b______________",resultado.valorRetFte);
            }

        if (impuesto.sw_ica === '2' || impuesto.sw_ica === '3'){
	    console.log("impuesto.sw_ica ",impuesto.sw_ica);
	    console.log("resultado.subtotal ",resultado.subtotal);
	    console.log("impuesto.base_ica ",impuesto.base_ica);
	    console.log("========= ",Math.round(resultado.subtotal * (cabecera.porcentaje_ica / 1000)));
            if (resultado.subtotal >= parseInt(impuesto.base_ica)) {
                resultado.valorRetIca = Math.round(resultado.subtotal * (cabecera.porcentaje_ica / 1000));//cabecera.valorRetIca
            } else {
                resultado.valorRetIca = 0;
            }
	 } 
        if (impuesto.sw_reteiva === '2' || impuesto.sw_reteiva === '3')
            if (resultado.subtotal >= parseInt(impuesto.base_reteiva)) {
		
                resultado.valorRetIva = Math.round(resultado.IvaTotal * (cabecera.porcentaje_reteiva / 100));//cabecera.valorRetIva
            } else {
                resultado.valorRetIva = 0;
            }

        resultado.total = Math.round(((((resultado.subtotal + resultado.IvaTotal) - resultado.valorRetFte) - resultado.valorRetIca) - resultado.valorRetIva));

        callback(false, [resultado]);
        return;
    }

    index++;
    resultado.valorTotal += parseInt(producto.valor_total_1);

    resultado.porc_iva = (producto.porcentaje_gravamen / 100) + 1;
    resultado.ValorSubTotal = (producto.total_costo / resultado.porc_iva);
    resultado.IvaProducto = producto.total_costo - resultado.ValorSubTotal;
    resultado.IvaTotal = Math.round(resultado.IvaTotal + (resultado.IvaProducto));
    resultado.subtotal += parseInt(resultado.ValorSubTotal);

    setTimeout(function() {
        __impuestos(that, index, productos, impuesto, resultado, cabecera, callback);
//	clearTimeout(time);
    }, 0);
}
;

function __modificarComprasOrdenesPedidosDetalle(that, index, parametros, resultado, transaccion, callback) {
    console.log("*****************__modificarComprasOrdenesPedidosDetalle*****************************");
    var productos = parametros[index];

    if (!productos) {

        callback(false, resultado);
        return;
    }

    G.Q.ninvoke(that.m_I002, "updateComprasOrdenesPedidosDetalle", productos, transaccion).then(function(result) {

        index++;

       var time = setTimeout(function() {
            resultado += result;
            __modificarComprasOrdenesPedidosDetalle(that, index, parametros, resultado, transaccion, callback);
	    clearTimeout(time);
        }, 0);

    }).fail(function(err) {
        console.log("recursiva__modificarComprasOrdenesPedidosDetalle:::::::", err);
        callback(true, err);
        return;
    }).done();
}

function __insertarRecepcionParcialDetalle(that, index, parametros, resultado, transaccion, callback) {

    var productos = parametros[index];

    if (!productos) {
        callback(false, resultado);
        return;
    }
    productos.recepcion_parcial_id = parametros.recepcion_parcial_id;

    G.Q.ninvoke(that.m_I002, "insertarRecepcionParcialDetalle", productos, transaccion).then(function(result) {

        index++;

      var time = setTimeout(function() {
            resultado += result.rowCount;
            __insertarRecepcionParcialDetalle(that, index, parametros, resultado, transaccion, callback);
	   clearTimeout(time);
        }, 0);

    }).fail(function(err) {
        consol.log("__insertarRecepcionParcialDetalle:::::::", err);
        callback(true, err);
        return;
    }).done();
}

function __ingresoAutorizacion(that, index, parametros, resultado, transaccion, callback) {

    var productos = parametros[index];

    if (!productos) {
        callback(false, resultado);
        return;
    }
    productos.numero = parametros.numero;
    productos.prefijo = parametros.prefijo;

    G.Q.ninvoke(that.m_I002, "ingresoAutorizacion", productos, transaccion).then(function(result) {

        index++;

        var time = setTimeout(function() {
            resultado += result.rowCount;
            __ingresoAutorizacion(that, index, parametros, resultado, transaccion, callback);
	    clearTimeout(time);
        }, 0);

    }).fail(function(err) {
        console.log("__ingresoAutorizacion:::::::", err);
        callback(true, err);
        return;
    }).done();
}


function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
	    helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I002/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function(err, response) {

        response.body(function(body) {
            var fecha = new Date();

            var nombreTmp = datos.reporte + datos.cabecerae.prefijo + datos.cabecerae.numero + ".html";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function(err) {
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

I002Controller.$inject = ["m_movimientos_bodegas", "m_i002", "e_i002", "m_pedidos_clientes", "m_pedidos_farmacias", "e_pedidos_clientes", "e_pedidos_farmacias", "m_terceros", "m_pedidos"];

module.exports = I002Controller;