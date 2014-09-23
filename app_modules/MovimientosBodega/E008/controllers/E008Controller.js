
var E008Controller = function(movientos_bodegas, m_e008, e_e008, pedidos_clientes, pedidos_farmacias, eventos_pedidos_clientes, eventos_pedidos_farmacias, terceros) {

    console.log("Modulo E008 Cargado ");

    this.m_movientos_bodegas = movientos_bodegas;

    this.m_e008 = m_e008;
    this.e_e008 = e_e008;

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

    this.m_terceros = terceros;

};

// Generar Cabecera del Documento Temporal de CLIENTES
E008Controller.prototype.documentoTemporalClientes = function(req, res) {

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

    that.m_e008.ingresar_despacho_clientes_temporal(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, function(err, doc_tmp_id) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
            return;
        } else {
            /* ===============================================*/
            // Emitir Evento para restringir:
            // - La modificacion del pedido
            // - La reasignacion.
            /* ===============================================*/
            that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            res.send(G.utils.r(req.url, 'Documento Temporal Cliente Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
            return;
        }
    });
};

// Finalizar Documento Temporal Clientes
E008Controller.prototype.finalizarDocumentoTemporalClientes = function(req, res) {

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
    var estado = '1';

    that.m_e008.actualizar_estado_documento_temporal_clientes(numero_pedido, estado, function(err, rows, result) {
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
            return;
        } else {

            // Emitir evento para actualizar la lista de Documentos Temporales
            that.e_e008.onNotificarDocumentosTemporalesClientes({numero_pedido: numero_pedido});

            res.send(G.utils.r(req.url, 'Documento Temporal Clientes Finalizado Correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });
};

// Generar Cabecera del Documento Temporal de FARMACIAS
E008Controller.prototype.documentoTemporalFarmacias = function(req, res) {


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

    that.m_e008.ingresar_despacho_farmacias_temporal(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, function(err, doc_tmp_id, resultado) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
            return;
        } else {

            /* ===============================================*/
            // Emitir Evento para restringir:
            // - La modificacion del pedido
            // - La reasignacion.
            /* ===============================================*/

            that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

            res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
            return;
        }
    });


};

// Finalizar Documento Temporal Clientes
E008Controller.prototype.finalizarDocumentoTemporalFarmacias = function(req, res) {

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
    var estado = '1';

    that.m_e008.actualizar_estado_documento_temporal_farmacias(numero_pedido, estado, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
            return;
        } else {

            // Emitir evento para actualizar la lista de Documentos Temporales
            that.e_e008.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

            res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Finalizado Correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });
};

// Ingresar el detalle del documento temporal CLIENTES / FARMACIAS 
E008Controller.prototype.detalleDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.doc_tmp_id === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.centro_utilidad_id === undefined || args.documento_temporal.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.codigo_producto === undefined || args.documento_temporal.cantidad_ingresada === undefined) {
        res.send(G.utils.r(req.url, 'El código de producto o la cantidad ingresada no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.lote === undefined || args.documento_temporal.fecha_vencimiento === undefined) {
        res.send(G.utils.r(req.url, 'El lote o la fecha de vencimiento no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.iva === undefined || args.documento_temporal.valor_unitario === undefined) {
        res.send(G.utils.r(req.url, 'El IVA o El vlr Unitario no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.total_costo === undefined || args.documento_temporal.total_costo_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El costo total y el costo total del pedido no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.doc_tmp_id === '' || args.documento_temporal.empresa_id === '' || args.documento_temporal.centro_utilidad_id === '' || args.documento_temporal.bodega_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id estan vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.codigo_producto === '' || args.documento_temporal.cantidad_ingresada === '' || args.documento_temporal.cantidad_ingresada === 0) {
        res.send(G.utils.r(req.url, 'El código de producto esta vacio o la cantidad ingresada es igual a 0', 404, {}));
        return;
    }

    if (args.documento_temporal.lote === '' || args.documento_temporal.fecha_vencimiento === '') {
        res.send(G.utils.r(req.url, 'El lote o la fecha de vencimiento están vacias', 404, {}));
        return;
    }

    if (args.documento_temporal.iva === '' || args.documento_temporal.valor_unitario === '') {
        res.send(G.utils.r(req.url, 'El IVA o El vlr Unitario están Vacíos', 404, {}));
        return;
    }

    if (args.documento_temporal.total_costo === '' || args.documento_temporal.total_costo_pedido === '') {
        res.send(G.utils.r(req.url, 'El costo total y el costo total del pedido están vacíos', 404, {}));
        return;
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


    that.m_movientos_bodegas.ingresar_detalle_movimiento_bodega_temporal(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad_ingresada, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, function(err, rows) {
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

// Consultar TODOS los documentos temporales de despacho clientes 
E008Controller.prototype.consultarDocumentosTemporalesClientes = function(req, res) {

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

    var empresa_id = '03';
    var termino_busqueda = args.documento_temporal.termino_busqueda;
    var pagina_actual = args.documento_temporal.pagina_actual;
    var filtro = args.documento_temporal.filtro;

    that.m_e008.consultar_documentos_temporales_clientes(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, documentos_temporales, total_records) {
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
E008Controller.prototype.consultarDocumentosTemporalesFarmacias = function(req, res) {

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

    that.m_e008.consultar_documentos_temporales_farmacias(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, documentos_temporales, total_records) {
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
E008Controller.prototype.consultarDocumentoTemporalClientes = function(req, res) {

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
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

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
            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {
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
E008Controller.prototype.consultarDocumentoTemporalFarmacias = function(req, res) {

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

    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

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

            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {

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
                        //detalle.justificacion_auditor = producto.justificacion_auditor;
                    }

                });

                res.send(G.utils.r(req.url, 'Información Documento Temporal Farmacias ', 200, {documento_temporal: documento_temporal}));
            });

        });
    });

};

// Eliminar Producto Documento Temporal CLIENTES / FARMACIAS
E008Controller.prototype.eliminarProductoDocumentoTemporal = function(req, res) {


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

    that.m_movientos_bodegas.eliminar_producto_movimiento_bodega_temporal(item_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Producto del Documento Temporal Clientes', 500, {}));
            return;
        } else {

            that.m_e008.eliminar_justificaciones_producto(doc_tmp_id, usuario_id, codigo_producto, function(err, rows) {
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
E008Controller.prototype.eliminarDocumentoTemporalClientes = function(req, res) {

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
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Clientes.', 500, {}));
            return;
        } else {

            if (documento_temporal.length === 0) {
                res.send(G.utils.r(req.url, 'El Documento Temporal No Existe', 404, {}));
                return;
            }

            var documento = documento_temporal[0];

            var doc_tmp_id = documento.doc_tmp_id;
            var usuario_id = documento.usuario_id;

            that.m_e008.eliminar_documento_temporal_clientes(doc_tmp_id, usuario_id, function(err, rows) {
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
E008Controller.prototype.eliminarDocumentoTemporalFarmacias = function(req, res) {

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
    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Documento Temporal Farmacias.', 500, {}));
            return;
        } else {

            if (documento_temporal.length === 0) {
                res.send(G.utils.r(req.url, 'El Documento Temporal No Existe', 404, {}));
                return;
            }

            var documento = documento_temporal[0];

            var doc_tmp_id = documento.doc_tmp_id;
            var usuario_id = documento.usuario_id;

            that.m_e008.eliminar_documento_temporal_farmacias(doc_tmp_id, usuario_id, function(err, rows) {
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
E008Controller.prototype.justificacionPendientes = function(req, res) {
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

    that.m_e008.gestionar_justificaciones_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, function(err, rows, result) {

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
E008Controller.prototype.actualizarTipoDocumentoTemporalClientes = function(req, res) {

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
    var usuario_id = args.documento_temporal.usuario_id;
    var bodegas_doc_id = args.documento_temporal.bodegas_doc_id;

    var numero_pedido = args.documento_temporal.numero_pedido;
    var usuario_id = req.session.user.usuario_id;
    var auditor = 0;
    var estado = '2';
    var estado_pedido = '6'; //En auditora

    // Buscar el id del auditor
    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {

        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        } else {

            operario = operario[0];

            auditor = operario.operario_id;

            that.m_movientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, usuario_id, bodegas_doc_id, function(err, rows, result) {

                if (err || result.rowCount === 0) {
                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                    return;
                } else {
                    // Actualizar estado documento temporal a "En Auditoria"
                    that.m_e008.actualizar_estado_documento_temporal_clientes(numero_pedido, estado, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {
                            // Actualizar Estado Pedido. a "En Auditoria"
                            that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function(_err, _rows, responsable_estado_pedido) {

                                // Emitir Evento de Actualizacion de Pedido.
                                that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                // Emitir evento para actualizar la lista de Documentos Temporales
                                that.e_e008.onNotificarDocumentosTemporalesClientes({numero_pedido: numero_pedido});

                                res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
                            });
                        }
                    });
                }
            });

        }
    });
};

// Actualizar bodegas_doc_id en documento temporal farmacias.
E008Controller.prototype.actualizarTipoDocumentoTemporalFarmacias = function(req, res) {

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
    var usuario_id = args.documento_temporal.usuario_id;
    var bodegas_doc_id = args.documento_temporal.bodegas_doc_id;

    var numero_pedido = args.documento_temporal.numero_pedido;
    var usuario_id = req.session.user.usuario_id;
    var auditor = 0;
    var estado = '2';
    var estado_pedido = '6'; // En auditoria

    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario) {

        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        } else {

            operario = operario[0];

            auditor = operario.operario_id;

            that.m_movientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, usuario_id, bodegas_doc_id, function(err, rows, result) {

                if (err || result.rowCount === 0) {
                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                    return;
                } else {

                    // Actualizar estado documento a "En Auditoria"
                    that.m_e008.actualizar_estado_documento_temporal_farmacias(numero_pedido, estado, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {
                            // Actualizar Estado Pedido. a "En Auditoria"
                            that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function(_err, _rows, responsable_estado_pedido) {

                                // Emitir Evento de Actualizacion de Pedido.
                                that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                // Emitir evento para actualizar la lista de Documentos Temporales
                                that.e_e008.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

                                res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
                            });
                        }

                    });
                }
            });

        }
    });
};

// Consultar productos Auditados
E008Controller.prototype.consultarProductosAuditados = function(req, res) {

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

    that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los productos auditados', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            detalle_documento_temporal.forEach(function(producto) {
                if (producto.auditado === '1')
                    lista_productos.push(producto);
            });
            res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
        }
    });

};

// Auditar Producto Documento Temporal
E008Controller.prototype.auditarProductoDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.item_id === undefined || args.documento_temporal.auditado === undefined || args.documento_temporal.numero_caja === undefined) {
        res.send(G.utils.r(req.url, 'El item_id, numero_caja o auditado No Estan Definidos', 404, {}));
        return;
    }
    if (args.documento_temporal.item_id === '' || args.documento_temporal.item_id === "0" || args.documento_temporal.auditado === '' || args.documento_temporal.numero_caja === '' | args.documento_temporal.numero_caja === '0') {
        res.send(G.utils.r(req.url, 'El item_id o auditado  está vacio', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_caja === '' | args.documento_temporal.numero_caja === '0') {
        res.send(G.utils.r(req.url, 'El numero de caja esta vacio o es igual cero', 404, {}));
        return;
    }

    // Datos requeridos para auditar con la justificacion
    if (args.documento_temporal.justificacion !== undefined) {

        if (args.documento_temporal.justificacion.documento_temporal_id === undefined || args.documento_temporal.justificacion.usuario_id === undefined || args.documento_temporal.justificacion.codigo_producto === undefined) {
            res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o codigo_producto no estan definidos', 404, {}));
            return;
        }

        if (args.documento_temporal.justificacion.cantidad_pendiente === undefined || args.documento_temporal.justificacion.justificacion === undefined || args.documento_temporal.justificacion.existencia === undefined || args.documento_temporal.justificacion.justificacion_auditor === undefined) {
            res.send(G.utils.r(req.url, 'La cantidad_pendiente, justificacion, justificacion_auditor o existencia no estan definidos', 404, {}));
            return;
        }


        if (args.documento_temporal.justificacion.documento_temporal_id === "" || args.documento_temporal.justificacion.usuario_id === '' || args.documento_temporal.justificacion.codigo_producto === "") {
            res.send(G.utils.r(req.url, 'El doc_tmp_id, usuario_id o codigo_producto estan vacíos', 404, {}));
            return;
        }

        if (args.documento_temporal.justificacion.cantidad_pendiente === "" || args.documento_temporal.justificacion.justificacion === "" || args.documento_temporal.justificacion.existencia === "" || args.documento_temporal.justificacion.justificacion_auditor === "") {
            res.send(G.utils.r(req.url, 'La cantidad_pendiente, justificacion, justificacion_auditor o existencia estan vacíos', 404, {}));
            return;
        }

        if (parseInt(args.documento_temporal.justificacion.cantidad_pendiente) <= 0) {
            res.send(G.utils.r(req.url, 'La cantidad_pendiente debe ser mayor a cero', 404, {}));
            return;
        }

    }


    var item_id = args.documento_temporal.item_id;
    var auditado = args.documento_temporal.auditado;
    var numero_caja = args.documento_temporal.numero_caja;

    if (args.documento_temporal.justificacion !== undefined) {
        // Auditar con Justificacion.
        var doc_tmp_id = args.documento_temporal.justificacion.documento_temporal_id;
        var codigo_producto = args.documento_temporal.justificacion.codigo_producto;
        var cantidad_pendiente = args.documento_temporal.justificacion.cantidad_pendiente;
        var justificacion = args.documento_temporal.justificacion.justificacion;
        var justificacion_auditor = args.documento_temporal.justificacion.justificacion_auditor;
        var existencia = args.documento_temporal.justificacion.existencia;
        var usuario_id = args.documento_temporal.justificacion.usuario_id;

        that.m_e008.gestionar_justificaciones_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, function(err, rows, result) {
            if (err || result.rowCount === 0) {
                res.send(G.utils.r(req.url, 'Error ingresando la justificación', 500, {documento_temporal: {}}));
                return;
            } else {
                that.m_movientos_bodegas.auditar_producto_movimiento_bodega_temporal(item_id, auditado, numero_caja, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                        return;
                    } else {

                        var msj = " Producto Auditado Correctamente";
                        if (!auditado)
                            msj = " Producto ya NO esta auditado";

                        res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
                    }
                });
            }
        });
    } else {
        // Auditar sin Justificar.
        that.m_movientos_bodegas.auditar_producto_movimiento_bodega_temporal(item_id, auditado, numero_caja, function(err, rows, result) {

            if (err || result.rowCount === 0) {
                res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                return;
            } else {

                var msj = " Producto Auditado Correctamente";
                if (!auditado)
                    msj = " Producto ya NO esta auditado";

                res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
            }
        });
    }
};

// Buscar productos para auditar de Clientes 
E008Controller.prototype.auditoriaProductosClientes = function(req, res) {

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
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function(err, documento_temporal) {

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
            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                var count = detalle_documento_temporal.length;

                detalle_documento_temporal.forEach(function(detalle) {

                    // Consultar las justificaciones del producto
                    that.m_e008.consultar_justificaciones_pendientes(documento.documento_temporal_id, documento.usuario_id, detalle.codigo_producto, function(err, justificaciones) {

                        detalle.justificaciones = justificaciones;

                        var producto = productos_pedidos.filter(function(value) {
                            return detalle.codigo_producto === value.codigo_producto;
                        });

                        if (producto.length > 0) {
                            producto = producto[0];
                            detalle.cantidad_solicitada = producto.cantidad_solicitada;
                            detalle.cantidad_pendiente = producto.cantidad_solicitada - detalle.cantidad_ingresada;
                            //detalle.justificacion = producto.justificacion;
                            //detalle.justificacion_auditor = producto.justificacion_auditor;
                        }

                        //Si filtro es por codigo de barras.
                        if (filtro.codigo_barras) {
                            if (detalle.auditado === '0' && detalle.codigo_barras === termino_busqueda)
                                lista_productos.push(detalle);
                        }

                        //si filtro es por descripcion 
                        if (filtro.descripcion_producto) {
                            if (detalle.auditado === '0' && detalle.descripcion_producto.toLocaleLowerCase().substring(0, termino_busqueda.length) === termino_busqueda.toLowerCase())
                                lista_productos.push(detalle);
                        }

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
E008Controller.prototype.auditoriaProductosFarmacias = function(req, res) {

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
    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function(err, documento_temporal) {

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
            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

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

                    //Si filtro es por codigo de barras.
                    if (filtro.codigo_barras) {
                        if (detalle.auditado === '0' && detalle.codigo_barras === termino_busqueda)
                            lista_productos.push(detalle);
                    }

                    //si filtro es por descripcion 
                    if (filtro.descripcion_producto) {
                        if (detalle.auditado === '0' && detalle.descripcion_producto.toLocaleLowerCase().substring(0, termino_busqueda.length) === termino_busqueda.toLowerCase())
                            lista_productos.push(detalle);
                    }
                });

                res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: lista_productos}}));
            });
        });
    });
};


// Generar Documento Despacho Clientes
E008Controller.prototype.generarDocumentoDespachoClientes = function(req, res) {

    // Verificar Pendientes
    // Ingresar Justificacion
    // Verificar Rotulos

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined) {
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



    __validar_productos_pedidos_clientes(that, numero_pedido, documento_temporal_id, usuario_id, function(err, productos_no_auditados, productos_pendientes) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            if (productos_no_auditados || productos_pendientes) {
                res.send(G.utils.r(req.url, 'Algunos productos no ha sido auditados o tienen pendientes la justificacion', 404, {movimientos_bodegas: {productos_no_auditados: productos_no_auditados, productos_pendientes: productos_pendientes}}));
                return;
            }

        }
    });
};

// Generar Documento Despacho Farmacias
E008Controller.prototype.generarDocumentoDespachoFarmacias = function(req, res) {


};

// Validar que la caja este abierta
E008Controller.prototype.validarCajaProducto = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.numero_caja === undefined) {
        res.send(G.utils.r(req.url, 'documento_temporal_id  o numero_caja no estan definidos', 404, {}));
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

    that.m_e008.consultar_rotulo_caja(documento_temporal_id, numero_caja, function(err, rotulos_cajas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        } else {


            if (rotulos_cajas.length > 0) {
                var rotulo_caja = rotulos_cajas[0];
                res.send(G.utils.r(req.url, 'Validacion caja producto', 200, {movimientos_bodegas: {caja_valida: (rotulo_caja.caja_cerrada === '0') ? true : false}}));
                return;
            } else {
                // Crear
                that.m_e008.generar_rotulo_caja(documento_temporal_id, numero_pedido, nombre_cliente, direccion_cliente, cantidad, ruta, contenido, numero_caja, usuario_id, function(err, rotulo_caja) {
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
};

// Generar rotulos caja
E008Controller.prototype.generarRotuloCaja = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.numero_caja === undefined) {
        res.send(G.utils.r(req.url, 'documento_temporal_id  o numero_caja no estan definidos', 404, {}));
        return;
    }



    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.numero_caja === '' || args.documento_temporal.numero_caja === '0') {
        res.send(G.utils.r(req.url, 'documento_temporal_id o numero_caja estan vacios', 404, {}));
        return;
    }


    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var numero_caja = args.documento_temporal.numero_caja;

    that.m_e008.cerrar_caja(documento_temporal_id, numero_caja, function(err, rows, result) {
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error cerrando la caja', 500, {documento_temporal: {}}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Caja cerrada correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });


};


/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/


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

            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

                if (err) {
                    callback(err);
                    return;
                } else {
                    var productos_pendientes = [];
                    var productos_no_auditados = [];

                    detalle_pedido.forEach(function(producto_pedido) {

                        var producto_separado = detalle_documento_temporal.filter(function(value) {
                            return producto_pedido.codigo_producto === value.codigo_producto && value.auditado === '1';
                        });

                        // Verificar que los productos esten auditados
                        if (producto_separado.length === 0)
                            productos_no_auditados.push(producto_pedido);
                        else {
                            // Verificar que los productos con pendientes esten justificados po el auditor
                            if (producto_pedido.cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '')
                                productos_pendientes.push(producto_pedido);
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

function __validar_productos_pedidos_farmacias() {

}
;

function __validar_rotulos_cajas() {

}




E008Controller.$inject = ["m_movientos_bodegas", "m_e008", "e_e008", "m_pedidos_clientes", "m_pedidos_farmacias", "e_pedidos_clientes", "e_pedidos_farmacias", "m_terceros"];

module.exports = E008Controller;