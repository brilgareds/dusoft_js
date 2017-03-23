
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
                            movimiento_temporal_id, usuarioId, bodegas_doc_id,observacion, transaccion).then(function() {

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
        }).catch (function(err) {
            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
        }).done();
        
     }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
     }).done();
};

//I002Controller.prototype.agregarItemFOC = function(req, res) {
//    
//    var that = this;
//    var args = req.body.data;
//    var usuarioId = req.session.user.usuario_id;
//    
//    var parametros = {
//       empresaId :
//       centroUtilidad :       
//       bodega :
//       codigoProducto :
//       cantidad :
//       lote:
//       fechaVencimiento:
//       docTmpId: 
//       porcentajeGravamen:
//       fechaIngreso:
//       justificacionIngreso:
//       ordenPedidoId:
//       totalCosto:
//       localProd:
//       usuarioId:
//       itemId:
//       valorUnitarioCompra:
//       valorUnitarioFactura:
//    };
//    
//    if (args.orden_pedido_id === undefined) {
//        res.send(G.utils.r(req.url, 'El Numero de Orden NO esta definida', 404, {}));
//        return;
//    }
//
//    if (args.observacion === undefined) {
//        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
//        return;
//    }
//    if (args.bodegas_doc_id === undefined) {
//        res.send(G.utils.r(req.url, 'La bodega NO esta definida', 404, {}));
//        return;
//    }
//
//
//    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function(doc_tmp_id) {
//
//        movimiento_temporal_id = doc_tmp_id;  
//    G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal, 
//                movimiento_temporal_id, usuarioId, bodegas_doc_id,observacion, transaccion).then(function() {
//
//        var parametros = {
//            usuario_id: usuarioId,
//            doc_tmp_id: movimiento_temporal_id,
//            orden_pedido_id: orden_pedido_id
//        };
//        return G.Q.nfcall(that.m_I002.insertarBodegasMovimientoOrdenesCompraTmp, parametros, transaccion);
//
//    }).then(function() {
//        transaccion.commit(movimiento_temporal_id);
//    }).fail(function(err) {                   
//        transaccion.rollback(err);
//    }).done();
//});
//};


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
//{1:parametro.numero_orden,2:parametro.empresa_id,3:parametro.centro_utilidad,4:parametro.bodega,5:parametro.doc_tmp_id,6:"%" + parametro.descripcion + "%",7:parametro.codigo_prducto}
    if (args.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'La orden_pedido_id NO esta definida', 404, {}));
        return;
    }
    if (args.fabricante_id === undefined  ||  args.fabricante_id === '') {
        args.fabricante_id = "-1";
    }

    var parametros = {
        numero_orden: args.numero_orden,
        empresa_id:args.empresa_id,//Sesion.getUsuarioActual().getEmpresa().getCodigo()
        centro_utilidad:args.centro_utilidad,
        bodega:args.bodega,
        doc_tmp_id:args.doc_tmp_id,
        descripcion:args.descripcion,
        tipoFiltro:args.tipoFiltro,                
        fabricante_id:args.fabricante_id                
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
        console.log("listarProductosPorAutorizar ",err);
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
        res.send(G.utils.r(req.url, 'Error al Listar Documento Temporal', 500, {err:err}));
    }).done();
};


//I002Controller.prototype.ingresarMovimientoOrdenCompraTmporal=function(){
//  var that = this;
//   G.Q.ninvoke(that.m_movimientos_bodegas,"obtener_identificicador_movimiento_temporal",usuarioId).then(function(){
//      res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados Clientes!!!!', 200, {listarProductosBloqueados: listarProductosBloqueados}));
//    }).fail(function(err) {
//      res.send(G.utils.r(req.url, err.mensaje, err.estado, {}));
//    }).done();
//};

/*
// Generar Cabecera del Documento Temporal de CLIENTES
I002Controller.prototype.documentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.tipo_tercero_id === undefined || args.documento_temporal.tercero_id === undefined || args.documento_temporal.observacion === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.tipo_tercero_id === '' || args.documento_temporal.tercero_id === '' || args.documento_temporal.observacion === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }

    var bodegas_doc_id = 0;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var tipo_tercero_id = args.documento_temporal.tipo_tercero_id;
    var tercero_id = args.documento_temporal.tercero_id;
    var observacion = args.documento_temporal.observacion;
    var usuario_id = req.session.user.usuario_id;

    //Validar que el usuario que crea el documento temporal, sea el mismo responsable del pedido
    __validar_responsable_pedidos_clientes(that, numero_pedido, usuario_id, '1', function(err, continuar) {

        if (continuar) {
            that.m_I002.ingresar_despacho_clientes_temporal(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, function(err, doc_tmp_id) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
                    return;
                } else {
                 
                    that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                    res.send(G.utils.r(req.url, 'Documento Temporal Cliente Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
                    return;
                }
            });
        } else {
            res.send(G.utils.r(req.url, '!Advertencia!, El pedido esta asignado a otro usuario', 403, {documento_temporal: {}}));
            return;
        }
    });


};

// Finalizar Documento Temporal Clientes
I002Controller.prototype.finalizarDocumentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no está definido', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero de pedido debe ser mayor a cero', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    var estado = '6';

    var usuario_id = req.session.user.usuario_id;

    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {
        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        }

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado, operario[0].operario_id, usuario_id, function(_err, _rows, responsable_estado_pedido) {
            if (err) {
                res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                return;
            }

            that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, ['1', '6'], '1', function(err, rows, results) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                }


                that.m_I002.actualizar_estado_documento_temporal_clientes(numero_pedido, '1', function(err, rows, result) {
                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
                        return;
                    } else {

                        // Emitir evento para actualizar la lista de Documentos Temporales
                        that.e_I002.onNotificarDocumentosTemporalesClientes({numero_pedido: numero_pedido});
                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        res.send(G.utils.r(req.url, 'Documento Temporal Clientes Finalizado Correctamente', 200, {documento_temporal: {}}));
                        return;
                    }
                });


            });

        });
    });




};

// Generar Cabecera del Documento Temporal de FARMACIAS
I002Controller.prototype.documentoTemporalFarmacias = function(req, res) {


    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.observacion === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido, empresa_id u observacion no estan definidos ', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.empresa_id === '' || args.documento_temporal.observacion === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido, empresa_id u observacion estan vacios ', 404, {}));
        return;
    }

    var bodegas_doc_id = 0;
    var empresa_id = args.documento_temporal.empresa_id;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var observacion = args.documento_temporal.observacion;
    var usuario_id = req.session.user.usuario_id;


    //Validar que el usuario que crea el documento temporal, sea el mismo responsable del pedido
    __validar_responsable_pedidos_farmacias(that, numero_pedido, usuario_id, '1', function(err, continuar) {

        if (continuar) {

            that.m_I002.ingresar_despacho_farmacias_temporal(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, function(err, doc_tmp_id, resultado) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                } else {

                   
                    that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                    res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
                    return;
                }
            });
        } else {
            res.send(G.utils.r(req.url, '!Advertencia!, El pedido esta asignado a otro usuario', 403, {documento_temporal: {}}));
            return;
        }
    });

};

// Finalizar Documento Temporal Clientes
I002Controller.prototype.finalizarDocumentoTemporalFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no está definido', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero de pedido debe ser mayor a cero', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    var estado = '6';
    var usuario_id = req.session.user.usuario_id;

    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {

        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        }

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado, operario[0].operario_id, usuario_id, function(_err, _rows, responsable_estado_pedido) {

            if (err) {
                res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                return;
            }

            that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, ['1', '6'], '1', function(err, rows) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                }

                that.m_I002.actualizar_estado_documento_temporal_farmacias(numero_pedido, '1', function(err, rows) {
                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                        return;
                    } else {

                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        // Emitir evento para actualizar la lista de Documentos Temporales
                        that.e_I002.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

                        res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Finalizado Correctamente', 200, {documento_temporal: {}}));
                        return;
                    }
                });
            });

        });
    });


};

// Ingresar el detalle del documento temporal CLIENTES / FARMACIAS 
I002Controller.prototype.detalleDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;


    var validacion = __validarParametrosDetalleTemporal(args);
    if (!validacion.valido) {
        res.send(G.utils.r(req.url, validacion.msj, 404, {}));
    }

    if (args.documento_temporal.total_costo === undefined || args.documento_temporal.total_costo_pedido === undefined) {
        return {valido: false, msj: 'El costo total y el costo total del pedido no están definidas'};
    }

    if (args.documento_temporal.total_costo === '' || args.documento_temporal.total_costo_pedido === '') {
        return {valido: false, msj: 'El costo total y el costo total del pedido están vacíos'};
    }


    var empresa_id = args.documento_temporal.empresa_id;
    var centro_utilidad_id = args.documento_temporal.centro_utilidad_id;
    var bodega_id = args.documento_temporal.bodega_id;
    var doc_tmp_id = args.documento_temporal.doc_tmp_id;
    var codigo_producto = args.documento_temporal.codigo_producto;
    var lote = args.documento_temporal.lote;
    var fecha_vencimiento = args.documento_temporal.fecha_vencimiento;
    var cantidad_ingresada = args.documento_temporal.cantidad_ingresada;
    var valor_unitario = args.documento_temporal.valor_unitario;
    var iva = args.documento_temporal.iva;
    var total_costo = args.documento_temporal.total_costo;
    var total_costo_pedido = args.documento_temporal.total_costo_pedido;
    var usuario_id = req.session.user.usuario_id;

    //gestionar_detalle_movimiento_bodega();

    that.m_movimientos_bodegas.ingresar_detalle_movimiento_bodega_temporal(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad_ingresada, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando Ingresando el Producto en el documento', 500, {documento_temporal: {item_id: 0}}));
            return;
        } else {

            var item_id = (rows.length > 0) ? rows[0].item_id : 0;

            res.send(G.utils.r(req.url, 'Producto registrado correctamente en el documento temporal', 200, {documento_temporal: {item_id: item_id}}));
            return;
        }
    });
};


I002Controller.prototype.modificarDetalleDocumentoTemporal = function(req, res) {
    var that = this;

    var args = req.body.data;

    var validacion = __validarParametrosDetalleTemporal(args);
    if (!validacion.valido) {
        res.send(G.utils.r(req.url, validacion.msj, 404, {}));
    }


    var item_id = args.documento_temporal.item_id;
    var lote = args.documento_temporal.lote;
    var fecha_vencimiento = args.documento_temporal.fecha_vencimiento;
    var cantidad_ingresada = args.documento_temporal.cantidad_ingresada;
    var valor_unitario = args.documento_temporal.valor_unitario;
    var usuario_id = args.documento_temporal.usuario_id;
    var empresa_id = args.documento_temporal.empresa_id;
    var centro_utilidad_id = args.documento_temporal.centro_utilidad_id;
    var bodega_id = args.documento_temporal.bodega_id;
    var doc_tmp_id = args.documento_temporal.doc_tmp_id;
    var codigo_producto = args.documento_temporal.codigo_producto;
    var iva = args.documento_temporal.iva;


    that.m_movimientos_bodegas.modificar_detalle_movimiento_bodega_temporal(item_id, valor_unitario, cantidad_ingresada, lote, fecha_vencimiento, usuario_id, empresa_id,
            centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, iva, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando Modificando el Producto en el documento', 500, {documento_temporal: {item_id: 0}}));
            return;
        } else {

            var item_id = (rows.length > 0) ? rows[0].item_id : 0;

            res.send(G.utils.r(req.url, 'Producto modificado correctamente en el documento temporal', 200, {documento_temporal: {item_id: item_id}}));
            return;
        }
    });
};


function __validarParametrosDetalleTemporal(args) {


    if (args.documento_temporal === undefined || args.documento_temporal.doc_tmp_id === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.centro_utilidad_id === undefined || args.documento_temporal.bodega_id === undefined) {
        return {valido: false, msj: 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id No Estan Definidos'};
        // res.send(G.utils.r(req.url, 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id No Estan Definidos', 404, {}));
    }

    if (args.documento_temporal.codigo_producto === undefined || args.documento_temporal.cantidad_ingresada === undefined) {
        return {valido: false, msj: 'El código de producto o la cantidad ingresada no están definidas'};
    }

    if (args.documento_temporal.lote === undefined || args.documento_temporal.fecha_vencimiento === undefined) {
        return {valido: false, msj: 'El lote o la fecha de vencimiento no están definidas'};
    }

    if (args.documento_temporal.iva === undefined || args.documento_temporal.valor_unitario === undefined) {
        return {valido: false, msj: 'El IVA o El vlr Unitario no están definidas'};
    }



    if (args.documento_temporal.doc_tmp_id === '' || args.documento_temporal.empresa_id === '' || args.documento_temporal.centro_utilidad_id === '' || args.documento_temporal.bodega_id === '') {
        return {valido: false, msj: 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id estan vacios'};
    }

    if (args.documento_temporal.codigo_producto === '' || args.documento_temporal.cantidad_ingresada === '' || args.documento_temporal.cantidad_ingresada === 0) {
        return {valido: false, msj: 'El código de producto esta vacio o la cantidad ingresada es igual a 0'};
    }

    if (args.documento_temporal.lote === '' || args.documento_temporal.fecha_vencimiento === '') {
        return {valido: false, msj: 'El lote o la fecha de vencimiento están vacias'};
    }

    if (args.documento_temporal.iva === '' || args.documento_temporal.valor_unitario === '') {
        return {valido: false, msj: 'El IVA o El vlr Unitario están Vacíos'};
    }



    return  {valido: true, msj: ''};
}

// Consultar TODOS los documentos temporales de despacho clientes 
I002Controller.prototype.consultarDocumentosTemporalesClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.termino_busqueda === undefined || args.documento_temporal.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'El termino_busqueda o la pagina_actual no estan definidos', 404, {}));
        return;
    }
    if (args.documento_temporal.pagina_actual === '' || args.documento_temporal.pagina_actual <= 0) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual o que sea mayor a 0', 404, {}));
        return;
    }
    
    if (args.documento_temporal.empresa_id === undefined || args.documento_temporal.empresa_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }

    var empresa_id = args.documento_temporal.empresa_id;
    var termino_busqueda = args.documento_temporal.termino_busqueda;
    var pagina_actual = args.documento_temporal.pagina_actual;
    var filtro = args.documento_temporal.filtro;

    that.m_I002.consultar_documentos_temporales_clientes(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, documentos_temporales, total_records) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos temporales de clientes', 500, {documentos_temporales: {}}));
            return;
        } else {

            var i = documentos_temporales.length;

            documentos_temporales.forEach(function(documento) {

                that.m_pedidos_clientes.obtener_responsables_del_pedido(documento.numero_pedido, function(err, responsables) {
                    documento.responsables = responsables;
                    if (--i === 0) {
                        res.send(G.utils.r(req.url, 'Lista Documentos Temporales ', 200, {documentos_temporales: documentos_temporales}));

                    }
                });
            });

            if (documentos_temporales.length === 0)
                res.send(G.utils.r(req.url, 'Lista Documentos Temporales ', 200, {documentos_temporales: documentos_temporales}));
        }
    });
};

// Consultar TODOS los documentos temporales de despacho farmacias 
I002Controller.prototype.consultarDocumentosTemporalesFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.termino_busqueda === undefined || args.documento_temporal.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'El termino_busqueda, la empresa_id o la pagina_actual no estan definidos', 404, {}));
        return;
    }
    if (args.documento_temporal.empresa_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la empresa_id ', 404, {}));
        return;
    }

    if (args.documento_temporal.pagina_actual === '' || args.documento_temporal.pagina_actual <= 0) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual o que sea mayor a 0', 404, {}));
        return;
    }

    var empresa_id = args.documento_temporal.empresa_id;
    var termino_busqueda = args.documento_temporal.termino_busqueda;
    var pagina_actual = args.documento_temporal.pagina_actual;
    var filtro = args.documento_temporal.filtro;

    that.m_I002.consultar_documentos_temporales_farmacias(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, documentos_temporales, total_records) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos temporales de farmacias', 500, {documentos_temporales: {}}));
            return;
        } else {

            var i = documentos_temporales.length;

            documentos_temporales.forEach(function(documento) {

                that.m_pedidos_farmacias.obtener_responsables_del_pedido(documento.numero_pedido, function(err, responsables) {
                    documento.responsables = responsables;
                    if (--i === 0) {
                        res.send(G.utils.r(req.url, 'Lista Documentos Temporales ', 200, {documentos_temporales: documentos_temporales}));

                    }
                });
            });

            if (documentos_temporales.length === 0)
                res.send(G.utils.r(req.url, 'Lista Documentos Temporales ', 200, {documentos_temporales: documentos_temporales}));
        }
    });

};

// Consulta el Documento temporal de despacho CLIENTES por numero de pedido
I002Controller.prototype.consultarDocumentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no está definido', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero de pedido debe ser mayor a cero', 404, {}));
        return;
    }


    var numero_pedido = args.documento_temporal.numero_pedido;

    // Consultamos el documento temporal de despacho
    that.m_I002.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

        //Si genera error la consulta
        if (err) {
            res.send(G.utils.r(req.url, 'Error Consultado el Documento Temporal ', 500, {}));
            return;
        }

        // No Existe el Documento
        if (documento_temporal.length === 0) {
            res.send(G.utils.r(req.url, 'Información Documento Temporal Clientes ', 200, {documento_temporal: documento_temporal}));
            return;
        }

        var documento = documento_temporal[0];

        // Consultamos los productos del pedido.
        that.m_pedidos_clientes.consultar_detalle_pedido(documento.numero_pedido, function(err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                documento.lista_productos = detalle_documento_temporal;

                detalle_documento_temporal.forEach(function(detalle) {

                    var producto = productos_pedidos.filter(function(value) {
                        return detalle.codigo_producto === value.codigo_producto;
                    });

                    if (producto.length > 0) {
                        producto = producto[0];

                        detalle.cantidad_solicitada = producto.cantidad_solicitada;
                        detalle.cantidad_pendiente = producto.cantidad_solicitada - detalle.cantidad_ingresada;
                        detalle.justificacion = producto.justificacion;
                        detalle.justificacion_auditor = producto.justificacion_auditor;
                    }

                });

                res.send(G.utils.r(req.url, 'Información Documento Temporal Clientes ', 200, {documento_temporal: documento_temporal}));
            });
        });
    });
};

// Consulta el Documento temporal de despacho FARMACIAS por numero de pedido
I002Controller.prototype.consultarDocumentoTemporalFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;
    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no está definido', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero de pedido debe ser mayor a cero', 404, {}));
        return;
    }


    var numero_pedido = args.documento_temporal.numero_pedido;

    that.m_I002.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Consultado el Documento Temporal ', 500, {}));
            return;
        }

        // No Existe el Documento
        if (documento_temporal.length === 0) {
            res.send(G.utils.r(req.url, 'Información Documento Temporal Farmacias ', 200, {documento_temporal: documento_temporal}));
            return;
        }

        var documento = documento_temporal[0];

        // Consultamos los productos del pedido.
        that.m_pedidos_farmacias.consultar_detalle_pedido(documento.numero_pedido, function(err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                documento.lista_productos = detalle_documento_temporal;

                detalle_documento_temporal.forEach(function(detalle) {

                    var producto = productos_pedidos.filter(function(value) {
                        return detalle.codigo_producto === value.codigo_producto;
                    });

                    if (producto.length > 0) {
                        producto = producto[0];

                        detalle.cantidad_solicitada = producto.cantidad_solicitada;
                        detalle.cantidad_pendiente = producto.cantidad_solicitada - detalle.cantidad_ingresada;
                        detalle.justificacion = producto.justificacion;
                        detalle.justificacion_auditor = producto.justificacion_auditor;
                    }

                });

                res.send(G.utils.r(req.url, 'Información Documento Temporal Farmacias ', 200, {documento_temporal: documento_temporal}));
            });

        });
    });

};

// Eliminar Producto Documento Temporal CLIENTES / FARMACIAS
I002Controller.prototype.eliminarProductoDocumentoTemporal = function(req, res) {


    var that = this;

    var args = req.body.data;
    if (args.documento_temporal === undefined || args.documento_temporal.item_id === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.documento_temporal.item_id === '' || args.documento_temporal.item_id === "0") {
        res.send(G.utils.r(req.url, 'El item_id está vacio', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.documento_temporal_id === "0") {
        res.send(G.utils.r(req.url, 'El documento_temporal_id está vacio', 404, {}));
        return;
    }
    if (args.documento_temporal.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'El codigo_producto está vacio', 404, {}));
        return;
    }

    var item_id = args.documento_temporal.item_id;
    var doc_tmp_id = args.documento_temporal.documento_temporal_id;
    var usuario_id = (args.documento_temporal.usuario_id === undefined) ? req.session.user.usuario_id : args.documento_temporal.usuario_id;
    var codigo_producto = args.documento_temporal.codigo_producto;

    that.m_movimientos_bodegas.eliminar_producto_movimiento_bodega_temporal(item_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Producto del Documento Temporal Clientes', 500, {}));
            return;
        } else {

            that.m_I002.eliminar_justificaciones_temporales_producto(doc_tmp_id, usuario_id, codigo_producto, function(err, rows) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Eliminado la justificacon del Producto', 500, {}));
                    return;
                } else {
                    res.send(G.utils.r(req.url, 'Producto Eliminado Correctamente', 200, {}));
                    return;
                }
            });
        }
    });

};

// Eliminar un definitivamente un documento temporal de CLIENTES 
I002Controller.prototype.eliminarDocumentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;
    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido está vacio', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    that.m_I002.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Clientes.', 500, {}));
            return;
        } else {

            if (documento_temporal.length === 0) {
                res.send(G.utils.r(req.url, 'El Documento Temporal No Existe', 404, {}));
                return;
            }

            var documento = documento_temporal[0];

            var documento_temporal_id = documento.documento_temporal_id;
            var usuario_id = documento.usuario_id;

            that.m_I002.eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, function(err, rows) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Clientes', 500, {}));
                    return;
                } else {
                    that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                    res.send(G.utils.r(req.url, 'Documento Temporal Cliente Eliminado Correctamente', 200, {}));
                    return;
                }
            });
        }
    });
};

// Eliminar un definiticamente un documento temporal de FARMACIAS
I002Controller.prototype.eliminarDocumentoTemporalFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;
    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido está vacio', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    that.m_I002.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Farmacias.', 500, {}));
            return;
        } else {

            if (documento_temporal.length === 0) {
                res.send(G.utils.r(req.url, 'El Documento Temporal No Existe', 404, {}));
                return;
            }

            var documento = documento_temporal[0];

            var documento_temporal_id = documento.documento_temporal_id;
            var usuario_id = documento.usuario_id;

            that.m_I002.eliminar_documento_temporal_farmacias(documento_temporal_id, usuario_id, function(err, rows) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Farmacias', 500, {}));
                    return;
                } else {
                    that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                    res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Eliminado Correctamente', 200, {}));
                    return;
                }
            });
        }
    });

};

// Ingresar las justificaciones de los productos pendientes en el desapAcho de CLIENTES / FARMACIAS
I002Controller.prototype.justificacionPendientes = function(req, res) {
    var that = this;

    var args = req.body.data;
    if (args.documento_temporal === undefined || args.documento_temporal.doc_tmp_id === undefined || args.documento_temporal.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'El doc_tmp_id o codigo_producto no estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.cantidad_pendiente === undefined || args.documento_temporal.justificacion === undefined || args.documento_temporal.existencia === undefined || args.documento_temporal.justificacion_auditor === undefined) {
        res.send(G.utils.r(req.url, 'La cantidad_pendiente, justificacion, justificacion_auditor o existencia no estan definidos', 404, {}));
        return;
    }


    if (args.documento_temporal.doc_tmp_id === "" || args.documento_temporal.codigo_producto === "") {
        res.send(G.utils.r(req.url, 'El doc_tmp_id o codigo_producto estan vacíos', 404, {}));
        return;
    }

    if (args.documento_temporal.cantidad_pendiente === "" || args.documento_temporal.justificacion === "" || args.documento_temporal.existencia === "") {
        res.send(G.utils.r(req.url, 'La cantidad_pendiente, justificacion o existencia estan vacíos', 404, {}));
        return;
    }

    if (parseInt(args.documento_temporal.cantidad_pendiente) <= 0) {
        res.send(G.utils.r(req.url, 'La cantidad_pendiente debe ser mayor a cero', 404, {}));
        return;
    }

    var doc_tmp_id = args.documento_temporal.doc_tmp_id;
    var codigo_producto = args.documento_temporal.codigo_producto;
    var cantidad_pendiente = args.documento_temporal.cantidad_pendiente;
    var justificacion = args.documento_temporal.justificacion;
    var justificacion_auditor = args.documento_temporal.justificacion_auditor;
    var existencia = args.documento_temporal.existencia;
    var usuario_id = req.session.user.usuario_id;

    that.m_I002.gestionar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error ingresando la justificación', 500, {documento_temporal: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Justificacion Ingresada Correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });
};

// Actualizar bodegas_doc_id en documento temporal Clientes.
I002Controller.prototype.actualizarTipoDocumentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined || args.documento_temporal.bodegas_doc_id === undefined) {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id NO estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido NO esta definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '' || args.documento_temporal.bodegas_doc_id === '') {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id estan vacíos', 404, {}));
        return;
    }
    if (args.documento_temporal.numero_pedido <= 0 || args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido esta vacio o debe ser mayor a cero', 404, {}));
        return;
    }


    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var responsable_id = args.documento_temporal.usuario_id;
    var bodegas_doc_id = args.documento_temporal.bodegas_doc_id;

    var numero_pedido = args.documento_temporal.numero_pedido;
    var usuario_id = req.session.user.usuario_id;
    var auditor = 0;
    var estado = '2';
    var estado_pedido = '7'; //En auditora

    that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        var existe_estado_auditoria = false;
        var _responsables = [];


        for (var i in responsables) {
            var responsable = responsables[i];

            if (responsable.estado === '7' && responsable.sw_terminado === '0') {
                existe_estado_auditoria = true;
            }

            if (responsable.usuario_id_responsable === usuario_id && responsable.estado === '7' && responsable.sw_terminado === '0') {
                _responsables.push(responsable);
            }
        }

        //deja asignar el documento al auditor siempre y cuando sea el mismo o no exista auditor
        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {
            that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {

                if (err || operario.length === 0) {
                    res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
                    return;
                } else {

                    operario = operario[0];

                    auditor = operario.operario_id;

                    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, responsable_id, bodegas_doc_id, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {
                            // Actualizar estado documento temporal a "En Auditoria"
                            that.m_I002.actualizar_estado_documento_temporal_clientes(numero_pedido, estado, function(err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                                    return;
                                } else {
                                    // Actualizar Estado Pedido. a "En Auditoria"
                                    that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function(_err, _rows, responsable_estado_pedido) {

                                        // Emitir Evento de Actualizacion de Pedido.
                                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                        // Emitir evento para actualizar la lista de Documentos Temporales
                                        that.e_I002.onNotificarDocumentosTemporalesClientes({numero_pedido: numero_pedido});

                                        res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
                                    });
                                }
                            });
                        }
                    });

                }
            });
        } else {
            res.send(G.utils.r(req.url, 'El pedido esta siendo auditado', 500, {movimientos_bodegas: {}}));
            return;
        }


    });
    // Buscar el id del auditor

};

//validar auditor
// Actualizar bodegas_doc_id en documento temporal farmacias.
I002Controller.prototype.actualizarTipoDocumentoTemporalFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined || args.documento_temporal.bodegas_doc_id === undefined) {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id NO estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido NO esta definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '' || args.documento_temporal.bodegas_doc_id === '') {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id estan vacíos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido <= 0 || args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido esta vacio o debe ser mayor a cero', 404, {}));
        return;
    }

    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var responsable_id = args.documento_temporal.usuario_id;
    var bodegas_doc_id = args.documento_temporal.bodegas_doc_id;

    var numero_pedido = args.documento_temporal.numero_pedido;
    var usuario_id = req.session.user.usuario_id;
    var auditor = 0;
    var estado = '2';
    var estado_pedido = '7'; // En auditoria

    //seleccionar el auditor
    that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        //valida que sea el usuario que creo el pedido
        var existe_estado_auditoria = false;
        var _responsables = [];


        for (var i in responsables) {
            var responsable = responsables[i];

            if (responsable.estado === '7' && responsable.sw_terminado === '0') {
                existe_estado_auditoria = true;
            }

            if (responsable.usuario_id_responsable === usuario_id && responsable.estado === '7' && responsable.sw_terminado === '0') {
                _responsables.push(responsable);
            }
        }



        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {
            that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {

                if (err || operario.length === 0) {
                    res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
                    return;
                } else {

                    operario = operario[0];

                    auditor = operario.operario_id;

                    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, responsable_id, bodegas_doc_id, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {

                            // Actualizar estado documento a "En Auditoria"
                            that.m_I002.actualizar_estado_documento_temporal_farmacias(numero_pedido, estado, function(err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                                    return;
                                } else {
                                    // Actualizar Estado Pedido. a "En Auditoria"
                                    that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function(_err, _rows, responsable_estado_pedido) {

                                        // Emitir Evento de Actualizacion de Pedido.
                                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                        // Emitir evento para actualizar la lista de Documentos Temporales
                                        that.e_I002.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

                                        res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
                                    });
                                }

                            });
                        }
                    });

                }
            });
        } else {
            res.send(G.utils.r(req.url, 'El pedido esta siendo auditado', 500, {movimientos_bodegas: {}}));
            return;
        }

    });




};

// Consultar productos Auditados
I002Controller.prototype.consultarProductosAuditados = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined) {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id  NO estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '') {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id estan vacíos', 404, {}));
        return;
    }

    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var usuario_id = args.documento_temporal.usuario_id;
    var lista_productos = [];

    that.m_movimientos_bodegas.consultar_productos_auditados(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los productos auditados', 500, {movimientos_bodegas: {}}));
            return;
        } else {
        
            res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: detalle_documento_temporal}}));
        }
    });

};

I002Controller.prototype.buscarItemsTemporal = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined ||
            args.documento_temporal.usuario_id === undefined || args.documento_temporal.filtro === undefined) {

        res.send(G.utils.r(req.url, 'documento, usuario_id o filtro No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '') {
        res.send(G.utils.r(req.url, 'documento_temporal_id O  usuario_id  estan vacios', 404, {}));
        return;
    }

    var filtro = args.documento_temporal.filtro;
    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var usuario_id = args.documento_temporal.usuario_id;

    that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento_temporal_id, usuario_id, filtro, function(err,
            detalle_documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
            return;
        }

        res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: detalle_documento_temporal}}));

    });
};

// Buscar productos para auditar de Clientes 
I002Controller.prototype.auditoriaProductosClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.filtro === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o filtro No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.filtro.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido esta vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.filtro.termino_busqueda === '') {
        res.send(G.utils.r(req.url, 'termino_busqueda esta vacio', 404, {}));
        return;
    }


    var numero_pedido = args.documento_temporal.numero_pedido;
    var filtro = args.documento_temporal.filtro;
    var termino_busqueda = args.documento_temporal.filtro.termino_busqueda;

    var lista_productos = [];

    // Consultamos el documento temporal de despacho
    that.m_I002.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

        //Si genera error la consulta
        if (err) {
            res.send(G.utils.r(req.url, 'Error Consultado el Documento Temporal ', 500, {}));
            return;
        }

        // No Existe el Documento
        if (documento_temporal.length === 0) {
            res.send(G.utils.r(req.url, 'Información Documento Temporal Clientes ', 200, {documento_temporal: documento_temporal}));
            return;
        }

        var documento = documento_temporal[0];

        // Consultamos los productos del pedido.
        that.m_pedidos_clientes.consultar_detalle_pedido(documento.numero_pedido, function(err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento.documento_temporal_id, documento.usuario_id, filtro, function(err, detalle_documento_temporal) {

                console.log("consultar_detalle_movimiento_bodega_temporal_por_termino");
                console.log(detalle_documento_temporal);
                // res.send(G.utils.r(req.url, 'Listado productos auditados', 500, {movimientos_bodegas: {}}));
                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                var count = detalle_documento_temporal.length;

                //se unifica el detalle
                productos_pedidos = that.m_pedidos.unificarLotesDetalle(productos_pedidos);

                detalle_documento_temporal.forEach(function(detalle) {

                    // Consultar las justificaciones del producto
                    that.m_I002.consultar_justificaciones_temporales_pendientes(documento.documento_temporal_id, documento.usuario_id, detalle.codigo_producto, function(err, justificaciones) {

                        detalle.justificaciones = justificaciones;

                        var producto = productos_pedidos.filter(function(value) {
                            return detalle.codigo_producto === value.codigo_producto;
                        });

                        if (producto.length > 0) {
                            producto = producto[0];
                            detalle.cantidad_solicitada = producto.cantidad_solicitada;
                            detalle.cantidad_pendiente = producto.cantidad_pendiente;
                            //detalle.cantidad_pendiente = producto.cantidad_solicitada - detalle.cantidad_ingresada;
                            detalle.cantidad_ingresada = producto.cantidad_ingresada;
                            //detalle.justificacion = producto.justificacion;
                            //detalle.justificacion_auditor = producto.justificacion_auditor;
                        }

                        lista_productos.push(detalle);

                        if (--count === 0) {
                            console.log(lista_productos);
                            res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
                        }

                    });
                });

                if (detalle_documento_temporal.length === 0)
                    res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
            });
        });
    });
};

// Buscar productos para auditar de Farmacias 
I002Controller.prototype.auditoriaProductosFarmacias = function(req, res) {   

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.filtro === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o filtro No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.filtro.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido esta vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.filtro.termino_busqueda === '') {
        res.send(G.utils.r(req.url, 'termino_busqueda esta vacio', 404, {}));
        return;
    }


    var numero_pedido = args.documento_temporal.numero_pedido;
    var filtro = args.documento_temporal.filtro;
    var termino_busqueda = args.documento_temporal.filtro.termino_busqueda;

    var lista_productos = [];

    // Consultamos el documento temporal de despacho
    that.m_I002.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

        //Si genera error la consulta
        if (err) {
            res.send(G.utils.r(req.url, 'Error Consultado el Documento Temporal ', 500, {}));
            return;
        }

        // No Existe el Documento
        if (documento_temporal.length === 0) {
            res.send(G.utils.r(req.url, 'El Documento Temporal no existe', 200, {documento_temporal: documento_temporal}));
            return;
        }

        var documento = documento_temporal[0];

        // Consultamos los productos del pedido.
        that.m_pedidos_farmacias.consultar_detalle_pedido(documento.numero_pedido, function(err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento.documento_temporal_id, documento.usuario_id, filtro, function(err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                var count = detalle_documento_temporal.length;

                productos_pedidos = that.m_pedidos.unificarLotesDetalle(productos_pedidos);
                
                //console.log("productos_ pedidos ", productos_pedidos);
                //return;

                detalle_documento_temporal.forEach(function(detalle) {

                    // Consultar las justificaciones del producto
                    that.m_I002.consultar_justificaciones_temporales_pendientes(documento.documento_temporal_id, documento.usuario_id, detalle.codigo_producto, function(err, justificaciones) {

                        detalle.justificaciones = justificaciones;

                        var producto = productos_pedidos.filter(function(value) {
                            return detalle.codigo_producto === value.codigo_producto;
                        });

                        if (producto.length > 0) {
                            producto = producto[0];
                            detalle.cantidad_solicitada = producto.cantidad_solicitada;
                            detalle.cantidad_pendiente = producto.cantidad_pendiente;
                           // detalle.cantidad_pendiente = producto.cantidad_solicitada - detalle.cantidad_ingresada;
                            detalle.cantidad_ingresada = producto.cantidad_ingresada;
                            //detalle.justificacion = producto.justificacion;
                            //detalle.justificacion_auditor = producto.justificacion_auditor;
                        }

                        lista_productos.push(detalle);

                        if (--count === 0) {
                            console.log(lista_productos);
                            res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
                        }
                    });
                });

                if (detalle_documento_temporal.length === 0)
                    res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
            });
        });
    });
};

I002Controller.prototype.imprimirRotuloClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined 
        || args.documento_temporal.numero_caja === undefined ||  args.documento_temporal.tipo === undefined) {
        res.send(G.utils.r(req.url, 'Documento temporal, numero_pedido, numero caja o tipo  No Estan Definidos', 404, {}));
        return;
    }
    
    var pedido = args.documento_temporal.numero_pedido;
    var numero = args.documento_temporal.numero_caja;
    var tipo   = args.documento_temporal.tipo;


    that.m_pedidos_clientes.obtenerDetalleRotulo(pedido, numero, tipo, function(e, rows) {



        if (e) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }

        if (rows.length === 0) {
            res.send(G.utils.r(req.url, 'No se encontro la caja para el pedido', 404, {}));
            return;
        }
        
        var obj = {
            detalle : rows[0],
            serverUrl : req.protocol + '://' + req.get('host')+ "/"
        };

        _generarDocumentoRotulo(obj, function(nombreTmp) {
            res.send(G.utils.r(req.url, 'Url reporte rotulo', 200, {movimientos_bodegas: {nombre_reporte: nombreTmp}}));
        });
    });

};

I002Controller.prototype.imprimirRotuloFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined 
        || args.documento_temporal.numero_caja === undefined ||  args.documento_temporal.tipo === undefined) {
        res.send(G.utils.r(req.url, 'Documento temporal, numero_pedido, numero caja o tipo  No Estan Definidos', 404, {}));
        return;
    }
    
    var pedido = args.documento_temporal.numero_pedido;
    var numero = args.documento_temporal.numero_caja;
    var tipo   = args.documento_temporal.tipo;


    that.m_pedidos_farmacias.obtenerDetalleRotulo(pedido, numero, tipo, function(e, rows) {



        if (e) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }

        if (rows.length === 0) {
            res.send(G.utils.r(req.url, 'No se encontro la caja para el pedido', 404, {}));
            return;
        }
        
        var obj = {
            detalle : rows[0],
            serverUrl : req.protocol + '://' + req.get('host')+ "/"
        };
        
        _generarDocumentoRotulo(obj, function(nombreTmp) {
            res.send(G.utils.r(req.url, 'Url reporte rotulo', 200, {movimientos_bodegas: {nombre_reporte: nombreTmp}}));
        });

    });

};

function _generarDocumentoRotulo(obj, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/I002/reports/rotulos.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I002/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: obj
    },function(err, response) {
        
        response.body(function(body) {
           var fecha = new Date();
           var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });
                
            
        });
        
        
        
    });
}

// Generar Documento Despacho Clientes
I002Controller.prototype.generarDocumentoDespachoClientes = function(req, res) {


    // Verificar Pendientes
    // Ingresar Justificacion
    // Verificar Rotulos

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.documento_temporal_id === undefined
            || args.documento_temporal.usuario_id === undefined) {

        res.send(G.utils.r(req.url, 'documento_temporal_id,  usuario_id o numero_pedido No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '') {
        res.send(G.utils.r(req.url, 'documento_temporal_id,  usuario_id o numero_pedido estan vacios', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var usuario_id = args.documento_temporal.usuario_id;
    var auditor_id = args.documento_temporal.auditor_id;


    that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        var existe_estado_auditoria = false;
        var _responsables = [];

        for (var i in responsables) {
            var responsable = responsables[i];

            if (responsable.estado === '7' && responsable.sw_terminado === '0') {
                existe_estado_auditoria = true;
            }

            if (responsable.usuario_id_responsable === req.session.user.usuario_id && responsable.estado === '7' && responsable.sw_terminado === '0') {
                _responsables.push(responsable);
            }
        }

        //deja asignar el documento al auditor siempre y cuando sea el mismo o no exista auditor
        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {

            that.m_terceros.seleccionar_operario_por_usuario_id(req.session.user.usuario_id, function(err, operario) {

                if (operario.length === 0) {
                    res.send(G.utils.r(req.url, 'El usuario no esta registrado como operario', 500, {movimientos_bodegas: {}}));
                    return;
                }

                auditor_id = operario[0].operario_id;

                __validar_productos_pedidos_clientes(that, numero_pedido, documento_temporal_id, usuario_id, function(err, productos_no_auditados, productos_pendientes) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                        return;
                    } else {
                        if (productos_no_auditados.length > 0 || productos_pendientes.length > 0) {

                            res.send(G.utils.r(req.url, 'Algunos productos no ha sido auditados o tienen pendientes la justificacion', 404, {movimientos_bodegas: {productos_no_auditados: productos_no_auditados, productos_pendientes: productos_pendientes}}));
                            return;
                        }

                        __validar_rotulos_cajas(that, documento_temporal_id, usuario_id, numero_pedido, function(err, cajas_no_cerradas) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                return;
                            } else {

                                if (cajas_no_cerradas.length > 0) {
                                    res.send(G.utils.r(req.url, 'Algunas cajas no se han cerrado', 404, {movimientos_bodegas: {cajas_no_cerradas: cajas_no_cerradas}}));
                                    return;
                                }

                                that.m_I002.generar_documento_despacho_clientes(documento_temporal_id, numero_pedido, usuario_id, auditor_id, function(err, empresa_id, prefijo_documento, numero_documento) {

                                    if (err) {
                                        res.send(G.utils.r(req.url, err.toString(), 500, {movimientos_bodegas: {}}));
                                        return;
                                    }

                                    that.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                                        if (err) {
                                            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                            return;
                                        }

                                        var cantidad_pendiente = 0;

                                        //temporalmente el pedido queda con estados despachado o despachado con pendientes al terminar de auditar
                                        var estado = "2";

                                        detalle_pedido.forEach(function(producto_pedido) {

                                            cantidad_pendiente += producto_pedido.cantidad_pendiente;

                                        });

                                        if (cantidad_pendiente > 0) {
                                            estado = "8"; 
                                        }


                                        if (err) {
                                            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                            return;
                                        }


                                        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado, auditor_id, req.session.user.usuario_id, function(err, rows) {

                                            that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, [estado, '7'], '1', function(err, rows) {
                                                that.m_I002.marcar_cajas_como_despachadas(documento_temporal_id, numero_pedido, function(err, rows) {

                                                    if (err) {
                                                        console.log("========================================== generar documento despacho clientes error generado ============================");
                                                        console.log(err);
                                                        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                                        return;
                                                    } else {
                                                        console.log("========================================== generar documento despacho clientes satisfactorio ============================");
                                                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                                                        res.send(G.utils.r(req.url, 'Se ha generado el documento', 200, {movimientos_bodegas: {prefijo_documento: prefijo_documento, numero_documento: numero_documento, empresa_id: empresa_id}}));

                                                    }
                                                });
                                            });
                                        });

                                    });


                                });
                            }
                        });
                    }
                });
            });
        } else {
            res.send(G.utils.r(req.url, 'El pedido esta siendo auditado', 403, {movimientos_bodegas: {}}));
            return;
        }

    });


};

// Generar Documento Despacho Farmacias
I002Controller.prototype.generarDocumentoDespachoFarmacias = function(req, res) {
    // Verificar Pendientes
    // Ingresar Justificacion
    // Verificar Rotulos

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.documento_temporal_id === undefined
            || args.documento_temporal.usuario_id === undefined) {

        res.send(G.utils.r(req.url, 'documento_temporal_id,  usuario_id o numero_pedido No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.usuario_id === '') {
        res.send(G.utils.r(req.url, 'documento_temporal_id,  usuario_id o numero_pedido estan vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.usuario_id === 0) {
        res.send(G.utils.r(req.url, 'usuario_id  esta vacio', 404, {}));
        return;
    }

    var numero_pedido = args.documento_temporal.numero_pedido;
    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var usuario_id = args.documento_temporal.usuario_id;
    var auditor_id = args.documento_temporal.auditor_id;


    that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        var existe_estado_auditoria = false;
        var _responsables = [];


        for (var i in responsables) {
            var responsable = responsables[i];

            if (responsable.estado === '7' && responsable.sw_terminado === '0') {
                existe_estado_auditoria = true;
            }

            if (responsable.usuario_id_responsable === req.session.user.usuario_id && responsable.estado === '7' && responsable.sw_terminado === '0') {
                _responsables.push(responsable);
            }
        }

        //deja asignar el documento al auditor siempre y cuando sea el mismo o no exista auditor
        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {
            that.m_terceros.seleccionar_operario_por_usuario_id(req.session.user.usuario_id, function(err, operario) {

                if (operario.length === 0) {
                    console.log("usuario operario ==============================================", operario, auditor_id);
                    res.send(G.utils.r(req.url, 'El usuario no esta registrado como operario', 500, {movimientos_bodegas: {}}));
                    return;
                }

                auditor_id = operario[0].operario_id;

                __validar_productos_pedidos_farmacias(that, numero_pedido, documento_temporal_id, usuario_id, function(err, productos_no_auditados, productos_pendientes) {


                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                        return;
                    } else {
                        if (productos_no_auditados.length > 0 || productos_pendientes.length > 0) {

                            res.send(G.utils.r(req.url, 'Algunos productos no ha sido auditados o tienen pendientes la justificacion', 404,
                                    {movimientos_bodegas: {productos_no_auditados: productos_no_auditados, productos_pendientes: productos_pendientes}}));
                            return;
                        }
                    }

                    __validar_rotulos_cajas(that, documento_temporal_id, usuario_id, numero_pedido, function(err, cajas_no_cerradas) {

                        if (err) {
                            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {

                            if (cajas_no_cerradas.length > 0) {
                                res.send(G.utils.r(req.url, 'Algunas cajas no se han cerrado', 404, {movimientos_bodegas: {cajas_no_cerradas: cajas_no_cerradas}}));
                                return;
                            }


                            that.m_I002.generar_documento_despacho_farmacias(documento_temporal_id, numero_pedido, usuario_id, auditor_id,
                             function(err, empresa_id, prefijo_documento, numero_documento) {

                                if (err) {
                                    console.log("error cambiando estado del pedido ", err);
                                    res.send(G.utils.r(req.url, err.toString(), 500, {movimientos_bodegas: {}}));
                                    return;
                                }
                                that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                                    if (err) {
                                        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                        return;
                                    }

                                    var cantidad_pendiente = 0;

                                    //temporalmente el pedido queda con estados despachado o despachado con pendientes al terminar de auditar
                                    var estado = "2";

                                    detalle_pedido.forEach(function(producto_pedido) {

                                        cantidad_pendiente += producto_pedido.cantidad_pendiente_real;

                                    });

                                    if (cantidad_pendiente > 0) {
                                        estado = "8";
                                    }


                                    if (err) {
                                        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                        return;
                                    }


                                    that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado, auditor_id,
                                            req.session.user.usuario_id, function(err, rows) {

                                        that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, [estado, '7'], '1', function(err, rows) {
                                            that.m_I002.marcar_cajas_como_despachadas(documento_temporal_id, numero_pedido, function(err, rows) {
                                                if (err) {
                                                    console.log("========================================== generar documento despacho clientes error generado ============================");
                                                    console.log(err);
                                                    res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                                                    return;
                                                } else {
                                                    console.log("========================================== generar documento despacho clientes satisfactorio ============================");
                                                    that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                                                    res.send(G.utils.r(req.url, 'Se ha generado el documento', 200, {movimientos_bodegas: {prefijo_documento: prefijo_documento, numero_documento: numero_documento, empresa_id: empresa_id}}));
                                                }
                                            });


                                        });


                                    });

                                });


                            });
                        }
                    });
                });
            });
        } else {
            res.send(G.utils.r(req.url, 'El usuario pedido esta siendo auditado', 403, {movimientos_bodegas: {}}));
            return;
        }

    });







};

// Validar que la caja este abierta
I002Controller.prototype.validarCajaProducto = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined ||
        args.documento_temporal.numero_caja === undefined || args.documento_temporal.tipo === undefined) {
        res.send(G.utils.r(req.url, 'documento_temporal_id, numero_caja o tipo no estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === undefined || args.documento_temporal.nombre_cliente === undefined || args.documento_temporal.direccion_cliente === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido,cliente o direccion no estan definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.numero_caja === '' || args.documento_temporal.numero_caja === '0') {
    
        res.send(G.utils.r(req.url, 'documento_temporal_id o numero_caja estan vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.nombre_cliente === '' || args.documento_temporal.direccion_cliente === '') {
        res.send(G.utils.r(req.url, 'documento_temporal_id o numero_caja estan vacios', 404, {}));
        return;
    }

    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var numero_caja = args.documento_temporal.numero_caja;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var nombre_cliente = args.documento_temporal.nombre_cliente;
    var direccion_cliente = args.documento_temporal.direccion_cliente;
    var cantidad = 0;
    var ruta = "";
    var contenido = "";
    var usuario_id = req.session.user.usuario_id;
    var tipo = args.documento_temporal.tipo;

    that.m_I002.consultarNumeroMayorRotulo(documento_temporal_id, numero_pedido, tipo, function(err, rotuloMayor){
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }
        
        var numeroSiguiente = parseInt(rotuloMayor[0].numero_caja) + 1;
        
        if(numeroSiguiente < numero_caja){
            res.send(G.utils.r(req.url, 'El número debe ser consecutivo, el número siguiente debe ser '+numeroSiguiente, 403, {movimientos_bodegas: {caja_valida: false}}));
            return;
        }
        
        that.m_I002.consultar_rotulo_caja(documento_temporal_id, numero_caja, numero_pedido, function(err, rotulos_cajas) {
            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                return;
            } else {
                var rotulo_caja;

                //obtener la caja por el tipo 0 = caja, 1= nevera
                for(var i in rotulos_cajas){
                    var _rotulo = rotulos_cajas[i];

                   // console.log("buscando en caja ", _rotulo.numero_caja, " tipo ", _rotulo.tipo, " con tipo ", tipo );
                    if(parseInt(_rotulo.tipo) === tipo){
                        rotulo_caja = _rotulo;
                        break;
                    }
                }

                if (rotulo_caja) {

                    res.send(G.utils.r(req.url, 'Validacion caja producto', 200, {movimientos_bodegas: {caja_valida: (rotulo_caja.caja_cerrada === '0') ? true : false}}));
                    return;
                } else {
                    // Crear
                    that.m_I002.generar_rotulo_caja(documento_temporal_id, numero_pedido, nombre_cliente, direccion_cliente, cantidad, ruta, contenido, numero_caja, usuario_id,tipo, function(err, rotulo_caja) {
                        if (err) {
                            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {
                            res.send(G.utils.r(req.url, 'Rotulo generado correctamente', 200, {movimientos_bodegas: {caja_valida: true}}));
                            return;
                        }
                    });
                }
            }
        });
    });
    
};

// Generar rotulos caja
I002Controller.prototype.generarRotuloCaja = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined 
        || args.documento_temporal.numero_caja === undefined || args.documento_temporal.tipo === undefined) {
        res.send(G.utils.r(req.url, 'documento_temporal_id, numero_caja o tipo no estan definidos', 404, {}));
        return;
    }



    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.numero_caja === '' || args.documento_temporal.numero_caja === '0') {
        res.send(G.utils.r(req.url, 'documento_temporal_id o numero_caja estan vacios', 404, {}));
        return;
    }


    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var numero_caja = args.documento_temporal.numero_caja;
    var tipo = args.documento_temporal.tipo;
    

    that.m_I002.cerrar_caja(documento_temporal_id, numero_caja, tipo, function(err, rows, result) {
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error cerrando la caja', 500, {documento_temporal: {}}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Caja cerrada correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });


};

I002Controller.prototype.actualizarCajaDeTemporales = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.temporales === undefined 
            || args.documento_temporal.numero_caja === undefined || args.documento_temporal.tipo === undefined) {
        res.send(G.utils.r(req.url, 'documento_temporal, temporales, numero_caja o tipo no estan definidos', 404, {}));
        return;
    }

    var temporales = args.documento_temporal.temporales;
    var numero_caja = args.documento_temporal.numero_caja;
    var tipo = args.documento_temporal.tipo;
    var i = temporales.length;

    temporales.forEach(function(temporal) {

        that.m_I002.actualizarCajaDeTemporal(temporal, numero_caja, tipo, function(err, rows, result) {

            if (err || result.rowCount === 0) {
                res.send(G.utils.r(req.url, 'Error actualizand  la caja', 500, {documento_temporal: {}}));
                return;
            } else {

                if (--i === 0) {
                    res.send(G.utils.r(req.url, 'Cajas asignadas correctamente', 200, {documento_temporal: {}}));
                    return;
                }
            }
        });
    });

};


I002Controller.prototype.imprimirDocumentoDespacho = function(req, res) {

    var that = this;
    var args = req.body.data;


    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.numero === undefined || args.movimientos_bodegas.prefijo === undefined
            || args.movimientos_bodegas.empresa === undefined) {

        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.numero === "" || args.movimientos_bodegas.prefijo === "" || args.movimientos_bodegas.empresa === "") {
        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan vacios', 404, {}));
        return;
    }

    var numero = args.movimientos_bodegas.numero;
    var prefijo = args.movimientos_bodegas.prefijo;
    var empresa = args.movimientos_bodegas.empresa;
    var datos_documento = {};

    that.m_I002.consultar_documento_despacho(numero, prefijo, empresa, req.session.user.usuario_id, function(err, rows) {

        if (err || rows.length === 0) {

            res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
            return;
        }
        datos_documento.encabezado = rows[0];

        that.m_movimientos_bodegas.consultar_detalle_documento_despacho(numero, prefijo, empresa, function(err, rows) {
            if (err) {
                res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                return;
            }

            datos_documento.detalle = rows;
            that.m_movimientos_bodegas.consultar_datos_adicionales_documento(numero, prefijo, empresa, datos_documento.encabezado.tipo_doc_bodega_id, function(err, rows) {
                if (err || rows.length === 0) {
                    res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                    return;
                }

                datos_documento.adicionales = that.m_movimientos_bodegas.darFormatoTituloAdicionesDocumento(rows[0]);
                datos_documento.serverUrl = req.protocol + '://' + req.get('host')+ "/";

                __generarPdfDespacho(datos_documento, function(nombre_pdf) {
                    console.log("nombre generado ", nombre_pdf);
                    res.send(G.utils.r(req.url, 'Documento Generado Correctamete', 200, {movimientos_bodegas: {nombre_pdf: nombre_pdf}}));
                });

            });


        });

    });

};

// Valida que los productos con pendientes esten justificados
// igualmente para los auditados
function __validar_productos_pedidos_clientes(contexto, numero_pedido, documento_temporal_id, usuario_id, callback) {

    var that = contexto;

    // Consultar Detalle del Pedido
    that.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {
        if (err) {
            callback(err);
            return;
        } else {

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    callback(err);
                    return;
                } else {

                    var productos_pendientes = [];
                    var productos_no_auditados = [];




                    detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);

                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", detalle_pedido);


                    detalle_pedido.forEach(function(producto_pedido) {

                        //validar que la cantidad pendiente sea mayor a cero en ventas_ordenes_pedidos_d
                        if (producto_pedido.cantidad_pendiente_real > 0) {
                            // Producto seleccionado por el operario de bodega
                            var producto_separado = detalle_documento_temporal.filter(function(value) {
                                return producto_pedido.codigo_producto === value.codigo_producto && value.auditado === '1';
                            });

                            console.log("producto separarod   >>>>>>>>>>>>>>>>", documento_temporal_id, usuario_id, detalle_documento_temporal, producto_pedido);
                            var cantidad_pendiente = producto_pedido.cantidad_pendiente;

                            if (producto_separado.length === 0) {
                                // Producto que no fue separado y le falta la justificacion del auditor
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {
                                    productos_pendientes.push(producto_pedido);
                                    //productos_pendientes = __agregarProducto(producto_pedido, productos_pendientes);
                                } else if (producto_pedido.item_id > 0) {
                                    productos_no_auditados.push(producto_pedido);
                                    //productos_no_auditados = __agregarProducto(producto_pedido, productos_no_auditados);
                                }
                            } else {

                                // Verificar que los productos con pendientes esten justificados po el auditor/
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {

                                    productos_pendientes.push(producto_pedido);

                                } else if (producto_pedido.auditado === '0') {
                                    productos_no_auditados.push(producto_pedido);

                                }
                            }
                        }

                    });

                    callback(err, productos_no_auditados, productos_pendientes);
                    return;
                }
            });
        }
    });
}
;


function __validar_productos_pedidos_farmacias(contexto, numero_pedido, documento_temporal_id, usuario_id, callback) {

    var that = contexto;

    // Consultar Detalle del Pedido
    that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {
        if (err) {
            callback(err);
            return;
        } else {

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    callback(err);
                    return;
                } else {

                    var productos_pendientes = [];
                    var productos_no_auditados = [];




                    detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);

                    detalle_pedido.forEach(function(producto_pedido) {

                        //validar que la cantidad pendiente sea mayor a cero en ventas_ordenes_pedidos_d
                        if (producto_pedido.cantidad_pendiente_real > 0) {
                            // Producto seleccionado por el operario de bodega
                            var producto_separado = detalle_documento_temporal.filter(function(value) {
                                return producto_pedido.codigo_producto === value.codigo_producto && value.auditado === '1';
                            });


                            // var cantidad_pendiente = _obtenerCantidadPendiente(detalle_pedido,producto_pedido);
                            var cantidad_pendiente = producto_pedido.cantidad_pendiente;

                            if (producto_separado.length === 0) {
                                // Producto que no fue separado y le falta la justificacion del auditor
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {
                                    productos_pendientes.push(producto_pedido);
                                } else if (producto_pedido.item_id > 0) {
                                    productos_no_auditados.push(producto_pedido);

                                }
                            } else {
                                console.log("producto para evaluar ", producto_pedido)
                                // Verificar que los productos con pendientes esten justificados po el auditor/
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {
                                    productos_pendientes.push(producto_pedido);

                                } else if (producto_pedido.auditado === '0') {
                                    productos_no_auditados.push(producto_pedido);

                                }
                            }
                        }
                    });

                    callback(err, productos_no_auditados, productos_pendientes);
                    return;
                }
            });
        }
    });
}
;

function __validar_rotulos_cajas(that, documento_temporal_id, usuario_id, numero_pedido, callback) {


    that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

        if (err) {
            callback(err);
            return;
        } else {
            var cajas_no_cerradas = [];

            var i = detalle_documento_temporal.length;

            detalle_documento_temporal.forEach(function(detalle) {

                that.m_I002.consultar_rotulo_caja(documento_temporal_id, detalle.numero_caja, numero_pedido, function(err, caja_producto) {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        caja_producto.forEach(function(caja) {
                            if (caja.caja_cerrada === '0') {
                                var agregada = false;
                                //valida que la caja no este agregada por otro item
                                for (var i in cajas_no_cerradas) {
                                    var caja_no_cerrada = cajas_no_cerradas[i];

                                    if (caja.numero_caja === caja_no_cerrada.numero_caja && caja.tipo === caja_no_cerrada.tipo) {
                                        agregada = true;
                                        break;
                                    }
                                }
                                if (!agregada)
                                    cajas_no_cerradas.push(caja);
                            }
                        });

                        if (--i === 0) {
                            callback(err, cajas_no_cerradas);
                        }
                    }
                });
            });
        }
    });
}



//Validar que el usuario que crea el documento temporal, sea el mismo responsable del pedido clientes
function __validar_responsable_pedidos_clientes(contexto, numero_pedido, responsable_pedido, estado_pedido, callback) {


    var that = contexto;
    var continuar = false;


    that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        if (err) {
            callback(err, continuar);
        } else {

            var responsable = responsables.filter(function(responsable) {
                return responsable.usuario_id_responsable === parseInt(responsable_pedido) && responsable.estado === estado_pedido && responsable.sw_terminado === '0';
            });

            if (responsable.length > 0) {

                continuar = true;
                callback(err, continuar);

            } else {
                callback(err, continuar);
            }
        }
    });
}

//Validar que el usuario que crea el documento temporal, sea el mismo responsable del pedido farmacias
function __validar_responsable_pedidos_farmacias(contexto, numero_pedido, responsable_pedido, estado_pedido, callback) {


    var that = contexto;
    var continuar = false;

    that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function(err, responsables) {

        if (err) {
            callback(err, continuar);
        } else {

            var responsable = responsables.filter(function(data) {

                return data.usuario_id_responsable === parseInt(responsable_pedido) && data.estado === estado_pedido && data.sw_terminado === '0';
            });

            if (responsable.length > 0) {

                continuar = true;
                callback(err, continuar);

            } else {
                callback(err, continuar);
            }
        }
    });
}

function __generarPdfDespacho(datos, callback) {  

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/I002/reports/despacho.html', 'utf8'),
            recipe: "phantom-pdf",
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
           var nombreTmp = datos.encabezado.prefijo + "-" + datos.encabezado.numero + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });
                
            
        });
    });
}
*/



I002Controller.$inject = ["m_movimientos_bodegas", "m_i002", "e_i002", "m_pedidos_clientes", "m_pedidos_farmacias", "e_pedidos_clientes", "e_pedidos_farmacias", "m_terceros", "m_pedidos"];

module.exports = I002Controller;