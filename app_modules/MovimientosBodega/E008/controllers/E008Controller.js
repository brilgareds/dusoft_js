
var E008Controller = function (movimientos_bodegas, m_e008, e_e008, pedidos_clientes, pedidos_farmacias, eventos_pedidos_clientes, eventos_pedidos_farmacias, terceros, m_pedidos, log_e008) {

    this.m_movimientos_bodegas = movimientos_bodegas;

    this.m_e008 = m_e008;
    this.e_e008 = e_e008;

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

    this.m_terceros = terceros;
    this.m_pedidos = m_pedidos;
    this.log_e008 = log_e008;
};


// Generar Cabecera del Documento Temporal de CLIENTES
E008Controller.prototype.documentoTemporalClientes = function (req, res) {

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
    __validar_responsable_pedidos_clientes(that, numero_pedido, usuario_id, '1', function (err, continuar) {

        if (continuar) {
            that.m_e008.ingresar_despacho_clientes_temporal(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, function (err, doc_tmp_id) {
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
        } else {
            res.send(G.utils.r(req.url, '!Advertencia!, El pedido esta asignado a otro usuario', 403, {documento_temporal: {}}));
            return;
        }
    });


};

// Finalizar Documento Temporal Clientes
E008Controller.prototype.finalizarDocumentoTemporalClientes = function (req, res) {

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

    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function (err, operario) {
        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        }

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado, operario[0].operario_id, usuario_id, function (_err, _rows, responsable_estado_pedido) {
            if (err) {
                res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                return;
            }

            that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, ['1', '6'], '1', function (err, rows, results) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                }


                that.m_e008.actualizar_estado_documento_temporal_clientes(numero_pedido, '1', function (err, rows, result) {
                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
                        return;
                    } else {

                        // Emitir evento para actualizar la lista de Documentos Temporales
                        that.e_e008.onNotificarDocumentosTemporalesClientes({numero_pedido: numero_pedido});
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
E008Controller.prototype.documentoTemporalFarmacias = function (req, res) {


    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.observacion === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido, empresa_id u observacion no estan definidos.. ', 404, {}));
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
    __validar_responsable_pedidos_farmacias(that, numero_pedido, usuario_id, '1', function (err, continuar) {

        if (continuar) {

            that.m_e008.ingresar_despacho_farmacias_temporal(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, function (err, doc_tmp_id, resultado) {
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
        } else {
            res.send(G.utils.r(req.url, '!Advertencia!, El pedido esta asignado a otro usuario', 403, {documento_temporal: {}}));
            return;
        }
    });

};

/**
 * +Descripcion: Funcion encargada del proceso despues de separar los productos
 * del pedido por parte del operario logistico a traves de DusotfMovil,
 * este proceso es almacenado en un temporal cambiandole el estado al pedido
 * como Separacion finalizada.
 * @author Camilo  Orozco
 * @param {type} req
 * @param {type} res
 * @returns {void}
 * 
 */
E008Controller.prototype.finalizarDocumentoTemporalFarmacias = function (req, res) {

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

    that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function (err, operario) {

        if (err || operario.length === 0) {
            res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
            return;
        }

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado, operario[0].operario_id, usuario_id, function (_err, _rows, responsable_estado_pedido) {

            if (err) {
                res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                return;
            }

            that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, ['1', '6'], '1', function (err, rows) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                }

                that.m_e008.actualizar_estado_documento_temporal_farmacias(numero_pedido, '1', function (err, rows) {
                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                        return;
                    } else {

                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        // Emitir evento para actualizar la lista de Documentos Temporales
                        that.e_e008.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

                        res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Finalizado Correctamente', 200, {documento_temporal: {}}));
                        return;
                    }
                });
            });

        });
    });


};

// Ingresar el detalle del documento temporal CLIENTES / FARMACIAS 
E008Controller.prototype.detalleDocumentoTemporal = function (req, res) {

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

    that.m_movimientos_bodegas.ingresar_detalle_movimiento_bodega_temporal(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad_ingresada, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, function (err, rows) {
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


// Ingresar el detalle del documento temporal CLIENTES / FARMACIAS 
E008Controller.prototype.detalleDocumentoTemporalConValidacionCantidadIngresada = function (req, res) {

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

    /*validacion = __validarCantidadSolicitadaCantidadSeparada(args, that);
     if (!validacion.valido) {
     res.send(G.utils.r(req.url, validacion.msj, 404, {}));
     }*/


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

    var cantidad_solicitada = args.documento_temporal.cantidad_solicitada;
    var doc_tmp_id = args.documento_temporal.doc_tmp_id;

    //gestionar_detalle_movimiento_bodega();

    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_cantidad_total_ingresada", doc_tmp_id, empresa_id, centro_utilidad_id, bodega_id, codigo_producto).then(function (resultado) {
        cantidad_total = resultado[0].cantidad_total;
        if (cantidad_total + cantidad_ingresada > cantidad_solicitada) {
            //res.send(G.utils.r(req.url, 'Error la cantidad ingresada no puede ser mayor a la pendiente', 500, {documento_temporal: {item_id: 0}}));
            throw {msj: 'Error la cantidad ingresada no puede ser mayor a la pendiente', status: 500};
            //return;
        } else {
            return G.Q.ninvoke(that.m_movimientos_bodegas, 'ingresar_detalle_movimiento_bodega_temporal', empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad_ingresada, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id);
        }
    }).then(function (rows) {

        var item_id = (rows.length > 0) ? rows[0].item_id : 0;

        res.send(G.utils.r(req.url, 'Producto registrado correctamente en el documento temporal', 200, {documento_temporal: {item_id: item_id}}));
        return;
    }).fail(function (err) {
        if (err.status) {
            res.send(G.utils.r(req.url, err.msj, 500, {documento_temporal: {item_id: 0}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Error interno.', 500, {documento_temporal: {item_id: 0}}));
        }
    }).done();

};


E008Controller.prototype.modificarDetalleDocumentoTemporal = function (req, res) {
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
            centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, iva, function (err, rows) {
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
E008Controller.prototype.consultarDocumentosTemporalesClientes = function (req, res) {

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

    that.m_e008.consultar_documentos_temporales_clientes(empresa_id, termino_busqueda, filtro, pagina_actual, function (err, documentos_temporales, total_records) {
        if (err) {
            console.log("error generado listado ", err);
            res.send(G.utils.r(req.url, 'Error consultado los documentos temporales de clientes', 500, {documentos_temporales: {}}));
            return;
        } else {

            var i = documentos_temporales.length;

            documentos_temporales.forEach(function (documento) {

                that.m_pedidos_clientes.obtener_responsables_del_pedido(documento.numero_pedido, function (err, responsables) {
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
E008Controller.prototype.consultarDocumentosTemporalesFarmacias = function (req, res) {

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

    that.m_e008.consultar_documentos_temporales_farmacias(empresa_id, termino_busqueda, filtro, pagina_actual, function (err, documentos_temporales, total_records) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos temporales de farmacias', 500, {documentos_temporales: {}}));
            return;
        } else {

            var i = documentos_temporales.length;

            documentos_temporales.forEach(function (documento) {

                that.m_pedidos_farmacias.obtener_responsables_del_pedido(documento.numero_pedido, function (err, responsables) {
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
E008Controller.prototype.consultarDocumentoTemporalClientes = function (req, res) {

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
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function (err, documento_temporal) {

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
        that.m_pedidos_clientes.consultar_detalle_pedido(documento.numero_pedido, function (err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function (err, detalle_documento_temporal) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                documento.lista_productos = detalle_documento_temporal;

                detalle_documento_temporal.forEach(function (detalle) {

                    var producto = productos_pedidos.filter(function (value) {
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
E008Controller.prototype.consultarDocumentoTemporalFarmacias = function (req, res) {

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

    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function (err, documento_temporal) {

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
        that.m_pedidos_farmacias.consultar_detalle_pedido(documento.numero_pedido, function (err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.documento_temporal_id, documento.usuario_id, function (err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                documento.lista_productos = detalle_documento_temporal;

                detalle_documento_temporal.forEach(function (detalle) {

                    var producto = productos_pedidos.filter(function (value) {
                        return detalle.codigo_producto === value.codigo_producto;
                    });

                    if (producto.length > 0) {
                        producto = producto[0];

                        detalle.cantidad_solicitada = producto.cantidad_solicitada;
                        detalle.cantidad_pendiente = producto.cantidad_pendiente;
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
E008Controller.prototype.eliminarProductoDocumentoTemporal = function (req, res) {


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

    that.m_movimientos_bodegas.eliminar_producto_movimiento_bodega_temporal(item_id, function (err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Eliminado el Producto del Documento Temporal Clientes', 500, {}));
            return;
        } else {

            that.m_e008.eliminar_justificaciones_temporales_producto(doc_tmp_id, usuario_id, codigo_producto, function (err, rows) {
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
E008Controller.prototype.eliminarDocumentoTemporalClientes = function (req, res) {

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
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function (err, documento_temporal) {

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

            that.m_e008.eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, function (err, rows) {


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
E008Controller.prototype.eliminarDocumentoTemporalFarmacias = function (req, res) {

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
    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function (err, documento_temporal) {

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

            that.m_e008.eliminar_documento_temporal_farmacias(documento_temporal_id, usuario_id, function (err, rows) {
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
E008Controller.prototype.justificacionPendientes = function (req, res) {
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

    if (parseInt(args.documento_temporal.cantidad_pendiente) < 0) {
        res.send(G.utils.r(req.url, 'La cantidad_pendiente es inválida', 404, {}));
        return;
    }

    var doc_tmp_id = args.documento_temporal.doc_tmp_id;
    var codigo_producto = args.documento_temporal.codigo_producto;
    var cantidad_pendiente = args.documento_temporal.cantidad_pendiente;
    var justificacion = args.documento_temporal.justificacion;
    var justificacion_auditor = args.documento_temporal.justificacion_auditor;
    var existencia = args.documento_temporal.existencia;
    var usuario_id = req.session.user.usuario_id;
    var observacionSeparador = args.documento_temporal.observacion_justificacion_separador || "";

    that.m_e008.gestionar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, observacionSeparador, "", function (err, rows, result) {
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
E008Controller.prototype.actualizarTipoDocumentoTemporalClientes = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined ||
            args.documento_temporal.usuario_id === undefined || args.documento_temporal.bodegas_doc_id === undefined) {
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

    that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function (err, responsables) {

        console.log("err ", err);
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
            that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function (err, operario) {

                if (err || operario.length === 0) {
                    res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
                    return;
                } else {

                    operario = operario[0];

                    auditor = operario.operario_id;

                    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, responsable_id, bodegas_doc_id, function (err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {
                            // Actualizar estado documento temporal a "En Auditoria"
                            that.m_e008.actualizar_estado_documento_temporal_clientes(numero_pedido, estado, function (err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                                    return;
                                } else {
                                    // Actualizar Estado Pedido. a "En Auditoria"
                                    that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function (_err, _rows, responsable_estado_pedido) {

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
        } else {
            res.send(G.utils.r(req.url, 'El pedido esta siendo auditado', 500, {movimientos_bodegas: {}}));
            return;
        }


    });
    // Buscar el id del auditor

};

//validar auditor
// Actualizar bodegas_doc_id en documento temporal farmacias.
E008Controller.prototype.actualizarTipoDocumentoTemporalFarmacias = function (req, res) {

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
    that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function (err, responsables) {

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
            that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function (err, operario) {

                if (err || operario.length === 0) {
                    res.send(G.utils.r(req.url, 'No se ha parametrizado un operario de bodega con el id ' + usuario_id, 500, {movimientos_bodegas: {}}));
                    return;
                } else {

                    operario = operario[0];

                    auditor = operario.operario_id;

                    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, responsable_id, bodegas_doc_id, function (err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                            return;
                        } else {

                            // Actualizar estado documento a "En Auditoria"
                            that.m_e008.actualizar_estado_documento_temporal_farmacias(numero_pedido, estado, function (err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
                                    return;
                                } else {
                                    // Actualizar Estado Pedido. a "En Auditoria"
                                    that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, auditor, usuario_id, function (_err, _rows, responsable_estado_pedido) {

                                        // Emitir Evento de Actualizacion de Pedido.
                                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                        // Emitir evento para actualizar la lista de Documentos Temporales
                                        that.e_e008.onNotificarDocumentosTemporalesFarmacias({numero_pedido: numero_pedido});

                                        res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamente', 200, {movimientos_bodegas: {}}));
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
E008Controller.prototype.consultarProductosAuditados = function (req, res) {

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

    that.m_movimientos_bodegas.consultar_productos_auditados(documento_temporal_id, usuario_id, function (err, detalle_documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los productos auditados', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            /*detalle_documento_temporal.forEach(function(producto) {
             if (producto.auditado === '1'){
             lista_productos.push(producto);
             }
             });*/
            res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: detalle_documento_temporal}}));
        }
    });

};

// Auditar Producto Documento Temporal
E008Controller.prototype.auditarProductoDocumentoTemporal = function (req, res) {

    var that = this;

    var args = req.body.data;


    if (!args.documento_temporal.justificacionPendiente) {

        if (args.documento_temporal === undefined || args.documento_temporal.item_id === undefined || args.documento_temporal.auditado === undefined || args.documento_temporal.numero_caja === undefined) {
            res.send(G.utils.r(req.url, 'El item_id, numero_caja o auditado No Estan Definidos', 404, {}));
            return;
        }
        if (args.documento_temporal.item_id === '' || args.documento_temporal.item_id === "0" || args.documento_temporal.auditado === '' || args.documento_temporal.numero_caja === '' | args.documento_temporal.numero_caja === '0') {
            res.send(G.utils.r(req.url, 'El item_id o auditado  está vacio', 404, {}));
            return;
        }

        if (args.documento_temporal.numero_caja === '') {
            res.send(G.utils.r(req.url, 'El numero de caja esta vacio o es igual cero', 404, {}));
            return;
        }
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

        if (args.documento_temporal.justificacion.cantidad_pendiente === "" || args.documento_temporal.justificacion.existencia === "" || args.documento_temporal.justificacion.justificacion_auditor === "") {
            res.send(G.utils.r(req.url, 'La cantidad_pendiente, justificacion_auditor o existencia estan vacíos', 404, {}));
            return;
        }



        var validarPendientes = (args.documento_temporal.justificacion.validar_pendientes !== undefined && args.documento_temporal.justificacion.validar_pendientes !== null) ? Boolean(parseInt(args.documento_temporal.justificacion.validar_pendientes)) : true

        if (parseInt(args.documento_temporal.justificacion.cantidad_pendiente) <= 0 && validarPendientes) {
            res.send(G.utils.r(req.url, 'La cantidad_pendiente debe ser mayor a cero', 404, {}));
            return;
        }

    }


    var item_id = args.documento_temporal.item_id || 0;
    var auditado = args.documento_temporal.auditado;
    var numero_caja = args.documento_temporal.numero_caja || 0;

    if (args.documento_temporal.justificacion !== undefined) {
        // Auditar con Justificacion.
        var doc_tmp_id = args.documento_temporal.justificacion.documento_temporal_id;
        var usuario_id = args.documento_temporal.justificacion.usuario_id;
        var codigo_producto = args.documento_temporal.justificacion.codigo_producto;
        var cantidad_pendiente = args.documento_temporal.justificacion.cantidad_pendiente;
        var justificacion = args.documento_temporal.justificacion.justificacion;
        var justificacion_auditor = args.documento_temporal.justificacion.justificacion_auditor;
        var existencia = args.documento_temporal.justificacion.existencia;
        var observacionAuditor = args.documento_temporal.justificacion.observacion_justificacion_auditor || "";
        var observacionSeparador = args.documento_temporal.justificacion.observacion_justificacion_separador || "";

        that.m_e008.gestionar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia,
                justificacion, justificacion_auditor, observacionSeparador, observacionAuditor, function (err, rows, result) {
                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error ingresando la justificación', 500, {documento_temporal: {}}));
                        return;
                    } else {

                        that.m_movimientos_bodegas.auditar_producto_movimiento_bodega_temporal(item_id, auditado, numero_caja, function (err, rows, result) {

                            if (err /*|| result.rowCount === 0*/) {
                                res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                                return;
                            } else {

                                var msj = " Producto Auditado Correctamente";
                                if (!auditado) {
                                    msj = " Producto ya NO esta auditado";
                                }

                                if (/*result.rowCount === 0 &&*/ !auditado) {

                                    that.m_movimientos_bodegas.borrarJustificacionAuditor(usuario_id, doc_tmp_id, codigo_producto, function (err, rows, result) {

                                        if (err || result.rowCount === 0) {
                                            res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                                            return;
                                        }

                                        res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
                                    });
                                } else {
                                    res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
                                }
                            }
                        });
                    }
                });
    } else {


        var usuario_id = args.documento_temporal.usuario_id;
        var doc_tmp_id = args.documento_temporal.documento_temporal_id;
        var codigo_producto = args.documento_temporal.codigo_producto;

        // Auditar sin Justificar.
        that.m_movimientos_bodegas.auditar_producto_movimiento_bodega_temporal(item_id, auditado, numero_caja, function (err, rows, result) {

            if (err /*|| result.rowCount === 0*/) {
                res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                return;
            } else {

                var msj = " Producto Auditado Correctamente";
                if (!auditado)
                    msj = " Producto ya NO esta auditado";

                if (result.rowCount === 0 && !auditado) {

                    if (args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined
                            || args.documento_temporal.codigo_producto === undefined) {

                        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o codigo_producto no estan definidos', 404, {}));
                        return;
                    }

                    that.m_movimientos_bodegas.borrarJustificacionAuditor(usuario_id, doc_tmp_id, codigo_producto, function (err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Auditando el Producto', 500, {movimientos_bodegas: {}}));
                            return;
                        }

                        res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
                    });
                } else {
                    res.send(G.utils.r(req.url, msj, 200, {movimientos_bodegas: {}}));
                }
            }
        });
    }
};

E008Controller.prototype.buscarItemsTemporal = function (req, res) {
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

    that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento_temporal_id, usuario_id, filtro, function (err,
            detalle_documento_temporal) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
            return;
        }

        res.send(G.utils.r(req.url, 'Listado productos auditados', 200, {movimientos_bodegas: {lista_productos_auditados: detalle_documento_temporal}}));

    });
};

// Buscar productos para auditar de Clientes 
E008Controller.prototype.auditoriaProductosClientes = function (req, res) {

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

    /*if (args.documento_temporal.filtro.termino_busqueda === '') {
     res.send(G.utils.r(req.url, 'termino_busqueda esta vacio', 404, {}));
     return;
     }*/


    var numero_pedido = args.documento_temporal.numero_pedido;
    var filtro = args.documento_temporal.filtro;
    var termino_busqueda = args.documento_temporal.filtro.termino_busqueda;

    var lista_productos = [];

    // Consultamos el documento temporal de despacho
    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, function (err, documento_temporal) {

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
        that.m_pedidos_clientes.consultar_detalle_pedido(documento.numero_pedido, function (err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento.documento_temporal_id, documento.usuario_id, filtro, function (err, detalle_documento_temporal) {

                // res.send(G.utils.r(req.url, 'Listado productos auditados', 500, {movimientos_bodegas: {}}));
                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                var count = detalle_documento_temporal.length;

                //se unifica el detalle
                productos_pedidos = that.m_pedidos.unificarLotesDetalle(productos_pedidos);

                detalle_documento_temporal.forEach(function (detalle) {

                    // Consultar las justificaciones del producto
                    that.m_e008.consultar_justificaciones_temporales_pendientes(documento.documento_temporal_id, documento.usuario_id, detalle.codigo_producto, function (err, justificaciones) {

                        detalle.justificaciones = justificaciones;

                        var producto = productos_pedidos.filter(function (value) {
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
E008Controller.prototype.auditoriaProductosFarmacias = function (req, res) {

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

    /*if (args.documento_temporal.filtro.termino_busqueda === '') {
     res.send(G.utils.r(req.url, 'termino_busqueda esta vacio', 404, {}));
     return;
     }*/


    var numero_pedido = args.documento_temporal.numero_pedido;
    var filtro = args.documento_temporal.filtro;
    var termino_busqueda = args.documento_temporal.filtro.termino_busqueda;

    var lista_productos = [];

    // Consultamos el documento temporal de despacho
    that.m_e008.consultar_documento_temporal_farmacias(numero_pedido, function (err, documento_temporal) {

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
        that.m_pedidos_farmacias.consultar_detalle_pedido(documento.numero_pedido, function (err, productos_pedidos) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detalle del pedido', 500, {documento_temporal: []}));
                return;
            }
            // Consultar los productos asociados al documento temporal    
            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal_por_termino(documento.documento_temporal_id, documento.usuario_id, filtro, function (err, detalle_documento_temporal) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el detall del documento temporal', 500, {documento_temporal: []}));
                    return;
                }

                var count = detalle_documento_temporal.length;

                productos_pedidos = that.m_pedidos.unificarLotesDetalle(productos_pedidos);

                detalle_documento_temporal.forEach(function (detalle) {

                    // Consultar las justificaciones del producto
                    that.m_e008.consultar_justificaciones_temporales_pendientes(documento.documento_temporal_id, documento.usuario_id, detalle.codigo_producto, function (err, justificaciones) {

                        detalle.justificaciones = justificaciones;

                        var producto = productos_pedidos.filter(function (value) {
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


E008Controller.prototype.imprimirRotuloClientes = function (req, res) {

    var args = req.body.data;

    if (args.documento_temporal === undefined) {
        res.send(G.utils.r(req.url, 'Parametros incorrectos', 404, {}));
        return;
    }

    var that = this;
    var pedido = args.documento_temporal.numero_pedido;
    ;
    var numero = args.documento_temporal.numero_caja || undefined;
    var tipo = args.documento_temporal.tipo || undefined;
    var prefijo = args.documento_temporal.prefijo || undefined;
    var documento = args.documento_temporal.documento || undefined;

    if (args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no esta definido', 404, {}));
        return;
    }

    if (!args.documento_temporal.todos) {
        if (numero === undefined || tipo === undefined) {
            res.send(G.utils.r(req.url, 'El numero caja o tipo no estan definido', 404, {}));
            return;
        }
    }

    that.m_pedidos_clientes.obtenerDetalleRotulo(pedido, numero, tipo, function (e, rows) {
        if (e) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }

        if (rows.length === 0) {
            res.send(G.utils.r(req.url, 'No se encontro la caja para el pedido', 404, {}));
            return;
        }

        var detalleDepurado = [];

        for (var i in rows) {
            rows[i].documentoDespacho = {prefijo: prefijo, numero: documento};
            var existe = false;

            for (var ii in detalleDepurado) {
                var _rows = detalleDepurado[ii];

                if (rows[i].numero_caja === _rows.numero_caja) {
                    existe = true;
                    break;
                }
            }

            if (!existe) {
                detalleDepurado.push(rows[i]);
            }

        }

        var obj = {
            detalle: detalleDepurado,
            serverUrl: req.protocol + '://' + req.get('host') + "/"
        };

        _generarDocumentoRotulo(obj, function (nombreTmp) {
            res.send(G.utils.r(req.url, 'Url reporte rotulo', 200, {movimientos_bodegas: {nombre_reporte: nombreTmp}}));
        });
    });

};




E008Controller.prototype.imprimirRotuloFarmacias = function (req, res) {

    var args = req.body.data;

    if (args.documento_temporal === undefined) {
        res.send(G.utils.r(req.url, 'Parametros incorrectos', 404, {}));
        return;
    }

    var that = this;
    var pedido = args.documento_temporal.numero_pedido;
    ;
    var numero = args.documento_temporal.numero_caja || undefined;
    var tipo = args.documento_temporal.tipo || undefined;
    var prefijo = args.documento_temporal.prefijo || undefined;
    var documento = args.documento_temporal.documento || undefined;

    if (args.documento_temporal.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no esta definido', 404, {}));
        return;
    }

    if (!args.documento_temporal.todos) {
        if (numero === undefined || tipo === undefined) {
            res.send(G.utils.r(req.url, 'El numero caja o tipo no estan definido', 404, {}));
            return;
        }
    }


    that.m_pedidos_farmacias.obtenerDetalleRotulo(pedido, numero, tipo, function (e, rows) {

        if (e) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }

        if (rows.length === 0) {
            res.send(G.utils.r(req.url, 'No se encontro la caja para el pedido', 404, {}));
            return;
        }

        for (var i in rows) {
            rows[i].documentoDespacho = {prefijo: prefijo, numero: documento};
            var existe = false;

            var detalleDepurado = [];

            for (var ii in detalleDepurado) {
                var _rows = detalleDepurado[ii];

                if (rows[i].numero_caja === _rows.numero_caja) {
                    existe = true;
                    break;
                }
            }

            if (!existe) {
                detalleDepurado.push(rows[i]);
            }
        }

        var obj = {
            detalle: detalleDepurado,
            serverUrl: req.protocol + '://' + req.get('host') + "/"
        };

        _generarDocumentoRotulo(obj, function (nombreTmp) {
            res.send(G.utils.r(req.url, 'Url reporte rotulo', 200, {movimientos_bodegas: {nombre_reporte: nombreTmp}}));
        });

    });

};

function _generarDocumentoRotulo(obj, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/E008/reports/rotulos.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/E008/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: obj
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });


        });



    });
}



// Generar Documento Despacho Clientes
E008Controller.prototype.generarDocumentoDespachoClientes = function (req, res) {


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
    var empresa_id, prefijo_documento, numero_documento, estado, pedido;

    G.Q.ninvoke(that.m_pedidos_clientes, "consultar_pedido", numero_pedido).then(function (resultado) {
        pedido = resultado[0];
        return G.Q.ninvoke(that.m_pedidos_clientes, 'obtener_responsables_del_pedido', numero_pedido);
    }).then(function (responsables) {
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

        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {
            return G.Q.ninvoke(that.m_terceros, "seleccionar_operario_por_usuario_id", req.session.user.usuario_id);
        } else {
            throw {msj: "El pedido esta siendo auditado", status: 500};
        }
    }).then(function (operario) {
        if (operario.length === 0) {
            throw {msj: "El usuario no esta registrado como operario", status: 500};
        }

        auditor_id = operario[0].operario_id;

        return G.Q.nfcall(__validar_productos_pedidos_clientes, that, numero_pedido, documento_temporal_id, usuario_id);

    }).spread(function (productos_no_auditados, productos_pendientes, productosSinExistencias, productosPendientesInvalidos) {

        if (productosPendientesInvalidos.length > 0) {

            throw {msj: "Hay productos con cantidades pendientes invalidas", status: 404,
                obj: {movimientos_bodegas: {productos_no_auditados: [], productos_pendientes: [], productos_pendientes_invalidos: productosPendientesInvalidos}}};

        } else if (productos_no_auditados.length > 0 || productos_pendientes.length > 0) {
            throw {msj: "Hay productos sin auditar o pendientes sin justificación.", status: 404,
                obj: {movimientos_bodegas: {productos_no_auditados: productos_no_auditados, productos_pendientes: productos_pendientes}}};

        } else if (productosSinExistencias.length > 0) {
            throw {msj: "Hay productos con existencias menores a las cantidades ingresadas en la auditoria.", status: 404,
                obj: {movimientos_bodegas: {productosSinExistencias: productosSinExistencias}}};
        }

        return G.Q.nfcall(__validar_rotulos_cajas, that, documento_temporal_id, usuario_id, numero_pedido, '1');


    }).then(function (cajas_no_cerradas) {
        if (cajas_no_cerradas.length > 0) {
            throw {msj: "Algunas cajas no se han cerrado", status: 404,
                obj: {movimientos_bodegas: {cajas_no_cerradas: cajas_no_cerradas}}};
        }

        return G.Q.ninvoke(that.m_e008, "generar_documento_despacho_clientes", documento_temporal_id, numero_pedido, usuario_id, auditor_id);

    }).spread(function (_empresa_id, _prefijo_documento, _numero_documento) {
        empresa_id = _empresa_id;
        prefijo_documento = _prefijo_documento;
        numero_documento = _numero_documento;

        return G.Q.ninvoke(that.m_pedidos_clientes, "consultar_detalle_pedido", numero_pedido);

    }).then(function (detalle_pedido) {
        var cantidad_pendiente = 0;
        //temporalmente el pedido queda con estados despachado o despachado con pendientes al terminar de auditar
        estado = "2";

        detalle_pedido.forEach(function (producto_pedido) {

            cantidad_pendiente += producto_pedido.cantidad_pendiente_real;

        });

        if (cantidad_pendiente > 0) {
            estado = "8";
        }

        return G.Q.ninvoke(that.m_pedidos_clientes, "asignar_responsables_pedidos", numero_pedido, estado, auditor_id,
                req.session.user.usuario_id);
    }).then(function (rows) {
        return G.Q.ninvoke(that.m_pedidos_clientes, "terminar_estado_pedido", numero_pedido, [estado, '7'], '1');
    }).then(function (rows) {
        return G.Q.ninvoke(that.m_e008, "marcar_cajas_como_despachadas", documento_temporal_id, numero_pedido, '1');
    })/*.then(function(rows){
     
     var def = G.Q.defer();
     var bodega = "BD";
     
     if((pedido.identificacion_cliente === '10490' && pedido.tipo_id_cliente === "CE") || 
     (pedido.identificacion_cliente === '1083' && pedido.tipo_id_cliente === "CC") ||
     (pedido.identificacion_cliente === '505' && pedido.tipo_id_cliente === "AS")){
     
     
     if((pedido.identificacion_cliente === '505' && pedido.tipo_id_cliente === "AS")){
     bodega = "BD";
     } else if((pedido.identificacion_cliente === '1083' && pedido.tipo_id_cliente === "CC")){
     bodega = "BC";
     }
     
     var obj = {
     documentoId:418,
     prefijoDocumento : prefijo_documento,
     numeroDocumento : numero_documento,
     bodegasDoc : bodega,
     empresa: empresa_id,
     tipoPedido:"1",
     contexto:that,
     numeroPedido:pedido.numero_pedido,
     pedido:pedido
     };
     
     return G.Q.nfcall(__sincronizarDocumentoDespacho, obj);
     } else {
     def.resolve();
     }
     
     }).*/
            .then(function (rows) {
                that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
                res.send(G.utils.r(req.url, 'Se ha generado el documento', 200,
                        {movimientos_bodegas: {prefijo_documento: prefijo_documento, numero_documento: numero_documento, empresa_id: empresa_id}}));

            }).fail(function (err) {
        console.log("errorr aqui >>>>>>>>>>>>>>> ", err);
        if (err.status) {
            res.send(G.utils.r(req.url, err.msj, err.status, err.obj));
        } else {
            res.send(G.utils.r(req.url, "Error interno", "500"));
        }
    }).done();

};

// Generar Documento Despacho Farmacias
E008Controller.prototype.generarDocumentoDespachoFarmacias = function (req, res) {
    // Verificar Pendientes
    // Ingresar Justificacion
    // Verificar Rotulos

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined ||
            args.documento_temporal.documento_temporal_id === undefined || args.documento_temporal.usuario_id === undefined ||
            !args.documento_temporal.bodega_documento_id || !args.documento_temporal.bodega) {

        res.send(G.utils.r(req.url, 'documento_temporal_id,  usuario_id, bodega_documento_id, bodega o numero_pedido No Estan Definidos', 404, {}));
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
    var empresa_id, prefijo_documento, numero_documento, estado;
    var bodegaDocumentoId = args.documento_temporal.bodega_documento_id;
    var bodega = args.documento_temporal.bodega;
    var pedido;
    var documentoGenerado = true;
    var detallePedido = [];


    G.Q.ninvoke(that.m_pedidos_farmacias, "consultar_pedido", numero_pedido).then(function (resultado) {
        pedido = resultado[0];
        return G.Q.ninvoke(that.m_pedidos_farmacias, 'obtener_responsables_del_pedido', numero_pedido);

    }).then(function (responsables) {
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

        if (_responsables.length > 0 || (_responsables.length === 0 && !existe_estado_auditoria)) {
            return G.Q.ninvoke(that.m_terceros, "seleccionar_operario_por_usuario_id", req.session.user.usuario_id);
        } else {
            throw {msj: "El pedido esta siendo auditado", status: 403};
        }

    }).then(function (operario) {
        if (operario.length === 0) {
            throw {msj: "El usuario no esta registrado como operario", status: 500};
        }

        auditor_id = operario[0].operario_id;

        return G.Q.nfcall(__validar_productos_pedidos_farmacias, that, numero_pedido, documento_temporal_id, usuario_id);

    }).spread(function (productos_no_auditados, productos_pendientes, productosSinExistencias, productosPendientesInvalidos) {

        if (productosPendientesInvalidos.length > 0) {

            throw {msj: "Hay productos con cantidades pendientes invalidas", status: 404,
                obj: {movimientos_bodegas: {productos_no_auditados: [], productos_pendientes: [], productos_pendientes_invalidos: productosPendientesInvalidos}}};

        } else if (productos_no_auditados.length > 0 || productos_pendientes.length > 0) {
            console.log("productos_no_auditados ", productos_no_auditados);
            throw {msj: "Algunos productos no ha sido auditados o tienen pendientes la justificacion.", status: 404,
                obj: {movimientos_bodegas: {productos_no_auditados: productos_no_auditados, productos_pendientes: productos_pendientes}}};
        } else if (productosSinExistencias.length > 0) {
            throw {msj: "Hay productos con existencias menores a las cantidades ingresadas en la auditoria.", status: 404,
                obj: {movimientos_bodegas: {productosSinExistencias: productosSinExistencias}}};
        }


        return G.Q.nfcall(__validar_rotulos_cajas, that, documento_temporal_id, usuario_id, numero_pedido, '2');

    }).then(function (cajas_no_cerradas) {
        if (cajas_no_cerradas.length > 0) {
            throw {msj: "Algunas cajas no se han cerrado", status: 404,
                obj: {movimientos_bodegas: {cajas_no_cerradas: cajas_no_cerradas}}};
        }

        return G.Q.ninvoke(that.m_e008, "generar_documento_despacho_farmacias", documento_temporal_id, numero_pedido, usuario_id, auditor_id);

    }).spread(function (_empresa_id, _prefijo_documento, _numero_documento) {
        empresa_id = _empresa_id;
        prefijo_documento = _prefijo_documento;
        numero_documento = _numero_documento;

        return G.Q.ninvoke(that.m_pedidos_farmacias, "consultar_detalle_pedido", numero_pedido);

    }).then(function (detalle_pedido) {
        var cantidad_pendiente = 0;

        //temporalmente el pedido queda con estados despachado o despachado con pendientes al terminar de auditar
        estado = "2";

        detalle_pedido.forEach(function (producto_pedido) {

            cantidad_pendiente += producto_pedido.cantidad_pendiente_real;

        });

        detallePedido = detalle_pedido;

        if (cantidad_pendiente > 0) {
            estado = "8";
        }

        return G.Q.ninvoke(that.m_pedidos_farmacias, "asignar_responsables_pedidos", numero_pedido, estado, auditor_id,
                req.session.user.usuario_id);
    }).then(function (rows) {
        return G.Q.ninvoke(that.m_pedidos_farmacias, "terminar_estado_pedido", numero_pedido, [estado, '7'], '1');
    }).then(function (rows) {
        return G.Q.ninvoke(that.m_e008, "marcar_cajas_como_despachadas", documento_temporal_id, numero_pedido, '2');
    }).then(function (rows) {

        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
        res.send(G.utils.r(req.url, 'Se ha generado el documento', 200,
                {movimientos_bodegas: {prefijo_documento: prefijo_documento, numero_documento: numero_documento, empresa_id: empresa_id}}));


        if (pedido.empresa_id === '03' && (pedido.bodega_id === '03' || pedido.bodega_id === '06')) {

            return G.Q.ninvoke(that.m_e008, "obtenerTotalDetalleDespacho", {empresa: pedido.empresa_id, prefijoDocumento: prefijo_documento, numeroDocumento: numero_documento});

        }

    }).then(function (detalleDocumento) {

        if (detalleDocumento && detalleDocumento.length > 0) {

            var parametros = {
                ordenes_compras: {
                    usuario_id: req.session.user.usuario_id,
                    unidad_negocio: (pedido.bodega_id === '03') ? '4' : '0',
                    codigo_proveedor: 55,
                    empresa_id: pedido.empresa_id,
                    observacion: "Orden Generada por documento: " + prefijo_documento + " - " + numero_documento,
                    empresa_pedido: pedido.empresa_id,
                    centro_utilidad_pedido: pedido.centro_utilidad,
                    bodega_pedido: pedido.bodega_id,
                    productos: detalleDocumento
                }
            };
            G.eventEmitter.emit("onGenerarOrdenDeCompra", parametros);
        }
        ;


    }).fail(function (err) {
        console.log("se ha generado un error en el documento ", err);
        if (err.status) {
            res.send(G.utils.r(req.url, err.msj, err.status, err.obj));

        } else {

            res.send(G.utils.r(req.url, "Error interno", "500", {}));
        }
    }).done();


};

function __validarDumian(identificacion_cliente, tipo_id_cliente) {

    if ((identificacion_cliente === '10102' && tipo_id_cliente === "NIT") || //Cucuta -inversiones dumian+
            (identificacion_cliente === '10103' && tipo_id_cliente === "NIT") || //palmira -inversiones dumian+
            (identificacion_cliente === '10110' && tipo_id_cliente === "NIT") || //uci pediatrica dumian cucuta+
            (identificacion_cliente === '10111' && tipo_id_cliente === "NIT") || //uci pediatrica dumian bogota-
            (identificacion_cliente === '10118' && tipo_id_cliente === "NIT") || //uci adultos dumian pereira+
            (identificacion_cliente === '10122' && tipo_id_cliente === "NIT") || //bodega dumian cucuta+
            (identificacion_cliente === '10134' && tipo_id_cliente === "NIT") || //uci summa dumian-
            (identificacion_cliente === '10133' && tipo_id_cliente === "NIT") || //uci dumian popayan+
            (identificacion_cliente === '10174' && tipo_id_cliente === "CC") || //clinica mariaangel tulua+
            (identificacion_cliente === '10176' && tipo_id_cliente === "CC") || //laboratorio clinica mariaangel tulua+
            (identificacion_cliente === '10158' && tipo_id_cliente === "NIT") || //LABORATORIO CLINICA DEL CAFE+
            (identificacion_cliente === '10157' && tipo_id_cliente === "CC") || //FARMACIA CLINICA DEL CAFE+
            (identificacion_cliente === '10177' && tipo_id_cliente === "CC") || //LABORATORIO SANTA GRACIA+
            (identificacion_cliente === '10113' && tipo_id_cliente === "NIT") || //UCI ADULTOS ERAZMO MEOZ CUCUT+
            (identificacion_cliente === '10367' && tipo_id_cliente === "CE") || //CLINICA SAN RAFAEL DUMIAN CONSULTA EXTERNA GIRARDOT+
            (identificacion_cliente === '805027743' && tipo_id_cliente === "NIT") || //dumian medical sas+
            (identificacion_cliente === '10365' && tipo_id_cliente === "CE") || //clinica santa gracia buenaventura+
            (identificacion_cliente === '10366' && tipo_id_cliente === "CE") || //CLÍNICA SAN RAFAEL DUMIAN GIRARDOT+
            (identificacion_cliente === '10119' && tipo_id_cliente === "CE") || //UCI MARIO CORREA- LOS CHORROS+
            (identificacion_cliente === '10368' && tipo_id_cliente === "CC") || //LABORATORIO CLINICA SAN RAFAEL DUMIAN GIRARDOT+
            //(identificacion_cliente === '900775143' && tipo_id_cliente === "NIT")|| //UNION TEMPORAL DUCOT 
                    (identificacion_cliente === '900112820' && tipo_id_cliente === "NIT") || //CMS LTDA MANIZALEZ+
                    (identificacion_cliente === '900112820' && tipo_id_cliente === "PA") || //CMS - CLINICA AMAN+
                    (identificacion_cliente === '900112820' && tipo_id_cliente === "CC") || //LABORATORIO PINARES CMS+
                    (identificacion_cliente === '9001128201' && tipo_id_cliente === "CE") || //CMS PINARES PEREIRA+
                    (identificacion_cliente === '9001128201' && tipo_id_cliente === "TI") || //LABORATORIO CMS MANIZALEZ+
                    (identificacion_cliente === '890304155' && tipo_id_cliente === "NIT") || //HOSPITAL UNIVERSITARIO DEL VALLE+
                    (identificacion_cliente === '900112820' && tipo_id_cliente === "AS") || //LABORATORIO CLINICA AMAN CMS +
                    (identificacion_cliente === '800088098' && tipo_id_cliente === "NIT") || //LABORATORIO CLINICA AMAN CMS +
                    (identificacion_cliente === '800179870' && tipo_id_cliente === "NIT")) { //HOSPITAL SAN ANDRES DE TUMACO+

        return true;
    } else {
        return false;
    }
}

E008Controller.prototype.sincronizarDocumentoDespacho = function (req, res) {
    var that = this;

    var args = req.body.data;
    var numeroPedido = args.documento_despacho.numero_pedido;
    var tipoPedido = parseInt(args.documento_despacho.tipo_pedido);
    var prefijoDocumento = args.documento_despacho.prefijo_documento;
    var numeroDocumento = args.documento_despacho.numero_documento;
    var empresaId = args.documento_despacho.empresa_id;
    var pedido;
    var resultadoCabecera;
    var resultadoDetalle = [];
    var objRemision;
    var bodega = args.documento_despacho.bodega_destino;
    var documentoId = 418;

    if (!args.documento_despacho || !numeroPedido || !tipoPedido || !numeroDocumento || !prefijoDocumento || !empresaId || !bodega) {

        res.send(G.utils.r(req.url, 'Los datos obligatoris no esta definidos', 404, {}));
        return;
    }

    //Permite seguir con la sincronizacion en segundo plano
    if (args.documento_despacho.background) {
        res.send(G.utils.r(req.url, 'Se ha sincronizado el documento', 200, {movimientos_bodegas: {}}));
    }

    var modeloPedido = (tipoPedido === 1) ? that.m_pedidos_clientes : that.m_pedidos_farmacias;

    G.Q.ninvoke(modeloPedido, "consultar_pedido", numeroPedido).then(function (resultado) {
        pedido = resultado[0];
        resultadoCabecera = resultado[0];

        if ((tipoPedido !== 1 && pedido.farmacia_id === '01') ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '10490' && pedido.tipo_id_cliente === "CE") ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '1083' && pedido.tipo_id_cliente === "CC") ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '505' && pedido.tipo_id_cliente === "AS") ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '254' && pedido.tipo_id_cliente === "AS") ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '258' && pedido.tipo_id_cliente === "AS") ||
                (tipoPedido === 1 && pedido.identificacion_cliente === '259' && pedido.tipo_id_cliente === "AS") ||
                (tipoPedido === 1 && __validarDumian(pedido.identificacion_cliente, pedido.tipo_id_cliente))) {


            if (tipoPedido === 1) {
                if ((pedido.identificacion_cliente === '505' && pedido.tipo_id_cliente === "AS")) {//Clinica las peñitas
                    bodega = "BD";
                    documentoId = 418;
                } else if ((pedido.identificacion_cliente === '1083' && pedido.tipo_id_cliente === "CC")) {//Clinica las peñitas
                    bodega = "BC";
                    documentoId = 418;
                } else if ((pedido.identificacion_cliente === '254' && pedido.tipo_id_cliente === "AS")) {//santasofia
                    bodega = "1";
                    documentoId = 431;
                } else if ((pedido.identificacion_cliente === '258' && pedido.tipo_id_cliente === "AS")) {//santasofia
                    bodega = "2";
                    documentoId = 431;
                } else if ((pedido.identificacion_cliente === '259' && pedido.tipo_id_cliente === "AS")) {//santasofia
                    bodega = "3";
                    documentoId = 431;
                } else if ((pedido.identificacion_cliente === '900470642' && pedido.tipo_id_cliente === "NIT")) {//cucuta
                    bodega = "FG";
                    documentoId = 51;
                } else if ((pedido.identificacion_cliente === '10490' && pedido.tipo_id_cliente === "CE")) {//cartagena
                    bodega = "BD";
                    documentoId = 445;
                }

            }

            objRemision = {
                prefijoDocumento: prefijoDocumento,
                numeroDocumento: numeroDocumento,
                empresa: empresaId,
                tipoPedido: tipoPedido,
                numeroPedido: pedido.numero_pedido,
                pedido: pedido,
                contexto: that
            };

            if (__validarDumian(pedido.identificacion_cliente, pedido.tipo_id_cliente)) {


                return G.Q.ninvoke(that.m_e008, "obtenerTotalDetalleDespacho", objRemision);

            } else {

                var obj = {
                    documentoId: documentoId,
                    prefijoDocumento: prefijoDocumento,
                    numeroDocumento: numeroDocumento,
                    bodegasDoc: bodega,
                    empresa: empresaId,
                    contexto: that,
                    tipoPedido: tipoPedido,
                    numeroPedido: pedido.numero_pedido,
                    pedido: pedido
                };
                return G.Q.nfcall(__sincronizarDocumentoDespacho, obj);
            }
        } else {
            var tipo = tipoPedido == 1 ? "Cliente" : "Farmacia"
            throw {msj: "El documento no esta parametrizado para sincronizarse. \n" + tipo + " " + pedido.tipo_id_cliente + " " + pedido.identificacion_cliente + "", status: 404,
                obj: {documento_despacho: {}}};
        }

    }).then(function (resultado) {//obtenerBodegaMovimiento

        resultadoDetalle = resultado;
        return G.Q.ninvoke(that.m_e008, "obtenerBodegaMovimiento", objRemision);

    }).then(function (resultado) {

        if (__validarDumian(pedido.identificacion_cliente, pedido.tipo_id_cliente)) {
            var detalleProductos = [];
            var formato = 'YYYY-MM-DD';

            resultadoDetalle.forEach(function (item) {

                var fechaVencimiento = G.moment(item.fecha_vencimiento).format(formato);
                var detalle = {
                    //nombre:item.nombre,
                    codigo_producto: item.codigo_producto,
                    lote: item.lote,
                    codigo_cum: item.codigo_cum,
                    codigo_invima: item.codigo_invima,
                    fecha_vencimiento: fechaVencimiento,
                    cantidad: item.cantidad,
                    valor_unitario: item.valor_unitario_iva,
                    valor_total: item.valor_total_iva,
                    porcentaje_gravamen: item.porcentaje_gravamen,
                    costo: item.costo
                };

                detalleProductos.push(detalle);
            });

            var fechaRemision = G.moment(resultado[0].fecha_registro).format(formato);

            if (pedido.identificacion_cliente === '800179870') {

                $tercero = '800179870';

            } else if (pedido.identificacion_cliente === '900775143') {

                $tercero = '900775143';

            } else if (pedido.identificacion_cliente === '890304155') {

                $tercero = '890304155';

            } else if (pedido.identificacion_cliente === '900112820' || pedido.identificacion_cliente === '9001128201') {

                $tercero = '900112820';

            } else if (pedido.identificacion_cliente === '800088098') {
                
                $tercero = '800088098';
                
            } else {

                $tercero = '805027743';

            }

            var objCabecera = {
                nombre_tercero: resultadoCabecera.nombre_cliente,
                // "tipo_id_tercero" : resultadoCabecera.tipo_id_cliente,
                // "tercero_id" : resultadoCabecera.identificacion_cliente,
                tipo_id_tercero: 'NIT',
                tercero_id: $tercero,
                prefijo: prefijoDocumento,
                numero: numeroDocumento,
                //nit :'805027743',
                fecha_remision: fechaRemision,
                pedido: pedido.numero_pedido,
                observacion: pedido.observacion
                        //detalle : detalleProductos
            };

            var envio = {cabecera: objCabecera, detalle: detalleProductos};
            objRemision.parametros = {json_remision: envio};

            return G.Q.nfcall(__sincronizarRemisionProductos, objRemision);

        }

        //se comenta porque genera error al retornar la peticion (retorna la peticion dos veces aqui y en el siguiente then)
//       else{
//           console.log("Error sincronizarDocumentoDespacho EE ");
//	   if(!args.documento_despacho.background){
//	       res.send(G.utils.r(req.url, 'Se ha sincronizado el documento', 200, 
//			      {movimientos_bodegas: {}}));
//                            
//	   }
//       }
    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Se ha sincronizado el documento', 200,
                {movimientos_bodegas: {}}));
        return;

    }).fail(function (err) {

        console.log("Error sincronizarDocumentoDespacho: ", err);
        if (!args.documento_despacho.background) {
            if (err.status) {
                res.send(G.utils.r(req.url, err.msj, err.status, err.obj));

            } else {

                res.send(G.utils.r(req.url, "Se ha generado un error", "500", {}));
            }
        }

    }).done();
};

function __sincronizarDocumentoDespacho(obj, callback) {
    var def = G.Q.defer();
    obj.observacion = obj.prefijoDocumento + " - " + obj.numeroDocumento;

    G.Q.ninvoke(obj.contexto.log_e008, "obtenerEncabezadoLog", obj)
            .then(function (logs) {
                if (logs.length > 0 && logs[0].error !== "1") {
                    throw {msj: "El documento ya fue sincronizado", status: 403, obj: {}};
                } else {
                    def.resolve();
                }

            }).then(function () {
        return G.Q.ninvoke(obj.contexto.log_e008, "borrarLog", obj);

    }).then(function () {
        return G.Q.ninvoke(obj.contexto.m_e008, "obtenerTotalDetalleDespacho", obj);

    }).then(function (detalle) {
        obj.detalle = detalle;
        return G.Q.nfcall(__sincronizarEncabezadoDocumento, obj);

    }).then(function (resultado) {

        return G.Q.nfcall(__sincronizarDetalleDocumento, obj);

    }).then(function () {
        callback(false);

    }).fail(function (err) {
        console.log("Error __sincronizarDocumentoDespacho", err);
        callback(err);
    }).done();


}
;


function __sincronizarEncabezadoDocumento(obj, callback) {
    //var url = (obj.tipoPedido === '1')? G.constants.WS().DOCUMENTOS.CARTAGENA.E008 :G.constants.WS().DOCUMENTOS.COSMITET.E008; 
    var usuarioId = "4608";
    var url = "";
    //Clinica Rey David
    if (parseInt(obj.tipoPedido) !== 1) {
        url = G.constants.WS().DOCUMENTOS.COSMITET.E008;

    } else {

        if (obj.pedido.identificacion_cliente === '10490' && obj.pedido.tipo_id_cliente === "CE") { //Cartagena
            url = G.constants.WS().DOCUMENTOS.CARTAGENA.E008;

        } else if ((obj.pedido.identificacion_cliente === '1083' && obj.pedido.tipo_id_cliente === "CC") || //Clinica las peñitas
                (obj.pedido.identificacion_cliente === '505' && obj.pedido.tipo_id_cliente === "AS")) {

            url = G.constants.WS().DOCUMENTOS.PENITAS.E008;
        } else if ((obj.pedido.identificacion_cliente === '254' && obj.pedido.tipo_id_cliente === "AS") ||
                (obj.pedido.identificacion_cliente === '258' && obj.pedido.tipo_id_cliente === "AS") ||
                (obj.pedido.identificacion_cliente === '259' && obj.pedido.tipo_id_cliente === "AS")) {//Santa Soafia
            // usuarioId="4769";
            url = G.constants.WS().DOCUMENTOS.SANTASOFIA.E008;
        } else if ((obj.pedido.identificacion_cliente === '900470642' && obj.pedido.tipo_id_cliente === "NIT")) {//cucuta
            usuarioId = "1394";
            url = G.constants.WS().DOCUMENTOS.CUCUTA.E008;
        }
    }

    var resultado;

    obj.parametros = {
        usuarioId: usuarioId,
        bodegasDoc: obj.bodegasDoc,
        observacion: obj.observacion,
        documentoId: obj.documentoId
    };
    obj.error = false;
    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).
            then(function (client) {
                return G.Q.ninvoke(client, "bodegasMovimientoTmp", obj.parametros);
            }).
            spread(function (result, raw, soapHeader) {
                obj.resultadoEncabezado = result.return.descripcion["$value"];
                if (!result.return.estado["$value"]) {
                    throw {msj: /*result.return.descripcion["$value"]*/"Se ha generado un error sincronizando el documento", status: 403, obj: {}};
                } else {
                    obj.temporal = result.return.docTmpId["$value"];
                    obj.tipo = '0';
                    //Se guarda el resultado en log
                    return G.Q.ninvoke(obj.contexto.log_e008, "ingresarLogsSincronizacionDespachos", obj);

                }

            }).then(function () {
        callback(false, obj);

    }).fail(function (err) {
        obj.error = true;
        console.log("ERROR CABECERA ", err);
        obj.tipo = '0';
        G.Q.ninvoke(obj.contexto.log_e008, "ingresarLogsSincronizacionDespachos", obj).finally(function () {
            callback(err);
        });
    }).done();
}

function __sincronizarRemisionProductos(obj, callback) {
    var url = G.constants.WS().DOCUMENTOS.DUMIAN.E008;
    obj.resultadoEncabezado = "";
    var resultado;

//    obj.parametros = {
//        usuarioId:"4608",
//        bodegasDoc:obj.bodegasDoc,
//        observacion:obj.observacion,    
//        documentoId:obj.documentoId
//    };
    obj.error = false;
    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).then(function (client) {


        return G.Q.ninvoke(client, "almacenarRemisionMedicamentosInsumos", obj.parametros);

    }).spread(function (result, raw, soapHeader) {
        console.log("result ", result);
        if (result.success["$value"] !== '1') {
//	if (result.message["$value"]!==undefined) {

            throw {msj: "Se ha generado un error sincronizando el documento. <br> - " + result.message["$value"], status: 403, obj: {}};

        } else {

            obj.temporal = result.message["$value"];
            obj.tipo = '0';
            //Se guarda el resultado en log
            return G.Q.ninvoke(obj.contexto.log_e008, "ingresarLogsSincronizacionDespachos", obj);

        }

    }).then(function (data) {

        callback(false, obj);

    }).fail(function (err) {

        console.log("Error __sincronizarRemisionProductos ", err);
        obj.error = true;
        obj.tipo = '0';
        obj.resultadoEncabezado = obj.resultadoEncabezado === "" ? err : obj.resultadoEncabezado;

        G.Q.ninvoke(obj.contexto.log_e008, "ingresarLogsSincronizacionDespachos", obj).finally(function () {
            obj.status = 500;
            obj.msj = err.msj;//+" <br> - Url: "+url
            callback(obj);
            return;
        });

    }).done();
}

function __sincronizarDetalleDocumento(obj, callback) {
    var def = G.Q.defer();
    obj.error = false;
    var url = "";
    var soloPrecioVenta = true;
    var producto = obj.detalle[0];
    var def = G.Q.defer();

    //Clinica Rey David
    if (parseInt(obj.tipoPedido) !== 1) {
        url = G.constants.WS().DOCUMENTOS.COSMITET.E008;

    } else {

        if (obj.pedido.identificacion_cliente === '10490' && obj.pedido.tipo_id_cliente === "CE") { //Cartagena 
            url = G.constants.WS().DOCUMENTOS.CARTAGENA.E008;
            soloPrecioVenta = false;

        } else if ((obj.pedido.identificacion_cliente === '1083' && obj.pedido.tipo_id_cliente === "CC") || //Clinica las peñitas
                (obj.pedido.identificacion_cliente === '505' && obj.pedido.tipo_id_cliente === "AS")) {

            url = G.constants.WS().DOCUMENTOS.PENITAS.E008;
        } else if ((obj.pedido.identificacion_cliente === '254' && obj.pedido.tipo_id_cliente === "AS") ||
                (obj.pedido.identificacion_cliente === '258' && obj.pedido.tipo_id_cliente === "AS") ||
                (obj.pedido.identificacion_cliente === '259' && obj.pedido.tipo_id_cliente === "AS")) {//Santa Soafia

            url = G.constants.WS().DOCUMENTOS.SANTASOFIA.E008;
        } else if ((obj.pedido.identificacion_cliente === '900470642' && obj.pedido.tipo_id_cliente === "NIT")) {//cucuta

            url = G.constants.WS().DOCUMENTOS.CUCUTA.E008;
        }
    }

    var productos = [];
    var temporal = obj.temporal;
    obj.detalle.forEach(function (producto) {
        obj.parametros = {
            "usuarioId": "4608",
            "docTmpId": temporal, //temporal, diferencia en produccion y doc_tmp_id
            "tipoTercero": "NIT",
            "terceroId": "830080649",
            "documentoCompra": "AAA000",
            "fechaDocCompra": "2014-06-27",
            "codigoProducto": producto.codigo_producto,
            "cantidad": producto.cantidad,
            "porcentajeGravamen": producto.porcentaje_gravamen,
            "totalCosto": producto.valor_total_iva,
            "fechaVencimiento": producto.fecha_vencimiento_producto,
            "lote": producto.lote,
            "localizacionProducto": "N/A",
            "totalcostoPedido": producto.valor_unitario_iva,
            "valorUnitario": producto.valor_unitario_iva,
            "descuento": 0
        };
        productos.push(obj.parametros);
    });

    var detalle = {
        "productos": productos
    };

    G.Q.nfcall(G.soap.createClient, url).
            then(function (client) {
                return G.Q.ninvoke(client, "bodegasMovimientoTmpD", detalle);
            }).
            spread(function (result, raw, soapHeader) {
                obj.resultadoDetalle = result.return.descripcion["$value"];
                obj.error = false;

                //Asi fallen los productos se debe continuar con el proceso
                if (!result.return.estado["$value"]) {
                    //throw {msj:"Resultado sincronización: "+result.return.descripcion["$value"], status:403, obj:{}}; 
                    obj.error = true;
                }

                def.resolve();

            }).fail(function (err) {
        console.log("ERROR __sincronizarDetalleDocumento ", err);
        callback(err);
    }).
            done(function () {
                obj.tipo = '1';
                //  obj.resultadoEncabezado=err;
                G.Q.ninvoke(obj.contexto.log_e008, "ingresarLogsSincronizacionDespachos", obj).then(function () {
                    obj.detalle.splice(0, 1);
//           __sincronizarDetalleDocumento(obj,callback); 
                    callback(false);
                    return;
                });
            });
}

E008Controller.prototype.consultarNumeroMayorRotulo = function (req, res) {
    var that = this;

    var args = req.body.data;


    if (!args.documento_temporal || !args.documento_temporal.numero_pedido || args.documento_temporal.tipo === undefined
            || !args.documento_temporal.tipo_pedido) {
        res.send(G.utils.r(req.url, 'Los datos obligatorios no esta definidos', 404, {}));
        return;
    }

    var documento_temporal_id = args.documento_temporal.documento_temporal || 0;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var tipo = args.documento_temporal.tipo;
    var numeroSiguiente = 1;
    var tipoPedido = args.documento_temporal.tipo_pedido;

    that.m_e008.consultarNumeroMayorRotulo(documento_temporal_id, numero_pedido, tipo, tipoPedido, function (err, rotuloMayor) {
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }
        numeroSiguiente = parseInt(rotuloMayor[0].numero_caja) + 1;

        res.send(G.utils.r(req.url, "Numero de caja siguiente", 200, {movimientos_bodegas: {numero: numeroSiguiente}}));
    });

};


/**
 * +Descripcion: Metodo encargado de validar Validar que la caja este abierta
 * @param {type} req
 * @param {type} res
 * @returns {unresolved}
 */
E008Controller.prototype.validarCajaProducto = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined ||
            args.documento_temporal.numero_caja === undefined || args.documento_temporal.tipo === undefined || !args.documento_temporal.tipo_pedido) {
        res.send(G.utils.r(req.url, 'documento_temporal_id, numero_caja, tipo de pedido o tipo no estan definidos', 404, {}));
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
    var tipoPedido = args.documento_temporal.tipo_pedido;

    that.m_e008.consultarNumeroMayorRotulo(documento_temporal_id, numero_pedido, tipo, tipoPedido, function (err, rotuloMayor) {
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
            return;
        }

        var numeroSiguiente = parseInt(rotuloMayor[0].numero_caja) + 1;

        if (numeroSiguiente < numero_caja) {
            res.send(G.utils.r(req.url, 'El número debe ser consecutivo, el número siguiente debe ser ' + numeroSiguiente, 403, {movimientos_bodegas: {caja_valida: false}}));
            return;
        }

        /**
         * +Descripcion: Se consultar la existencia del rotulo de la caja en la
         * tabla inv_rotulo_caja
         * @param {String} documento_temporal_id Es el id documento
         * @param {String} numero_pedido Es el numero de pedido
         * @param {integer} tipo si es caja o nevera
         */
        that.m_e008.consultar_rotulo_caja(documento_temporal_id, numero_caja, numero_pedido, tipoPedido, function (err, rotulos_cajas) {
            if (err) {
                res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {movimientos_bodegas: {}}));
                return;
            } else {
                var rotulo_caja;

                //obtener la caja por el tipo 0 = caja, 1= nevera
                for (var i in rotulos_cajas) {
                    var _rotulo = rotulos_cajas[i];

                    if (parseInt(_rotulo.tipo) === tipo) {
                        rotulo_caja = _rotulo;
                        break;
                    }
                }

                if (rotulo_caja) {

                    res.send(G.utils.r(req.url, 'Validacion caja producto', 200, {movimientos_bodegas: {caja_valida: (rotulo_caja.caja_cerrada === '0') ? true : false}}));
                    return;
                } else {
                    // Crear
                    that.m_e008.generar_rotulo_caja(documento_temporal_id, numero_pedido, nombre_cliente, direccion_cliente,
                            cantidad, ruta, contenido, numero_caja, usuario_id, tipo, tipoPedido, function (err, rotulo_caja) {
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
    // });


};

// Generar rotulos caja
E008Controller.prototype.generarRotuloCaja = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.documento_temporal_id === undefined
            || args.documento_temporal.numero_caja === undefined || args.documento_temporal.tipo === undefined || !args.documento_temporal.tipo_pedido) {
        res.send(G.utils.r(req.url, 'documento_temporal_id, numero_caja, tipo pedido o tipo no estan definidos', 404, {}));
        return;
    }



    if (args.documento_temporal.documento_temporal_id === '' || args.documento_temporal.numero_caja === '' || args.documento_temporal.numero_caja === '0') {
        res.send(G.utils.r(req.url, 'documento_temporal_id o numero_caja estan vacios', 404, {}));
        return;
    }


    var documento_temporal_id = args.documento_temporal.documento_temporal_id;
    var numero_caja = args.documento_temporal.numero_caja;
    var tipo = args.documento_temporal.tipo;
    var tipoPedido = args.documento_temporal.tipo_pedido;


    that.m_e008.cerrar_caja(documento_temporal_id, numero_caja, tipo, tipoPedido, function (err, rows, result) {
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error cerrando la caja', 500, {documento_temporal: {}}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Caja cerrada correctamente', 200, {documento_temporal: {}}));
            return;
        }
    });


};

/**
 * +Descripcion: Metodo encargado de ejecutar el modelo para actualizar
 * una caja y los lotes que se le quieran añadir
 * @param {type} req
 * @param {type} res
 * @returns {unresolved}
 */
E008Controller.prototype.actualizarCajaDeTemporales = function (req, res) {
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

    temporales.forEach(function (temporal) {

        that.m_e008.actualizarCajaDeTemporal(temporal, numero_caja, tipo, function (err, rows, result) {

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


E008Controller.prototype.imprimirDocumentoDespacho = function (req, res) {

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


    that.m_e008.consultar_documento_despacho(numero, prefijo, empresa, req.session.user.usuario_id, function (err, rows) {
console.log("rows::",rows);
        if (err || rows.length === 0) {

            res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
            return;
        }
        datos_documento.encabezado = rows[0];
        datos_documento.encabezado.total = 0;
        datos_documento.encabezado.subTotal = 0;
        datos_documento.encabezado.totalIva = 0;

        that.m_movimientos_bodegas.consultar_detalle_documento_despacho(numero, prefijo, empresa, function (err, rows) {
            if (err) {
                res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                return;
            }

            datos_documento.detalle = rows;
            that.m_movimientos_bodegas.consultar_datos_adicionales_documento(numero, prefijo, empresa, datos_documento.encabezado.tipo_doc_bodega_id, function (err, rows) {
                if (err || rows.length === 0) {
                    res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                    return;
                }

                datos_documento.adicionales = that.m_movimientos_bodegas.darFormatoTituloAdicionesDocumento(rows[0]);
                datos_documento.serverUrl = req.protocol + '://' + req.get('host') + "/";

                //Calculo de totales
                datos_documento.detalle.forEach(function (detalle) {
                    datos_documento.encabezado.subTotal += detalle.valor_unitario * detalle.cantidad;
                    datos_documento.encabezado.totalIva += (detalle.iva * detalle.cantidad);
                });

                datos_documento.encabezado.total = datos_documento.encabezado.subTotal + datos_documento.encabezado.totalIva;
                datos_documento.encabezado.total = datos_documento.encabezado.total.toFixed(2);
                datos_documento.encabezado.subTotal = datos_documento.encabezado.subTotal.toFixed(2);
                datos_documento.encabezado.totalIva = datos_documento.encabezado.totalIva.toFixed(2);


                //Se ordena por caja
                datos_documento.detalle.sort(function (a, b) {
                    if (a.numero_caja > b.numero_caja) {
                        return 1;
                    }

                    if (a.numero_caja < b.numero_caja) {
                        return -1;
                    }

                    return 0;
                });

                __generarPdfDespacho(datos_documento, function (nombre_pdf) {

                    res.send(G.utils.r(req.url, 'Documento Generado Correctamete', 200, {
                        //  movimientos_bodegas: {nombre_pdf: nombre_pdf}
                        movimientos_bodegas: {nombre_pdf: nombre_pdf, datos_documento: datos_documento}
                    }));
                });

            });


        });

    });

};


E008Controller.prototype.obtenerDocumento = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (!args.documento_temporal) {
        res.send(G.utils.r(req.url, 'Variable (documento_temporal) no esta definida', 404, {}));
        return;
    }

    if (!args.documento_temporal.empresa_id) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {pedidos_clientes: []}));
        return;
    }

    if (!args.documento_temporal.prefijo) {
        res.send(G.utils.r(req.url, 'Se requiere el prefijo', 404, {pedidos_clientes: []}));
        return;
    }

    if (!args.documento_temporal.numero) {
        res.send(G.utils.r(req.url, 'Se requiere el numero', 404, {pedidos_clientes: []}));
        return;
    }


    var empresa_id = args.documento_temporal.empresa_id;
    var prefijo = args.documento_temporal.prefijo;
    var numero = args.documento_temporal.numero;

    var obj = {
        empresa_id: empresa_id,
        prefijo: prefijo,
        numero: numero

    };

    G.Q.ninvoke(that.m_e008, 'obtenerDocumento', obj).then(function (resultado) {

        if (resultado.length > 0) {

            return res.send(G.utils.r(req.url, 'Documento existente', 200, {documento_temporal: resultado}));

        } else {

            return res.send(G.utils.r(req.url, 'No se encuentra el documento ', 404, {documento_temporal: {}}));

        }

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta ', 500, {documento_temporal: {}}));

    }).done();

};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 *              Auditados
 */
E008Controller.prototype.listarDespachosAuditados = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.despachos_auditados === undefined) {
        res.send(G.utils.r(req.url, 'Variable (DespachosAuditados) no esta definida', 404, {}));
        return;
    }

    if (args.despachos_auditados.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.despachos_auditados.empresa_id;
    var prefijo = args.despachos_auditados.prefijo;
    var numero = args.despachos_auditados.numero;
    var fechaInicial = args.despachos_auditados.fechaInicial;
    var fechaFinal = args.despachos_auditados.fechaFinal;
    var paginaActual = args.despachos_auditados.paginaactual;
    var registroUnico = args.despachos_auditados.registroUnico;


    var obj = {
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        registroUnico: registroUnico
    };

    G.Q.ninvoke(that.m_e008, 'listarDespachosAuditados', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Lista de despachos audtados', 200, {despachos_auditados: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado los de despachos', 500, {despachos_auditados: {}}));

    }).done();

};




/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para mostrar el detalle de
 *              un documento
 */
E008Controller.prototype.detalleDocumentoAuditado = function (req, res) {


    var that = this;

    var args = req.body.data;

    if (args.despachos_auditados === undefined) {
        res.send(G.utils.r(req.url, 'Variable (DespachosAuditados) no esta definida', 404, {}));
        return;
    }

    if (args.despachos_auditados.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.despachos_auditados.empresa_id;
    var prefijo = args.despachos_auditados.prefijo;
    var numero = args.despachos_auditados.numero;



    var obj = {
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        empresa_id: empresa_id,
    };

    G.Q.ninvoke(that.m_e008, 'detalleDocumentoAuditado', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Detalle de documento auditados', 200, {despachos_auditados: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado el detalle', 500, {despachos_auditados: {}}));

    }).done();

};




/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para mostrar el detalle de
 *              de los pedidos de un documento
 */
E008Controller.prototype.detallePedidoClienteDocumento = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.despachos_auditados === undefined) {
        res.send(G.utils.r(req.url, 'Variable (despachos_auditados) no esta definida', 404, {}));
        return;
    }

    if (args.despachos_auditados.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.despachos_auditados.empresa_id;
    var prefijo = args.despachos_auditados.prefijo;
    var numero = args.despachos_auditados.numero;



    var obj = {
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        empresa_id: empresa_id,
    };
    var status = {};

    G.Q.ninvoke(that.m_e008, 'detallePedidoClienteDocumento', obj).then(function (resultado) {

        var def = G.Q.defer();

        if (resultado.length > 0) {

            status.codigo = 200;
            status.mensaje = 'Detalle de pedidos cliente del documento auditados';

        } else {

            status.codigo = 403;
            status.mensaje = 'El pedido no tiene productos asignados';
            def.resolve();
        }
        res.send(G.utils.r(req.url, status.mensaje, status.codigo, {despachos_auditados: resultado}));


        //return res.send(G.utils.r(req.url, 'Detalle de pedidos cliente del documento auditados', 200, {despachos_auditados: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado el pedido', 500, {despachos_auditados: {}}));

    }).done();

};

/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para mostrar el detalle de
 *              de los pedidos de un documento
 */
E008Controller.prototype.detallePedidoFarmaciaDocumento = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.despachos_auditados === undefined) {
        res.send(G.utils.r(req.url, 'Variable (despachos_auditados) no esta definida', 404, {}));
        return;
    }

    if (args.despachos_auditados.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.despachos_auditados.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.despachos_auditados.empresa_id;
    var prefijo = args.despachos_auditados.prefijo;
    var numero = args.despachos_auditados.numero;

    var obj = {
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        empresa_id: empresa_id,
    };
    var status = {};

    G.Q.ninvoke(that.m_e008, 'detallePedidoFarmaciaDocumento', obj).then(function (resultado) {

        var def = G.Q.defer();

        if (resultado.length > 0) {

            status.codigo = 200;
            status.mensaje = 'Detalle del pedido farmacia del documento auditados';

        } else {

            status.codigo = 403;
            status.mensaje = 'El pedido no tiene productos asignados';
            def.resolve();
        }
        res.send(G.utils.r(req.url, status.mensaje, status.codigo, {despachos_auditados: resultado}));


    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado el pedido', 500, {despachos_auditados: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  22/06/2016
 * +Descripcion Metodo encargado de invocar el modelo para mostrar el detalle de
 *              de los pedidos de un documento
 */
E008Controller.prototype.obtenerJustificaciones = function (req, res) {
    var that = this;
    var args = req.body.data;

    if (!args.movimientos_bodegas || !args.movimientos_bodegas.empresa_id) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios no estan definidos', 404, {}));
        return;
    }

    var obj = {
        empresa_id: args.movimientos_bodegas.empresa_id
    };

    G.Q.ninvoke(that.m_e008, 'obtenerJustificaciones', obj).then(function (resultado) {

        res.send(G.utils.r(req.url, "Listado de justificaciones", 200, {justificaciones: resultado}));

    }).fail(function (err) {
        console.log("err ", err);
        res.send(G.utils.r(req.url, 'Error consultado el pedido', 500, {despachos_auditados: {}}));

    }).done();

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
    that.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function (err, detalle_pedido) {
        if (err) {
            callback(err);
            return;
        } else {

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function (err, detalle_documento_temporal) {

                if (err) {
                    callback(err);
                    return;
                } else {

                    var productos_pendientes = [];
                    var productos_no_auditados = [];
                    var productosSinExistencias = [];
                    var productosPendientesInvalidos = [];

                    detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);

                    detalle_pedido.forEach(function (producto_pedido) {

                        //validar que la cantidad pendiente sea mayor a cero en ventas_ordenes_pedidos_d
                        if (producto_pedido.cantidad_pendiente_real > 0) {
                            // Producto seleccionado por el operario de bodega
                            var producto_separado = detalle_documento_temporal.filter(function (value) {
                                return producto_pedido.codigo_producto === value.codigo_producto && value.auditado === '1';
                            });

                            var cantidad_pendiente = producto_pedido.cantidad_pendiente;

                            //Verificar productos con cantidades pendientes
                            if (cantidad_pendiente < 0) {

                                productosPendientesInvalidos.push(producto_pedido);
                            } else {
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

                        }

                    });

                    callback(err, productos_no_auditados, productos_pendientes, productosSinExistencias, productosPendientesInvalidos);
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
    that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function (err, detalle_pedido) {
        if (err) {
            callback(err);
            return;
        } else {

            that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function (err, detalle_documento_temporal) {

                if (err) {
                    callback(err);
                    return;
                } else {

                    var productos_pendientes = [];
                    var productos_no_auditados = [];
                    var productosSinExistencias = [];
                    var productosPendientesInvalidos = [];

                    detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);

                    detalle_pedido.forEach(function (producto_pedido) {

                        //validar que la cantidad pendiente sea mayor a cero en ventas_ordenes_pedidos_d
                        if (producto_pedido.cantidad_pendiente_real > 0) {
                            // Producto seleccionado por el operario de bodega
                            var producto_separado = detalle_documento_temporal.filter(function (value) {
                                return producto_pedido.codigo_producto === value.codigo_producto && value.auditado === '1';
                            });


                            // var cantidad_pendiente = _obtenerCantidadPendiente(detalle_pedido,producto_pedido);
                            var cantidad_pendiente = producto_pedido.cantidad_pendiente;

                            if (cantidad_pendiente < 0) {

                                productosPendientesInvalidos.push(producto_pedido);

                            } else if (producto_separado.length === 0) {
                                // Producto que no fue separado y le falta la justificacion del auditor
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {
                                    productos_pendientes.push(producto_pedido);
                                } else if (producto_pedido.item_id > 0) {
                                    productos_no_auditados.push(producto_pedido);
                                    console.log("AAAAAAAA");

                                }
                            } else {

                                // Verificar que los productos con pendientes esten justificados po el auditor/
                                if (cantidad_pendiente > 0 && producto_pedido.justificacion_auditor === '') {
                                    productos_pendientes.push(producto_pedido);

                                } else if (producto_pedido.auditado === '0') {
                                    productos_no_auditados.push(producto_pedido);
                                    console.log("BBBBBB");

                                }

                                //Valida si los productos se han quedado sin existencias, debido al traslado de lotes
                                /* if((parseInt(producto_pedido.existencia_actual) <  parseInt(producto_pedido.cantidad_ingresada)) ||
                                 (parseInt(producto_pedido.existencia_bodega) <  parseInt(producto_pedido.cantidad_ingresada))){
                                 productosSinExistencias.push(producto_pedido);
                                 }*/
                            }
                        }
                    });

                    callback(err, productos_no_auditados, productos_pendientes, productosSinExistencias, productosPendientesInvalidos);
                    return;
                }
            });
        }
    });
}
;

function __validar_rotulos_cajas(that, documento_temporal_id, usuario_id, numero_pedido, tipoPedido, callback) {

    //Temporalmente se inactiva la funcion de cerrar las cajas
    callback(false, []);

    return;

    that.m_movimientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function (err, detalle_documento_temporal) {

        if (err) {
            callback(err);
            return;
        } else {
            var cajas_no_cerradas = [];

            var i = detalle_documento_temporal.length;

            detalle_documento_temporal.forEach(function (detalle) {

                that.m_e008.consultar_rotulo_caja(documento_temporal_id, detalle.numero_caja, numero_pedido, tipoPedido, function (err, caja_producto) {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        caja_producto.forEach(function (caja) {
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


    that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function (err, responsables) {

        if (err) {
            callback(err, continuar);
        } else {

            var responsable = responsables.filter(function (responsable) {
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

    that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function (err, responsables) {

        if (err) {
            callback(err, continuar);
        } else {

            var responsable = responsables.filter(function (data) {

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
            content: G.fs.readFileSync('app_modules/MovimientosBodega/E008/reports/despacho.html', 'utf8'),
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
            var nombreTmp = datos.encabezado.prefijo + "-" + datos.encabezado.numero + "_" + fecha.toFormat('DD-MM-YYYY') + ".html";
            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });


        });
    });
}


E008Controller.$inject = ["m_movimientos_bodegas", "m_e008", "e_e008", "m_pedidos_clientes", "m_pedidos_farmacias", "e_pedidos_clientes", "e_pedidos_farmacias", "m_terceros", "m_pedidos", "log_e008"];

module.exports = E008Controller;
