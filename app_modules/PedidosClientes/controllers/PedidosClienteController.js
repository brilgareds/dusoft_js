
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes, productos, m_pedidos, m_terceros, emails, pedidos_farmacias, m_pedidos_clientes_log) {


    this.m_pedidos_clientes = pedidos_clientes;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_clientes = eventos_pedidos_clientes;
    this.m_productos = productos;
    this.m_pedidos = m_pedidos;
    this.m_terceros = m_terceros;
    this.emails = emails;
    this.m_pedidos_clientes_log = m_pedidos_clientes_log;
};

/**
 * @api {post} /api/PedidosClientes/listarPedidos Listar Pedidos
 * @apiName Listar Pedidos Clientes
 * @apiGroup PedidosClientes
 * @apiDescription Proporciona un listado de Pedidos de Clientes, permite filtrar lo pedidos por los siguientes campos,
 * numero del pedido, identificacion o nombre del tercero, direccion, telefono, identificacion o nombre del vendedor.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiParam {Number} empresa_id Identificacion de la empresa de la cual se requieren los pedidos.
 * @apiParam {String} termino_busqueda Termino por el cual desea filtrar los pedidos.
 * @apiParam {Number} pagina_actual Numero de la pagina, requerido para la paginacion. 
 */

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.termino_busqueda === undefined || args.pedidos_clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.pedidos_clientes.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {pedidos_clientes: []}));
        return;
    }

    var empresa_id = args.pedidos_clientes.empresa_id;
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    var pagina_actual = args.pedidos_clientes.pagina_actual;
    var filtro = args.pedidos_clientes.filtro;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));
    });
};


/**
 * @api {post} /api/PedidosClientes/asignarResponsable Asignar Responsables 
 * @apiName Asignar Responsables.
 * @apiGroup PedidosClientes
 * @apiDescription Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiParam {String[]} pedidos Lista de pedidos 
 * @apiParam {Number} estado_pedido ID del estado a asignar 
 * @apiParam {Number} responsable Operario de Bodega al que se le asigna el pedido.
 * @apiSuccessExample Ejemplo Válido del Request. 
 */

PedidosCliente.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.asignacion_pedidos === undefined || args.asignacion_pedidos.pedidos === undefined || args.asignacion_pedidos.estado_pedido === undefined || args.asignacion_pedidos.responsable === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var params = args.asignacion_pedidos;

    if (params.pedidos.length === 0 || params.estado_pedido === "" || params.responsable === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var pedidos = params.pedidos;
    var estado_pedido = params.estado_pedido;
    var responsable = params.responsable;
    var usuario = req.session.user.usuario_id;

    var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows, responsable_estado_pedido) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

            if (--i === 0) {

                // Notificar que al operario los pedidos  fueron reasignados
                if (responsable_estado_pedido.length > 0) {

                    responsable_estado_pedido = responsable_estado_pedido[0];

                    if (responsable !== responsable_estado_pedido.responsable_id) {

                        that.e_pedidos_clientes.onNotificacionOperarioPedidosReasignados({numero_pedidos: pedidos, responsable: responsable_estado_pedido.responsable_id});
                    }
                }

                // Notificacion al operario de los pedidos que le fueron asignados
                that.e_pedidos_clientes.onNotificacionOperarioPedidosAsignados({numero_pedidos: pedidos, responsable: responsable});
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
            }
        });
    });
};


/**
 * @api {post} /api/PedidosClientes/asignarResponsable Asignar Responsables 
 * @apiName Asignar Responsables.
 * @apiGroup PedidosClientes
 * @apiDescription Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiParam {String[]} pedidos Lista de pedidos 
 * @apiParam {Number} estado_pedido ID del estado a asignar 
 * @apiParam {Number} responsable Operario de Bodega al que se le asigna el pedido.
 * @apiSuccessExample Ejemplo Válido del Request.  
 */

PedidosCliente.prototype.eliminarResponsablesPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido no esta definido.', 404, {}));
        return;
    }

    if (args.pedidos_clientes.numero_pedido === '' || args.pedidos_clientes.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero_pedido no puede ser 0 o vacío', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_clientes.numero_pedido;
    var estado_pedido = ''; // 0 = No asignado

    that.m_pedidos_clientes.consultar_pedido(numero_pedido, function(err, pedido_cliente) {

        if (err || pedido_cliente.length === 0) {

        } else {
            var pedido = pedido_cliente[0];

            if ((pedido.estado_actual_pedido === '0' || pedido.estado_actual_pedido === '1') && pedido.estado_separacion === null) {

                that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function(err, responsables_pedido) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 0', 500, {}));
                        return;
                    } else {

                        if (responsables_pedido === undefined || responsables_pedido.length < 2) {
                            res.send(G.utils.r(req.url, 'El Pedido no ha registrado responsables', 500, {}));
                            return;
                        }

                        that.m_pedidos_clientes.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
                                // El estado del pedido es el inmediatamnte el anterior
                                estado_pedido = responsables_pedido[1].estado;

                                that.m_pedidos_clientes.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function(err, rows, resultado) {

                                    if (err) {
                                        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 2', 500, {}));
                                        return;
                                    } else {

                                        // Notificando Pedidos Actualizados en Real Time
                                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                        // Notificar que al operario los pedidos  fueron reasignados o eliminados
                                        if (responsables_pedido.length > 0) {

                                            var responsable_estado_pedido = responsables_pedido[0];

                                            that.e_pedidos_clientes.onNotificacionOperarioPedidosReasignados({numero_pedidos: [numero_pedido], responsable: responsable_estado_pedido.responsable_id});
                                        }

                                        res.send(G.utils.r(req.url, 'El Pedido cambió de estado correctamente', 200, {}));
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'El Pedido No puede cambbiar de estado', 200, {}));
            }
        }
    });
};

/**
 * @api {post} /api/PedidosClientes/listaPedidosOperarioBodega Listar Pedidos Operarios
 * @apiName listaPedidosOperarioBodega
 * @apiGroup PedidosClientes
 * @apiDescription Proporciona una lista con todos los pedidos de clientes asignados a un operario de bodega
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiParam {Number} operario_id Identificador asignado al operario de Bodega.
 * @apiParam {Number} pagina_actual Numero de la pagina que requiere.
 * @apiParam {Number} [limite] Cantidad de registros por cada pagina.
 * @apiSuccessExample Ejemplo Válido del Request. 
 */

PedidosCliente.prototype.listaPedidosOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.operario_id === undefined || args.pedidos_clientes.pagina_actual === undefined || args.pedidos_clientes.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos_clientes.operario_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id de un operario de bodega', 404, {}));
        return;
    }
    if (args.pedidos_clientes.pagina_actual === '' || parseInt(args.pedidos_clientes.pagina_actual) <= 0) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la pagina para traer registros', 404, {}));
        return;
    }

    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    //var operario_bodega = args.pedidos_clientes.operario_id;
    var operario_bodega = req.session.user.usuario_id;
    var pagina_actual = args.pedidos_clientes.pagina_actual;
    var limite = args.pedidos_clientes.limite;
    var filtro = args.pedidos_clientes.filtro;
    var fecha_actual = new Date();
    var detalle = (args.pedidos_clientes.detalle === undefined) ? true : args.pedidos_clientes.detalle;

    this.m_pedidos_clientes.listar_pedidos_del_operario(operario_bodega, termino_busqueda, filtro, pagina_actual, limite, function(err, lista_pedidos_clientes, total_registros) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
            return;
        }


        var i = lista_pedidos_clientes.length;

        lista_pedidos_clientes.forEach(function(pedido) {

            // Calcular el tiempo de separacion del pedido
            var fecha_separacion = 0;
            var tiempo_separacion = 0;

            if (pedido.fecha_separacion_pedido) {
                fecha_separacion = new Date(pedido.fecha_separacion_pedido);
                tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);
            }

            pedido.tiempo_separacion = tiempo_separacion;

            that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function(err, detalle_pedido) {
                detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);
                pedido.lista_productos = detalle_pedido;

                if (--i === 0) {
                    res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes, total_registros: total_registros}));
                }

            });
        });

        if (lista_pedidos_clientes.length === 0)
            res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes, total_registros: total_registros}));

    });

};

/*
 * Autor : Camilo Orozco
 * Descripcion : Buscar productos para la solictid de una cotizacion o pedido
 */
PedidosCliente.prototype.listarProductosClientes = function(req, res) {


    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.empresa_id === undefined || args.pedidos_clientes.centro_utilidad_id === undefined || args.pedidos_clientes.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.contrato_cliente_id === undefined) {
        res.send(G.utils.r(req.url, 'contrato_cliente_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === undefined || args.pedidos_clientes.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina actual No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.empresa_id === '' || args.pedidos_clientes.centro_utilidad_id === '' || args.pedidos_clientes.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.contrato_cliente_id === '') {
        res.send(G.utils.r(req.url, 'contrato_cliente_id esta vacío', 404, {}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === '' || parseInt(args.pedidos_clientes.pagina_actual) <= 0) {
        res.send(G.utils.r(req.url, 'pagina_actual esta vacio o es 0', 404, {}));
        return;
    }


    var empresa_id = args.pedidos_clientes.empresa_id;
    var centro_utilidad = args.pedidos_clientes.centro_utilidad_id;
    var bodega = args.pedidos_clientes.bodega_id;
    var contrato_cliente = args.pedidos_clientes.contrato_cliente_id;

    var filtro = {
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto,
        termino_busqueda: args.pedidos_clientes.termino_busqueda,
        laboratorio_id: (args.pedidos_clientes.laboratorio_id === undefined) ? '' : args.pedidos_clientes.laboratorio_id,
        numero_cotizacion: (args.pedidos_clientes.numero_cotizacion === undefined) ? '' : args.pedidos_clientes.numero_cotizacion,
        numero_pedido: (args.pedidos_clientes.numero_pedido === undefined) ? '' : args.pedidos_clientes.numero_pedido
    };

    var filtros = args.pedidos_clientes.filtro;




    var pagina = args.pedidos_clientes.pagina_actual;

    that.m_pedidos_clientes.listar_productos(empresa_id, centro_utilidad, bodega, contrato_cliente, filtro, pagina, filtros, function(err, lista_productos) {
      
        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {lista_productos: []}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Productos', 200, {pedidos_clientes: {lista_productos: lista_productos}}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Insertar cotizacion
 */
PedidosCliente.prototype.insertarCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    // Cliente
    if (args.pedidos_clientes.cotizacion.cliente === undefined || args.pedidos_clientes.cotizacion.cliente === '') {
        res.send(G.utils.r(req.url, 'Cliente No Estan Definidos', 404, {}));
        return;
    }

    // Vendedor
    if (args.pedidos_clientes.cotizacion.vendedor === undefined || args.pedidos_clientes.cotizacion.vendedor === '') {
        res.send(G.utils.r(req.url, 'Vendedor No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    // Empresa, Centro Utilidad,  Bodega
    if (cotizacion.empresa_id === undefined || cotizacion.centro_utilidad_id === undefined || cotizacion.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }

    // Validar Cliente
    if (cotizacion.cliente.tipo_id_tercero === undefined || cotizacion.cliente.id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id, tercero_id, tipo_id_vendedor  o vendedor_id No Estan Definidos', 404, {}));
        return;
    }

    // Validar Vendedor
    if (cotizacion.vendedor.tipo_id_tercero === undefined || cotizacion.vendedor.id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor  o vendedor_id No Estan Definidos', 404, {}));
        return;
    }

    // Observaciones
    if (cotizacion.tipo_producto === undefined || cotizacion.observacion === undefined) {
        res.send(G.utils.r(req.url, 'tipo_producto u observacion No Estan Definidos', 404, {}));
        return;
    }

    // Empresa, Centro Utilidad,  Bodega
    if (cotizacion.empresa_id === '' || cotizacion.centro_utilidad_id === '' || cotizacion.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacios', 404, {}));
        return;
    }
    // Validar Cliente
    if (cotizacion.cliente.tipo_id_tercero === '' || cotizacion.cliente.id === '') {
        res.send(G.utils.r(req.url, 'tipo_id, tercero_id, tipo_id_vendedor  o vendedor_id estan vacios', 404, {}));
        return;
    }

    // Validar Vendedor
    if (cotizacion.vendedor.tipo_id_tercero === '' || cotizacion.vendedor.id === '') {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor  o vendedor_id estan vacios', 404, {}));
        return;
    }

    // Observaciones
    if (cotizacion.tipo_producto === '' || cotizacion.observacion === '') {
        res.send(G.utils.r(req.url, 'tipo_producto u observacion esta vacia', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    that.m_pedidos_clientes.insertar_cotizacion(cotizacion, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {}}));
            return;
        } else {

            var numero_cotizacion = (rows.length > 0) ? rows[0].numero_cotizacion : 0;

            res.send(G.utils.r(req.url, 'Cotizacion registrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: numero_cotizacion}}));
            return;
        }
    });
};

/*
 * Autor : Camilo Orozco
 * Descripcion : Insertar detalle cotizacion
 */
PedidosCliente.prototype.insertarDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;
    var producto = args.pedidos_clientes.producto;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.iva === undefined || producto.iva === '') {
        res.send(G.utils.r(req.url, 'iva no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.cantidad_solicitada === undefined || producto.cantidad_solicitada === '' || producto.cantidad_solicitada <= '0') {
        res.send(G.utils.r(req.url, 'cantidad_solicitada no esta definido , esta vacio o es menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;


    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
        /**
         * +Descripcion: Se valida que se haya consultado el estado de la cotizacion
         *               satisfactoriamente
         */

        if (estado) {
            /**
             * +Descripcion: Se valida si el estado de la cotizacion es 
             *               1 activo 
             *               4 activo (desaprobado por cartera)
             */

            if (rows[0].estado === '1' || rows[0].estado === '4') {

                /**
                 * +Descripcion: Se valida si la cotizacion ya cuenta con ese producto en el detalle
                 */
                that.m_pedidos_clientes.consultarProductoDetalleCotizacion(cotizacion.numero_cotizacion, producto.codigo_producto, function(estado, rows) {

                    /**
                     * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
                     */

                    if (estado) {

                        /**
                         * +Descripcion: Se valida si el producto es diferente al del detalle
                         *               y si es asi se procede a modficar el detalle
                         */

                        if (rows.length === 0) {

                            that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Producto registrado correctamente', 200, {pedidos_clientes: {}}));
                                    return;
                                }
                            });

                        } else {
                            res.send(G.utils.r(req.url, 'El producto ya aparece registrado en la cotizacion', 500, {pedidos_clientes: []}));
                            return;
                        }


                    } else {
                        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'La cotizacion debe encontrarse activa o desaprobada por cartera', 500, {pedidos_clientes: []}));
                return;
            }

        } else {
            res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Modificar detalle cotizacion
 */
PedidosCliente.prototype.modificarDetalleCotizacion = function(req, res) {


    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;
    var producto = args.pedidos_clientes.producto;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.iva === undefined || producto.iva === '') {
        res.send(G.utils.r(req.url, 'iva no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.cantidad_solicitada === undefined || producto.cantidad_solicitada === '' || producto.cantidad_solicitada <= '0') {
        res.send(G.utils.r(req.url, 'cantidad_solicitada no esta definido , esta vacio o es menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    var paramLogCliente = {
        /*cabecera:{
         cotizacion:cotizacion.numero_cotizacion,
         accion: 1,
         usuario: cotizacion.usuario_id
         },*/
        detalle: {
            cotizacion: cotizacion.numero_cotizacion,
            tipo_cotizacion_pedido: 1,
            producto: producto.codigo_producto,
            tipo_pedido: 0,
            descripcion: "descripcion(iva: " + producto.iva +
                    "| cantidad_nueva: " + producto.cantidad_solicitada +
                    "| cantidad_inicial: " + producto.cantidad_inicial +
                    "| precio_venta: " + producto.precio_venta + " )",
            accion: 1,
            usuario: cotizacion.usuario_id
        }
    };

    /**
     * +Descripcion: Se invoca un modelo encargado de insertar los registros
     * a una tabla log de seguimiento
     * @fecha: 29/09/2015
     * @author Cristian Ardila
     * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
     */
    that.m_pedidos_clientes_log.logModificarProductoCotizacion(paramLogCliente, function() {


    });

    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
        /**
         * +Descripcion: Se valida que se haya consultado el estado de la cotizacion
         *               satisfactoriamente
         */
        if (estado) {
            /**
             * +Descripcion: Se valida si el estado de la cotizacion es 
             *               1 activo 
             *               4 activo (desaprobado por cartera)
             */

            if (rows[0].estado === '1' || rows[0].estado === '4') {


                that.m_pedidos_clientes.modificar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {pedidos_clientes: {}}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'La cotizacion debe encontrarse activa o desaprobada por cartera', 500, {pedidos_clientes: []}));
                return;
            }

        } else {
            res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }

    });
};

/**
 * @author Cristian Ardila
 * +Descripcion: Controlador encargado de invocar el model que actualizara
 *               la cabecera de la cotizacion
 * @fecha  09/11/2015
 * @param {type} req
 * @param {type} res
 * @returns {unresolved}
 */
PedidosCliente.prototype.actualizarCabeceraCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }


    that.m_pedidos_clientes.actualizarCabeceraCotizacion(cotizacion, function(estado, rows) {

        if (!estado) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Observacion actualizada correctamente', 200, {pedidos_clientes: rows}));
            return;
        }
    });
};

/*
 * Author : Eduar Garcia
 * Descripcion :  Cambia el estado de una cotizacion
 */
PedidosCliente.prototype.modificarEstadoCotizacion = function(req, res) {
    var that = this;

    var args = req.body.data;
    var cotizacion = args.pedidos_clientes.cotizacion;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    G.Q.nfcall(that.m_pedidos_clientes.modificarEstadoCotizacion, cotizacion).
            then(function(rows) {
        that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
        res.send(G.utils.r(req.url, 'Cotizacion cambiada correctamente', 200, {pedidos_clientes: []}));
    }).
            fail(function(err) {

        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {pedidos_clientes: []}));
    }).
            done();

};


/*
 * Autor : Camilo Orozco
 * Descripcion : Listar Cotizaciones
 */
PedidosCliente.prototype.listarCotizaciones = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id no estan definidas', 404, {}));
        return;
    }

    if (args.pedidos_clientes.fecha_inicial === undefined || args.pedidos_clientes.fecha_final === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final no estan definidas', 404, {}));
        return;
    }

    if (args.pedidos_clientes.termino_busqueda === undefined || args.pedidos_clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.pedidos_clientes.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id estan vacia', 404, {}));
        return;
    }

    if (args.pedidos_clientes.fecha_inicial === '' || args.pedidos_clientes.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final estan vacias', 404, {}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === '' || args.pedidos_clientes.pagina_actual === 0 || args.pedidos_clientes.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }


    var empresa_id = args.pedidos_clientes.empresa_id;
    var fecha_inicial = args.pedidos_clientes.fecha_inicial;
    var fecha_final = args.pedidos_clientes.fecha_final;
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    var pagina_actual = args.pedidos_clientes.pagina_actual;

    var estadoCotizacion = args.pedidos_clientes.estado_cotizacion;

    that.m_pedidos_clientes.listar_cotizaciones(empresa_id, fecha_inicial, fecha_final, termino_busqueda, pagina_actual,estadoCotizacion, function(err, lista_cotizaciones) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {lista_cotizaciones: []}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Cotizaciones', 200, {pedidos_clientes: {lista_cotizaciones: lista_cotizaciones}}));
            return;
        }
    });
};



/**
 * @author Cristian Ardila
 * +Descripcion: Controlador encargado de invocar el model que eliminara una 
 *               cotizacion siempre y cuando esta no tenga un pedido       
 * @fecha  09/11/2015
 * @param {type} req
 * @param {type} res
 * @returns {unresolved}
 */
PedidosCliente.prototype.eliminarCotizacion = function(req, res) {


    var that = this;

    var args = req.body.data;


    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes === '') {
        res.send(G.utils.r(req.url, 'La cotizacion no esta definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'el numero de cotizacion no esta definido o esta vacío', 404, {}));
        return;
    }




    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {

        /**
         * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
         */
        if (estado) {
            /**
             * +Descripcion: Se valida si el numero de la cotizacion ya se encuentra
             *               en la tabla ventas_ordenes_pedidos
             */
            if (rows.length === 0 || rows[0].estado === '1') {

                /**
                 * +Descripcion: Se valida si ya se genero un pedido por medio de la cotizacion
                 */
                that.m_pedidos_clientes.consultaCotizacionEnPedido(cotizacion.numero_cotizacion, function(estado, rows) {
                    /**
                     * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
                     */
                    if (estado) {
                        /**
                         * +Descripcion: Se valida si el numero de la cotizacion ya se encuentra
                         *               en la tabla ventas_ordenes_pedidos
                         */
                        if (rows.length === 0) {
                            /**
                             * +Descripcion: Funcion encargada de eliminar por completo una cotizacion
                             *               junto con todo su detalle siempre y cuando no haya
                             *               generado ningun pedido
                             */
                            that.m_pedidos_clientes.eliminarDetalleCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
                                if (!estado) {
                                    res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Se elimino la cotizacion correctamente', 200, {pedidos_clientes: rows}));
                                    return;
                                }
                            });
                        } else {
                            res.send(G.utils.r(req.url, 'La cotizacion ya genero un pedido', 404, {pedidos_clientes: []}));
                            return;
                        }
                    } else {
                        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
                        return;
                    }
                });

            }else {
                    res.send(G.utils.r(req.url, 'La cotizacion solo debe estar en estado activo', 404, {pedidos_clientes: []}));
                     return;
           }
        }else {
          res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }
    });
};
/*
 * Autor : Camilo Orozco
 * Descripcion : Consultar Cotizacion
 */
PedidosCliente.prototype.consultarCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    that.m_pedidos_clientes.consultar_cotizacion(cotizacion, function(err, cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Cotizacion', 200, {pedidos_clientes: {cotizacion: cotizacion}}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Consultar Detalle Cotizacion
 */
PedidosCliente.prototype.consultarDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    var termino_busqueda = (args.pedidos_clientes.termino_busqueda === undefined) ? '' : args.pedidos_clientes.termino_busqueda;

    that.m_pedidos_clientes.consultar_detalle_cotizacion(cotizacion, termino_busqueda, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Cotizacion', 200, {pedidos_clientes: {lista_productos: lista_productos}}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Eliminar Producto Cotizacion
 */
PedidosCliente.prototype.eliminarProductoCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;
    var producto = args.pedidos_clientes.producto;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    var paramLogCliente = {
        detalle: {
            cotizacion: cotizacion.numero_cotizacion,
            tipo_cotizacion_pedido: 1,
            producto: producto.codigo_producto,
            tipo_pedido: 0,
            descripcion: "descripcion(iva: " + producto.iva +
                    "| cantidad_nueva: " + producto.cantidad_solicitada +
                    "| cantidad_inicial: " + producto.cantidad_inicial +
                    "| precio_venta: " + producto.precio_venta + " )",
            accion: 0,
            usuario: cotizacion.usuario_id
        }
    };



    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
        /**
         * +Descripcion: Se valida que se haya consultado el estado de la cotizacion
         *               satisfactoriamente
         */

        if (estado) {
            /**
             * +Descripcion: Se valida si el estado de la cotizacion es 
             *               1 activo 
             *               4 activo (desaprobado por cartera)
             */
            if (rows[0].estado === '1' || rows[0].estado === '4') {
                /**
                 * +Descripcion: Se invoca un modelo encargado de insertar los registros
                 * a una tabla log de seguimiento para cuando se quiera eliminar un producto
                 * de una cotizacion
                 * @fecha: 29/09/2015
                 * @author Cristian Ardila
                 * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
                 */
                that.m_pedidos_clientes_log.logEliminarProductoCotizacion(paramLogCliente, function() {


                });

                that.m_pedidos_clientes.eliminar_producto_cotizacion(cotizacion, producto, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Eliminando el producto', 500, {pedidos_clientes: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {pedidos_clientes: []}));
                        return;
                    }
                });


            } else {
                res.send(G.utils.r(req.url, 'Para modificar la cotizacion debe estar activa', 500, {pedidos_clientes: []}));
                return;
            }

        } else {
            res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }
    });
};



/*
 * Autor : Camilo Orozco
 * Descripcion : Cargar Archivo Plano
 */
PedidosCliente.prototype.cotizacionArchivoPlano = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    // Cliente
    if (args.pedidos_clientes.cotizacion.cliente === undefined || args.pedidos_clientes.cotizacion.cliente === '') {
        res.send(G.utils.r(req.url, 'Cliente No Estan Definidos', 404, {}));
        return;
    }

    // Vendedor
    if (args.pedidos_clientes.cotizacion.vendedor === undefined || args.pedidos_clientes.cotizacion.vendedor === '') {
        res.send(G.utils.r(req.url, 'Vendedor No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    // Empresa, Centro Utilidad,  Bodega
    if (cotizacion.empresa_id === undefined || cotizacion.centro_utilidad_id === undefined || cotizacion.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }

    // Validar Cliente
    if (cotizacion.cliente.tipo_id_tercero === undefined || cotizacion.cliente.id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id, tercero_id, tipo_id_vendedor  o vendedor_id No Estan Definidos', 404, {}));
        return;
    }

    // Validar Vendedor
    if (cotizacion.vendedor.tipo_id_tercero === undefined || cotizacion.vendedor.id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor  o vendedor_id No Estan Definidos', 404, {}));
        return;
    }

    // Observaciones
    if (cotizacion.tipo_producto === undefined || cotizacion.observacion === undefined) {
        res.send(G.utils.r(req.url, 'tipo_producto u observacion No Estan Definidos', 404, {}));
        return;
    }

    // Empresa, Centro Utilidad,  Bodega
    if (cotizacion.empresa_id === '' || cotizacion.centro_utilidad_id === '' || cotizacion.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacios', 404, {}));
        return;
    }
    // Validar Cliente
    if (cotizacion.cliente.tipo_id_tercero === '' || cotizacion.cliente.id === '') {
        res.send(G.utils.r(req.url, 'tipo_id, tercero_id, tipo_id_vendedor  o vendedor_id estan vacios', 404, {}));
        return;
    }

    // Validar Vendedor
    if (cotizacion.vendedor.tipo_id_tercero === '' || cotizacion.vendedor.id === '') {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor  o vendedor_id estan vacios', 404, {}));
        return;
    }

    // Observaciones
    if (/*cotizacion.tipo_producto === '' ||*/ cotizacion.observacion === '') {
        res.send(G.utils.r(req.url, 'observacion esta vacia', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    var cantidad_productos = 0;
    var limite_productos = 25;
    var usuario = req.session.user;



    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
        /**
         * +Descripcion: Se valida que se haya consultado el estado de la cotizacion
         *               satisfactoriamente
         */

        if (estado) {
            /**
             * +Descripcion: Se valida si el estado de la cotizacion es 
             *               1 activo 
             *               4 activo (desaprobado por cartera)
             */

            if (rows[0].estado === '1' || rows[0].estado === '4') {



                __subir_archivo_plano(req.files, function(continuar, contenido) {

                    if (!continuar) {

                        __validar_productos_archivo_plano(that, contenido, function(productos_validos, productos_invalidos) {

                            cantidad_productos = productos_validos.length;

                            if (cantidad_productos > limite_productos) {

                                res.send(G.utils.r(req.url, 'Lista de Productos excede el limite permitido 25 productos por pedido ', 400, {pedidos_clientes: {}}));
                                return;
                            }

                            __validar_datos_productos_archivo_plano(that, cotizacion, productos_validos, function(_productos_validos, _productos_invalidos) {

                                if (_productos_validos.length === 0) {
                                    res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedidos_clientes: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                    return;
                                }

                                // Validar que si suben varios archivos, siempre se limite la cantidad de productos a ingresar ala cotizacion
                                that.m_pedidos_clientes.consultar_detalle_cotizacion(cotizacion, '', function(err, lista_productos) {

                                    cantidad_productos = lista_productos.length;

                                    if (cantidad_productos > limite_productos) {


                                        res.send(G.utils.r(req.url, 'Lista de Productos excede el limite permitido 25 productos por pedido ', 400, {pedidos_clientes: {}}));
                                        return;
                                    }

                                    __agrupar_productos_por_tipo(that, productos_validos, function(productos_agrupados) {

                                        cotizacion.tipo_producto = (cotizacion.tipo_producto === '') ? Object.keys(productos_agrupados)[0] : cotizacion.tipo_producto;

                                        _productos_validos = productos_agrupados[cotizacion.tipo_producto];

                                        if (_productos_validos === undefined || _productos_validos.length === 0) {
                                            res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedidos_clientes: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                            return;
                                        }

                                        var i = _productos_validos.length;
                                        var index = 1;
                                        var cantidad = _productos_validos.length;

                                        if (cotizacion.numero_cotizacion === 0) {
                                            //Crear cotizacion e insertar productos
                                            that.m_pedidos_clientes.insertar_cotizacion(cotizacion, function(err, rows, result) {

                                                if (err) {
                                                    res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {}}));
                                                    return;
                                                } else {

                                                    cotizacion.numero_cotizacion = (rows.length > 0) ? rows[0].numero_cotizacion : 0;
                                                    __insertarDetalleCotizacion(that, 0, usuario, cotizacion, _productos_validos, _productos_invalidos, function() {

                                                        res.send(G.utils.r(req.url, 'Cotizacion registrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: cotizacion.numero_cotizacion, productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                                        return;
                                                    });
                                                }
                                            });
                                        } else {
                                            // Insertar productos a la cotizacion

                                            __insertarDetalleCotizacion(that, 0, usuario, cotizacion, _productos_validos, _productos_invalidos, function() {

                                                res.send(G.utils.r(req.url, 'Cotizacion registrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: cotizacion.numero_cotizacion, productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                                return;
                                            });

                                        }
                                    });
                                });
                            });
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Error subiendo el archivo plano', 404, {}));
                        return;
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'La cotizacion debe encontrarse activa o desaprobada por cartera', 500, {pedidos_clientes: []}));
                return;
            }
        } else {
            res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }
    });
};


function __insertarDetalleCotizacion(that, index, usuario, cotizacion, _productos_validos, _productos_invalidos, callback) {

    var producto = _productos_validos[index];

    if (!producto) {
        callback(false, _productos_validos, _productos_invalidos);
        return;
    }

    that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {
        if (err) {
            _productos_invalidos.push(producto);
        }

        index++;
        var porcentaje = (index * 100) / _productos_validos.length;
        that.e_pedidos_clientes.onNotificarProgresoArchivoPlanoClientes(usuario, porcentaje, function() {

            setTimeout(function() {

                __insertarDetalleCotizacion(that, index, usuario, cotizacion, _productos_validos, _productos_invalidos, callback);
            }, 300);
        });

    });
}

/*
 * Autor : Camilo Orozco
 * Descripcion : Generar las observaciones ingresadas por el area de cartera
 */
PedidosCliente.prototype.observacionCarteraCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (cotizacion.aprobado_cartera === undefined || cotizacion.aprobado_cartera === '') {
        res.send(G.utils.r(req.url, 'aprobado_cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    if (cotizacion.observacion_cartera === undefined || cotizacion.observacion_cartera === '') {
        res.send(G.utils.r(req.url, 'observacion_cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    that.m_pedidos_clientes.observacion_cartera_cotizacion(cotizacion, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
            res.send(G.utils.r(req.url, 'Observacion registrada correctamente', 200, {pedidos_clientes: {}}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar Reporte PDF de contizaciones y enviar por email
 */
PedidosCliente.prototype.reporteCotizacion = function(req, res) {


    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.pedidos_clientes.enviar_email !== undefined) {

        if (args.pedidos_clientes.emails === undefined || args.pedidos_clientes.subject === undefined || args.pedidos_clientes.message === undefined) {
            res.send(G.utils.r(req.url, 'emails, subject o message no esta definidas', 404, {}));
            return;
        }

        if (args.pedidos_clientes.emails.length === 0 || args.pedidos_clientes.subject === '') {
            res.send(G.utils.r(req.url, 'emails, subject o message estan vacios', 404, {}));
            return;
        }

        var emails = args.pedidos_clientes.emails;
        var subject = args.pedidos_clientes.subject;
        var message = args.pedidos_clientes.message;
    }

    var enviar_email = args.pedidos_clientes.enviar_email;

    that.m_pedidos_clientes.consultar_cotizacion(cotizacion, function(err, datos_cotizacion) {

        if (err || datos_cotizacion.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno consultado la cotizacion', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.m_pedidos_clientes.consultar_detalle_cotizacion(cotizacion, '', function(err, lista_productos) {

                if (err || lista_productos.length === 0) {
                    res.send(G.utils.r(req.url, 'Error Interno consultado el detalle de la cotizacion', 500, {pedidos_clientes: []}));
                    return;
                }

                datos_cotizacion = datos_cotizacion[0];

                var subTotal = 0;
                var total = 0;

                /**
                 * +Descripcion: Se totaliza el valor de total de los productos
                 *               con iva y sin iva
                 */
                for (var i = 0; i < lista_productos.length; i++) {

                    subTotal += parseFloat(lista_productos[i].subtotal);
                    total += parseFloat(lista_productos[i].total);


                }

                var datos_reporte = {
                    cotizacion: datos_cotizacion,
                    lista_productos: lista_productos,
                    usuario_imprime: req.session.user.nombre_usuario,
                    serverUrl: req.protocol + '://' + req.get('host') + "/",
                    total_sin_iva: subTotal,
                    total_con_iva: total
                };


                _generar_reporte_cotizacion(datos_reporte, function(nombre_reporte) {

                    if (enviar_email) {

                        var path = G.dirname + "/public/reports/" + nombre_reporte;
                        var filename = "CotizacionNo-" + cotizacion.numero_cotizacion + '.pdf';

                        __enviar_correo_electronico(that, emails, path, filename, subject, message, function(enviado) {

                            if (!enviado) {
                                res.send(G.utils.r(req.url, 'Se genero un error al enviar el reporte', 500, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                                return;
                            } else {
                                res.send(G.utils.r(req.url, 'Reporte enviado correctamente', 200, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                                return;
                            }
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Nombre Reporte', 200, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                        return;
                    }
                });

            });
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Consultar Pedido
 */
PedidosCliente.prototype.consultarPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;

    if (pedido.numero_pedido === undefined || pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido no esta definido o esta vacio', 404, {}));
        return;
    }

    that.m_pedidos_clientes.consultar_pedido(pedido.numero_pedido, function(err, datos_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Pedido', 200, {pedidos_clientes: {pedido: datos_pedido}}));
            return;
        }
    });
};

/*
 * Autor : Camilo Orozco
 * Descripcion : Consultar Detalle Pedido
 */
PedidosCliente.prototype.consultarDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;

    if (pedido.numero_pedido === undefined || pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido no esta definido o esta vacio', 404, {}));
        return;
    }

    var termino_busqueda = (args.pedidos_clientes.termino_busqueda === undefined) ? '' : args.pedidos_clientes.termino_busqueda;

    that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Productos', 200, {pedidos_clientes: {lista_productos: lista_productos}}));
            return;
        }
    });
};

/*
 * Autor : Camilo Orozco
 * Descripcion : Generar Pedido
 */
PedidosCliente.prototype.generarPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    /**
     * +Descripcion: Funcion encargada de verificar si el numero de cotizacion
     *               ya tiene un pedido asignado
     */
    that.m_pedidos_clientes.consultarExistenciaPedidoCotizacion(cotizacion.numero_cotizacion, function(estadoExistenciaPedido, rowsExistenciaPedido) {
        /**
         * +Descripcion: Se valida que la consulta se ejecute satisfactoriamente 
         */

        if (estadoExistenciaPedido) {
            /**
             * +Descripcion: Se valida si el numero de cotizacion se encuentra
             *               en la tabla de pedidos
             */

            if (rowsExistenciaPedido.length === 0) {

                /**
                 * +Descripcion: FUncion encargada de verificar el estado de una cotizacion
                 */
                that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function(estado, rows) {
                    /**
                     * +Descripcion: Se valida que se haya consultado el estado de la cotizacion
                     *               satisfactoriamente
                     */
                    if (estado) {
                        /**
                         * +Descripcion: Se valida si el estado de la cotizacion es 3 (aprobado por cartera)
                         */
                        if (rows[0].estado === '3') {

                            // Generar pedido
                            that.m_pedidos_clientes.generar_pedido_cliente(cotizacion, function(err, rows, pedido) {

                                if (!err) {
                                    res.send(G.utils.r(req.url, 'Error Interno al generar el pedido', 500, {pedidos_clientes: []}));
                                    return;
                                } else {

                                    // Asignar responsables
                                    that.m_pedidos_clientes.asignar_responsables_pedidos(pedido.numero_pedido, pedido.estado, null, cotizacion.usuario_id, function(err, rows, responsable_estado_pedido) {

                                        if (err) {
                                            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Responsables', 500, {pedidos_clientes: []}));
                                            return;
                                        }

                                        // Actualizar estado del nuevo pedido
                                        that.m_pedidos_clientes.terminar_estado_pedido(pedido.numero_pedido, [pedido.estado], '1', function(err, rows, results) {

                                            if (err) {
                                                res.send(G.utils.r(req.url, 'Error finalizando el estado del pedido', 500, {pedidos_clientes: []}));
                                                return;
                                            }

                                            that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
                                            res.send(G.utils.r(req.url, 'Pedido Generado Correctamente No. ' + pedido.numero_pedido, 200, {pedidos_clientes: pedido}));
                                            return;
                                        });
                                    });
                                }
                            });

                        } else {
                            res.send(G.utils.r(req.url, 'La cotizacion no se encuentra aprobada por cartera', 500, {pedidos_clientes: []}));
                            return;
                        }

                    } else {
                        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
                        return;
                    }//estado consultarEstadoCotizacion

                });

            } else {
                res.send(G.utils.r(req.url, 'La cotizacion ya se encuentra con un pedido asignado', 500, {pedidos_clientes: []}));
                return;
            }//rowsExistenciaPedido*/

        } else {
            res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
            return;
        }//estadoExistenciaPedido


    });//consultarExistenciaPedidoCotizacion
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Insertar detalle pedido
 */
PedidosCliente.prototype.insertarDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    var producto = args.pedidos_clientes.producto;

    if (pedido.numero_cotizacion === undefined || pedido.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.iva === undefined || producto.iva === '') {
        res.send(G.utils.r(req.url, 'iva no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.cantidad_solicitada === undefined || producto.cantidad_solicitada === '' || producto.cantidad_solicitada <= '0') {
        res.send(G.utils.r(req.url, 'cantidad_solicitada no esta definido , esta vacio o es menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    pedido.usuario_id = req.session.user.usuario_id;


    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los 
     *               productos o añadirle mas productos a un pedido el total es 
     *               mayor > igual = ó menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);


    that.m_pedidos_clientes.consultarEstadoPedidoEstado(numeroPedido, function(estado, rows) {


        if (estado) {

            if (rows[0].estado === '1' && rows[0].estado_pedido === '0' ||
                    rows[0].estado === '4' && rows[0].estado_pedido === '0') {

                that.m_pedidos_clientes.consultarTotalValorPedidoCliente(numeroPedido, function(resultado, estado) {

                    if (estado) {

                        var totalValorPedidoActual = resultado[0].valor_total_cotizacion;
                        var estado_pedido = 0;
                        if (totalValorPedidoNuevo > totalValorPedidoActual) {
                            estado_pedido = 4;
                        } else {
                            estado_pedido = 1;
                        }
                        /**
                         * +Descripcion: Se valida si el pedido ya cuenta con ese producto en el detalle
                         */
                        that.m_pedidos_clientes.consultarProductoDetallePedido(pedido.numero_pedido, producto.codigo_producto, function(estado, rows) {

                            /**
                             * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
                             */

                            if (estado) {

                                /**
                                 * +Descripcion: Se valida si el producto es diferente al del detalle
                                 *               y si es asi se procede a modficar el detalle
                                 */

                                if (rows.length === 0) {


                                    /**
                                     * +Descripcion: la funcion insertar_detalle_pedido no se encuentra en el proyecto
                                     *               por lo cual se crea la funcion insertarDetallePedido
                                     */
                                    that.m_pedidos_clientes.insertarDetallePedido(pedido, producto, function(err, rows, result) {

                                        if (err || result.rowCount === 0) {
                                            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                                            return;
                                        } else {

                                            pedido.aprobado_cartera = '0';
                                            pedido.observacion_cartera = '';


                                            that.m_pedidos_clientes.actualizarEstadoPedido(pedido, estado_pedido, function(err, rows, result) {

                                                if (err || result.rowCount === 0) {
                                                    res.send(G.utils.r(req.url, 'Error actualizando la observacion de cartera', 500, {pedidos_clientes: []}));
                                                    return;
                                                } else {
                                                    that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
                                                    res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {pedidos_clientes: {}}));
                                                    return;
                                                }
                                            });

                                        }
                                    });

                                } else {
                                    res.send(G.utils.r(req.url, 'El producto ya aparece registrado en el pedido', 500, {pedidos_clientes: []}));
                                    return;
                                }
                            } else {
                                res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {pedidos_clientes: []}));
                                return;
                            }
                        });

                    } else {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'El pedido debe estar activo o para autorizar nuevamente por cartera', 500, {pedidos_clientes: []}));
                return;
            }

        } else {
            res.send(G.utils.r(req.url, 'Error interno', 500, {pedidos_clientes: []}));

            return;
        }


    });

};



/**
 * @author: Cristian Ardila
 * +Descripcion: Funcion encargada de invocar el modelo que consultara el estado
 *               de un pedido, enviando como parametro el numero de pedido
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PedidosCliente.prototype.consultarEstadoPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    var numeroPedido = args.pedidos_clientes.pedido;
    that.m_pedidos_clientes.consultarEstadoPedido(numeroPedido, function(estado, rows) {

        if (estado) {
            res.send(G.utils.r(req.url, 'Consultando estado del pedido', 200, {pedidos_clientes: rows[0].estado}));
            return;
        }
        else {
            res.send(G.utils.r(req.url, '', 500, {pedidos_clientes: []}));

            return;
        }

    });
};
/**
 * @author Cristian Ardila
 * @fecha 09/11/2015
 * +Descripcion: COntrolador encargado de actualizar el estado de la cotizacion
 *               para solicitar aprobacion por cartera
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PedidosCliente.prototype.solicitarAutorizacion = function(req, res) {

    var that = this;

    var args = req.body.data;
    var cotizacion = args.pedidos_clientes.cotizacion;


    that.m_pedidos_clientes.solicitarAutorizacion(cotizacion, function(estado, rows) {


        if (estado) {

            res.send(G.utils.r(req.url, 'Se cambia el estado de la cotizacion', 200, {pedidos_clientes: []}));
            that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numeroCotizacion);
            return;
        }
        else {

            res.send(G.utils.r(req.url, '', 500, {pedidos_clientes: []}));

            return;
        }

    });
};


/**
 * @author: Cristian Ardila
 * +Descripcion: Funcion encargada de invocar el modelo que consultara el estado
 *               de un pedido, enviando como parametro el numero de pedido
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PedidosCliente.prototype.consultarEstadoCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    var numeroCotizacion = args.pedidos_clientes.cotizacion;

    that.m_pedidos_clientes.consultarEstadoCotizacion(numeroCotizacion, function(estado, rows) {

        if (estado) {
            res.send(G.utils.r(req.url, 'Consultando estado de la cotizacion', 200, {pedidos_clientes: rows[0].estado}));
            return;
        }
        else {
            res.send(G.utils.r(req.url, '', 500, {pedidos_clientes: []}));
            return;
        }

    });
};
/*
 * Autor : Camilo Orozco
 * Descripcion : Modificar detalle pedido
 */
PedidosCliente.prototype.modificarDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    var producto = args.pedidos_clientes.producto;

    if (pedido.numero_cotizacion === undefined || pedido.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.iva === undefined || producto.iva === '') {
        res.send(G.utils.r(req.url, 'iva no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.cantidad_solicitada === undefined || producto.cantidad_solicitada === '' || producto.cantidad_solicitada <= '0') {
        res.send(G.utils.r(req.url, 'cantidad_solicitada no esta definido , esta vacio o es menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    pedido.usuario_id = req.session.user.usuario_id;

    var paramLogCliente = {
        detalle: {
            cotizacion: pedido.numero_cotizacion,
            tipo_cotizacion_pedido: 0,
            producto: producto.codigo_producto,
            tipo_pedido: 0,
            descripcion: "descripcion(iva: " + producto.iva +
                    "| cantidad_nueva: " + producto.cantidad_solicitada +
                    "| cantidad_inicial: " + producto.cantidad_inicial +
                    "| precio_venta: " + producto.precio_venta + " )",
            accion: 1,
            usuario: pedido.usuario_id
        }
    };

    /**
     * +Descripcion: Se invoca un modelo encargado de insertar los registros
     * a una tabla log de seguimiento cuando se modifica un pedido
     * @fecha: 29/09/2015
     * @author Cristian Ardila
     * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
     */
    that.m_pedidos_clientes_log.logModificarProductoCotizacion(paramLogCliente, function() {


    });

    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los 
     *               productos o añadirle mas productos a un pedido el total es 
     *               mayor > igual = ó menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);


    that.m_pedidos_clientes.consultarEstadoPedidoEstado(numeroPedido, function(estado, rows) {

        if (estado) {

            if (rows[0].estado === '1' && rows[0].estado_pedido === '0' ||
                    rows[0].estado === '4' && rows[0].estado_pedido === '0') {

                that.m_pedidos_clientes.consultarTotalValorPedidoCliente(numeroPedido, function(resultado, estado) {

                    if (estado) {

                        var totalValorPedidoActual = resultado[0].valor_total_cotizacion;
                        var estado_pedido = 0;

                        if (totalValorPedidoNuevo > totalValorPedidoActual) {
                            estado_pedido = 4;
                        } else {
                            estado_pedido = 1;
                        }

                        that.m_pedidos_clientes.modificar_detalle_pedido(pedido, producto, function(err, rows, result) {

                            if (err || result.rowCount === 0) {
                                res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                                return;
                            } else {

                                pedido.aprobado_cartera = '0';
                                pedido.observacion_cartera = '';


                                that.m_pedidos_clientes.actualizarEstadoPedido(pedido, estado_pedido, function(err, rows, result) {

                                    if (err || result.rowCount === 0) {
                                        res.send(G.utils.r(req.url, 'Error actualizando la observacion de cartera', 500, {pedidos_clientes: []}));
                                        return;
                                    } else {
                                        that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
                                        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {pedidos_clientes: {}}));
                                        return;
                                    }
                                });

                            }
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {}}));
                        return;
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'El pedido debe estar activo o para autorizar nuevamente por cartera', 500, {pedidos_clientes: []}));
                return;
            }
        } else {
            res.send(G.utils.r(req.url, 'Error interno', 500, {pedidos_clientes: []}));
            return;
        }

    });

};


/**
 * @author Cristian Ardila
 * +Descripcion: Metodo encargado de totalizar la cantidad de los productos 
 *               ingresada nuevamente por parte del cliente
 * @fecha: 06/11/2015
 * @param {type} pedido
 * @returns {Number}
 */
function __totalNuevoPrecioVenta(pedido) {


    var productos = pedido.productos;
    var totalPrecioVenta = 0;

    for (var i = 0; i < productos.length; i++) {
        totalPrecioVenta += parseFloat(productos[i].precio_venta) * parseInt(productos[i].cantidad_solicitada);

    }

    return parseFloat(totalPrecioVenta.toFixed(2));
}

/*
 * Autor : Camilo Orozco
 * Descripcion : Eliminar Producto Pedido
 * +Modificacion: Se modifica la funcion eliminarProductoPedido con el objetivo
 *                de cambiar el estado de un pedido cuando se elimine un producto
 *                
 */
PedidosCliente.prototype.eliminarProductoPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    // Producto 
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'productos no estan definidos o vacios', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    var producto = args.pedidos_clientes.producto;

    if (pedido.numero_cotizacion === undefined || pedido.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === undefined || producto.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'codigo_producto no esta definido o esta vacio', 404, {}));
        return;
    }
    pedido.usuario_id = req.session.user.usuario_id;
    var paramLogCliente = {
        detalle: {
            cotizacion: pedido.numero_cotizacion,
            tipo_cotizacion_pedido: 0,
            producto: producto.codigo_producto,
            tipo_pedido: 0,
            descripcion: "descripcion(iva: " + producto.iva +
                    "| cantidad_nueva: " + producto.cantidad_solicitada +
                    "| cantidad_inicial: " + producto.cantidad_inicial +
                    "| precio_venta: " + producto.precio_venta + " )",
            accion: 0,
            usuario: pedido.usuario_id
        }
    };


    /**
     * +Descripcion: Se invoca un modelo encargado de insertar los registros
     * a una tabla log de seguimiento para cuando se quiera eliminar un producto
     * de una cotizacion o un pedido
     * @fecha: 29/09/2015
     * @author Cristian Ardila
     * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
     */
    that.m_pedidos_clientes_log.logEliminarProductoCotizacion(paramLogCliente, function() {


    });
    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los 
     *               productos o añadirle mas productos a un pedido el total es 
     *               mayor > igual = ó menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);


    that.m_pedidos_clientes.consultarEstadoPedidoEstado(numeroPedido, function(estado, rows) {

        if (estado) {

            if (rows[0].estado === '1' && rows[0].estado_pedido === '0' ||
                    rows[0].estado === '4' && rows[0].estado_pedido === '0') {


                that.m_pedidos_clientes.consultarTotalValorPedidoCliente(numeroPedido, function(resultado, estado) {

                    if (estado) {

                        var totalValorPedidoActual = resultado[0].valor_total_cotizacion;
                        var estado_pedido = 0;


                        if (totalValorPedidoNuevo > totalValorPedidoActual) {
                            estado_pedido = 4;
                        } else {
                            estado_pedido = 1;
                        }

                        that.m_pedidos_clientes.eliminar_producto_pedido(pedido, producto, function(err, rows, result) {

                            if (err || result.rowCount === 0) {
                                res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                                return;
                            } else {

                                pedido.aprobado_cartera = '0';
                                pedido.observacion_cartera = '';


                                that.m_pedidos_clientes.actualizarEstadoPedido(pedido, estado_pedido, function(err, rows, result) {

                                    if (err || result.rowCount === 0) {
                                        res.send(G.utils.r(req.url, 'Error actualizando la observacion de cartera', 500, {pedidos_clientes: []}));
                                        return;
                                    } else {

                                        that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
                                        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {pedidos_clientes: {}}));
                                        return;
                                    }
                                });

                            }
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'El pedido debe estar activo o para autorizar nuevamente por cartera', 500, {pedidos_clientes: []}));
                return;
            }

        } else {
            res.send(G.utils.r(req.url, 'Error interno', 500, {pedidos_clientes: []}));

            return;
        }

    });
};


/*
 * @author : Camilo Orozco
 * +Descripcion : Generar las observaciones ingresadas por el area de cartera
 * +Modificacion: Se reemplaza la funcion observacion_cartera_pedido por
 *               actualizarPedidoCarteraEstadoNoAsigando con el proposito de
 *               actualizar el estado del pedido a 1
 * @fecha: 05/11/15
 */
PedidosCliente.prototype.observacionCarteraPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;

    if (pedido.numero_pedido === undefined || pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido no esta definido o esta vacio', 404, {}));
        return;
    }

    if (pedido.aprobado_cartera === undefined || pedido.aprobado_cartera === '') {
        res.send(G.utils.r(req.url, 'aprobado_cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    if (pedido.observacion_cartera === undefined || pedido.observacion_cartera === '') {
        res.send(G.utils.r(req.url, 'observacion_cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    that.m_pedidos_clientes.actualizarPedidoCarteraEstadoNoAsigando(pedido, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Observacion registrada correctamente', 200, {pedidos_clientes: {}}));
            return;
        }
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar Reporte PDF de Pedido y enviar por email
 */
PedidosCliente.prototype.reportePedido = function(req, res) {


    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;

    if (pedido.numero_cotizacion === undefined || pedido.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_pedido no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.pedidos_clientes.enviar_email !== undefined) {

        if (args.pedidos_clientes.emails === undefined || args.pedidos_clientes.subject === undefined || args.pedidos_clientes.message === undefined) {
            res.send(G.utils.r(req.url, 'emails, subject o message no esta definidas', 404, {}));
            return;
        }

        if (args.pedidos_clientes.emails.length === 0 || args.pedidos_clientes.subject === '') {
            res.send(G.utils.r(req.url, 'emails, subject o message estan vacios', 404, {}));
            return;
        }

        var emails = args.pedidos_clientes.emails;
        var subject = args.pedidos_clientes.subject;
        var message = args.pedidos_clientes.message;
    }

    var enviar_email = args.pedidos_clientes.enviar_email;

    that.m_pedidos_clientes.consultar_pedido(pedido.numero_pedido, function(err, datos_pedido) {

        if (err || datos_pedido.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno consultado la cotizacion', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function(err, lista_productos) {

                if (err || lista_productos.length === 0) {
                    res.send(G.utils.r(req.url, 'Error Interno consultado el detalle del pedido', 500, {pedidos_clientes: []}));
                    return;
                }

                datos_pedido = datos_pedido[0];

                var subTotal = 0;
                var total = 0;

                /**
                 * +Descripcion: Se totaliza el valor de total de los productos
                 *               con iva y sin iva
                 */
                for (var i = 0; i < lista_productos.length; i++) {

                    subTotal += parseFloat(lista_productos[i].subtotal);
                    total += parseFloat(lista_productos[i].total);


                }


                var datos_reporte = {
                    pedido: datos_pedido,
                    lista_productos: lista_productos,
                    usuario_imprime: req.session.user.nombre_usuario,
                    serverUrl: req.protocol + '://' + req.get('host') + "/",
                    total_sin_iva: subTotal,
                    total_con_iva: total
                };

                _generar_reporte_pedido(datos_reporte, function(nombre_reporte) {

                    if (enviar_email) {

                        var path = G.dirname + "/public/reports/" + nombre_reporte;
                        var filename = "PedidoNo-" + pedido.numero_cotizacion + '.pdf';

                        __enviar_correo_electronico(that, emails, path, filename, subject, message, function(enviado) {

                            if (!enviado) {
                                res.send(G.utils.r(req.url, 'Se genero un error al enviar el reporte', 500, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                                return;
                            } else {
                                res.send(G.utils.r(req.url, 'Reporte enviado correctamente', 200, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                                return;
                            }
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Nombre Reporte', 200, {pedidos_clientes: {nombre_reporte: nombre_reporte}}));
                        return;
                    }
                });

            });
        }
    });
};


/*
 * ==============================================================
 * FUNCIONES PRIVADAS
 * =============================================================
 */

/*
 * Autor : Camilo Orozco
 * Descripcion : Cargar Archivo Plano
 */
function __subir_archivo_plano(files, callback) {

    var ruta_tmp = files.file.path;
    var ext = G.path.extname(ruta_tmp);
    var nombre_archivo = G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_temporal + nombre_archivo;

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, ruta_tmp, ruta_nueva).
                then(function() {
            return  G.Q.nfcall(G.fs.unlink, ruta_tmp);
        }).
                then(function() {
            var parser = G.XlsParser;
            var workbook = parser.readFile(ruta_nueva);
            var filas = G.XlsParser.serializar(workbook, ['codigo', 'cantidad']);

            if (!filas) {
                callback(true);
                return;
            } else {
                G.fs.unlinkSync(ruta_nueva);
                callback(false, filas);
            }
        }).
                fail(function(err) {
            G.fs.unlinkSync(ruta_nueva);
            callback(true);
        }).
                done();

    } else {
        callback(true);
    }
}
;


/*
 * Autor : Camilo Orozco
 * Descripcion : Validar que los códigos de los productos del archivo plano sean validos.
 */
function __validar_productos_archivo_plano(contexto, filas, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];
    var i = filas.length;

    filas.forEach(function(row) {
        var codigo_producto = row.codigo || '';
        var cantidad_solicitada = row.cantidad || 0;

        that.m_productos.validar_producto(codigo_producto, function(err, existe_producto) {


            var producto = {codigo_producto: codigo_producto, cantidad_solicitada: cantidad_solicitada};

            if (existe_producto.length > 0 && cantidad_solicitada > 0) {

                producto.tipoProductoId = existe_producto[0].tipo_producto_id;
                producto.descripcion = existe_producto[0].descripcion_producto;
                productos_validos.push(producto);

            } else {
                producto.mensajeError = "No existe en inventario";
                producto.existeInventario = false;
                productos_invalidos.push(producto);
            }

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });

}
;



/*
 * Autor : Camilo Orozco
 * Descripcion : Validar que los datos de los productos esten correctos y completos
 */
function __validar_datos_productos_archivo_plano(contexto, cotizacion, productos, callback) {

    var that = contexto;
    var productos_validos = [];
    var productos_invalidos = [];

    var i = productos.length;

    if (productos.length === 0) {
        callback(productos_validos, productos_invalidos);
        return;
    }

    productos.forEach(function(row) {

        var codigo_producto = row.codigo_producto;

        var filtro = {numero_cotizacion: cotizacion.numero_cotizacion, termino_busqueda: codigo_producto};

        that.m_pedidos_clientes.listar_productos(cotizacion.empresa_id, cotizacion.centro_utilidad_id, cotizacion.bodega_id, cotizacion.cliente.contrato_id, filtro, 1, function(err, lista_productos) {

            if (err || lista_productos.length === 0) {
                productos_invalidos.push(row);
            } else {
                var producto = lista_productos[0];
                row.iva = producto.iva;
                row.precio_venta = producto.precio_producto;
                row.tipo_producto = producto.tipo_producto_id;
                productos_validos.push(row);
            }

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });
}
;


/*
 * Autor : Camilo Orozco
 * Descripcion : Separar productos segun sea su tipo ej. Normales, Alto Costo, Controlados etc.
 */
function __agrupar_productos_por_tipo(contexto, productos, callback) {

    var that = contexto;
    var productos_validos = [];
    var productos_invalidos = [];

    if (productos.length === 0) {
        callback(productos_validos, productos_invalidos);
        return;
    }

    var productos_agrupados = {};

    productos.forEach(function(row) {
        if (productos_agrupados[row.tipo_producto]) {
            productos_agrupados[row.tipo_producto].push(row);
        } else {
            productos_agrupados[row.tipo_producto] = [row];
        }
    });

    callback(productos_agrupados);
}
;


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar reporte decotizaciones
 */
function _generar_reporte_cotizacion(rows, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PedidosClientes/reports/cotizacion.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/PedidosClientes/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            cotizacion: rows.cotizacion,
            lista_productos: rows.lista_productos,
            fecha_actual: new Date().toFormat('DD/MM/YYYY HH24:MI:SS'),
            usuario_imprime: rows.usuario_imprime,
            serverUrl: rows.serverUrl,
            total_sin_iva: rows.total_sin_iva,
            total_con_iva: rows.total_con_iva
        }
    }, function(err, response) {

        response.body(function(body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function(err) {

                if (err) {
                    console.log('=== Se ha generado un error generando el reporte de cotizaciones ====');
                } else {
                    callback(nombre_reporte);
                }
            });

        });
    });
}


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar reporte decotizaciones
 */
function _generar_reporte_pedido(rows, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PedidosClientes/reports/pedido.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/PedidosClientes/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            pedido: rows.pedido,
            lista_productos: rows.lista_productos,
            fecha_actual: new Date().toFormat('DD/MM/YYYY HH24:MI:SS'),
            usuario_imprime: rows.usuario_imprime,
            serverUrl: rows.serverUrl,
            total_sin_iva: rows.total_sin_iva,
            total_con_iva: rows.total_con_iva
        }
    }, function(err, response) {

        response.body(function(body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function(err) {

                if (err) {
                    console.log('=== Se ha generado un error generando el reporte de cotizaciones ====');
                } else {
                    callback(nombre_reporte);
                }
            });

        });
    });
}

/*
 * Autor : Camilo Orozco
 * Descripcion : Enviar correos electronicos
 */
function __enviar_correo_electronico(that, to, ruta_archivo, nombre_archivo, subject, message, callback) {

    // var smtpTransport = that.emails.createTransport('direct', {debug: true});
    var smtpTransport = that.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_user,
            pass: G.settings.email_password
        }
    });

    var settings = {
        from: G.settings.email_sender,
        to: to,
        subject: subject,
        html: message,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function(error, response) {

        if (error) {
            callback(false);
            return;
        } else {
            smtpTransport.close();
            callback(true);
            return;
        }
    });
}
;

PedidosCliente.$inject = ["m_pedidos_clientes",
    "e_pedidos_clientes",
    "m_productos",
    "m_pedidos",
    "m_terceros",
    "emails",
    "m_pedidos_farmacias", "m_pedidos_clientes_log"];

module.exports = PedidosCliente;
