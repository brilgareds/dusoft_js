
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes, productos, m_pedidos, m_terceros, emails, pedidos_farmacias) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_clientes = eventos_pedidos_clientes;
    this.m_productos = productos;
    this.m_pedidos = m_pedidos;
    this.m_terceros = m_terceros;
    this.emails = emails;
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
        numero_cotizacion: (args.pedidos_clientes.numero_cotizacion === undefined) ? '' : args.pedidos_clientes.numero_cotizacion
    };
    var pagina = args.pedidos_clientes.pagina_actual;

    that.m_pedidos_clientes.listar_productos(empresa_id, centro_utilidad, bodega, contrato_cliente, filtro, pagina, function(err, lista_productos) {
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

            res.send(G.utils.r(req.url, 'Cotizacion regitrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: numero_cotizacion}}));
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

    that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto regitrado correctamente', 200, {pedidos_clientes: {}}));
            return;
        }
    });
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

    that.m_pedidos_clientes.listar_cotizaciones(empresa_id, fecha_inicial, fecha_final, termino_busqueda, pagina_actual, function(err, lista_cotizaciones) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {lista_cotizaciones: []}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Cotizaciones', 200, {pedidos_clientes: {lista_cotizaciones: lista_cotizaciones}}));
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

    that.m_pedidos_clientes.eliminar_producto_cotizacion(cotizacion, producto, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Eliminando el producto', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {pedidos_clientes: []}));
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

    __subir_archivo_plano(req.files, function(continuar, contenido) {

        if (continuar) {

            __validar_productos_archivo_plano(that, contenido, function(productos_validos, productos_invalidos) {

                cantidad_productos = productos_validos.length;

                if (cantidad_productos >= limite_productos) {
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

                        cantidad_productos += lista_productos.length;

                        if (cantidad_productos >= limite_productos) {
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

                            if (cotizacion.numero_cotizacion === 0) {
                                //Crear cotizacion e insertar productos
                                that.m_pedidos_clientes.insertar_cotizacion(cotizacion, function(err, rows, result) {

                                    if (err) {
                                        res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: {}}));
                                        return;
                                    } else {

                                        cotizacion.numero_cotizacion = (rows.length > 0) ? rows[0].numero_cotizacion : 0;

                                        _productos_validos.forEach(function(producto) {

                                            that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {
                                                if (err) {
                                                    _productos_invalidos.push(producto);
                                                }
                                                if (--i === 0) {
                                                    res.send(G.utils.r(req.url, 'Cotizacion regitrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: cotizacion.numero_cotizacion, productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                                    return;
                                                }
                                            });
                                        });
                                    }
                                });
                            } else {
                                // Insertar productos a la cotizacion
                                _productos_validos.forEach(function(producto) {

                                    that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function(err, rows, result) {
                                        if (err) {
                                            _productos_invalidos.push(producto);
                                        }
                                        if (--i === 0) {
                                            res.send(G.utils.r(req.url, 'Cotizacion regitrada correctamente', 200, {pedidos_clientes: {numero_cotizacion: cotizacion.numero_cotizacion, productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                            return;
                                        }
                                    });
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
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar las observaciones ingresadas por el area de cartera
 */
PedidosCliente.prototype.observacionCartera = function(req, res) {

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

    that.m_pedidos_clientes.observacion_cartera(cotizacion, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {pedidos_clientes: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Observacion regitrada correctamente', 200, {pedidos_clientes: {}}));
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

    // Generar pedido
    that.m_pedidos_clientes.generar_pedido_cliente(cotizacion, function(err, rows, pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno al generar el pedido', 500, {pedidos_clientes: []}));
            return;
        } else {
             // Asignar responsables
            that.m_pedidos_clientes.asignar_responsables_pedidos(pedido.numero_pedido, pedido.estado, null, cotizacion.usuario_id, function(err, rows, responsable_estado_pedido) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Responsables', 500, {pedidos_clientes:[]}));
                    return;
                }
                
                // Actualizar estado del nuevo pedido
                that.m_pedidos_clientes.terminar_estado_pedido(pedido.numero_pedido, [ pedido.estado ], '1', function(err, rows, results) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error finalizando el estado del pedido', 500, {pedidos_clientes:[]}));
                        return;
                    }

                    res.send(G.utils.r(req.url, 'Pedido Generado Correctamente No. '+pedido.numero_pedido, 200, { pedidos_clientes : pedido }));
                    return;
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
    var contenido_archivo_plano = [];

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva, function(err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function(err) {
                    if (err) {
                        callback(false);
                        return;
                    } else {
                        // Cargar Contenido
                        contenido_archivo_plano = G.xlsx.parse(ruta_nueva);
                        // Borrar archivo fisico
                        G.fs.unlinkSync(ruta_nueva);
                        callback(true, contenido_archivo_plano);
                    }
                });
            }
        });
    } else {
        callback(false);
    }
}
;


/*
 * Autor : Camilo Orozco
 * Descripcion : Validar que los códigos de los productos del archivo plano sean validos.
 */
function __validar_productos_archivo_plano(contexto, contenido_archivo_plano, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];
    var rows = [];

    contenido_archivo_plano.forEach(function(obj) {
        obj.data.forEach(function(row) {
            rows.push(row);
        });
    });

    var i = rows.length;

    rows.forEach(function(row) {
        var codigo_producto = row[0].trim() || '';
        var cantidad_solicitada = row[1] || 0;

        that.m_productos.validar_producto(codigo_producto, function(err, existe_producto) {

            var producto = {codigo_producto: codigo_producto, cantidad_solicitada: cantidad_solicitada};

            if (existe_producto.length > 0 && cantidad_solicitada > 0) {
                productos_validos.push(producto);
            } else {
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


/**************************************************
 * 
 *  REVISAR DESDE ACA HACIA ABAJO 
 *
 /**************************************************/


// ????????????????????????????????????????
PedidosCliente.prototype.obtenerDetallePedido = function(req, res) {
    var self = this;

    var args = req.body.data;
    var numero_pedido = args.pedidos_clientes.numero_pedido;

    if (args.pedidos_clientes === undefined || numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    self.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {
        detalle_pedido = self.m_pedidos.unificarLotesDetalle(detalle_pedido);

        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {lista_productos: detalle_pedido}));

    });

};








//LISTAR PEDIDOS
// ????????????????????????????????????????
PedidosCliente.prototype.listadoPedidosClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_cliente === undefined || args.pedidos_cliente.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id No Está Definido', 404, {}));
        return;
    }

    if (args.pedidos_cliente.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id Está Vacio', 404, {}));
        return;
    }

    //Parámetros de búsqueda
    var empresa_id = args.pedidos_cliente.empresa_id;
    var termino_busqueda = args.pedidos_cliente.termino_busqueda;
    var pagina = args.pedidos_cliente.pagina_actual;

    that.m_pedidos_clientes.listado_pedidos_clientes(empresa_id, termino_busqueda, pagina, function(err, listado_pedidos) {

        //console.log(">>>>>>>>>>>>> LISTADO PEDIDOS ............", listado_pedidos);

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Pedidos', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta de Pedidos Exitosa', 200, {resultado_consulta: listado_pedidos}));

    });

};


//consultarEncabezadoPedido
// ????????????????????????????????????????
PedidosCliente.prototype.consultarEncabezadoPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedido_cliente === undefined || args.pedido_cliente.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido No está definido', 404, {}));
        return;
    }

    if (args.pedido_cliente.numero_pedido === "") {
        res.send(G.utils.r(req.url, 'numero_depido está vacio', 404, {}));
        return;
    }

    //Parámetro para el modelo
    var numero_pedido = args.pedido_cliente.numero_pedido;

    that.m_pedidos_clientes.consultar_encabezado_pedido(numero_pedido, function(err, encabezado_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Encabezado Pedido', 404, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Encabezado Pedido Exitosa', 200, {resultado_consulta: encabezado_pedido}));
    });
};

//ESTADO COTIZACIÓN DEL CLIENTE
// ????????????????????????????????????????
PedidosCliente.prototype.estadoCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.estado_cotizacion === undefined || args.estado_cotizacion.numero_cotizacion === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion No Está Definido', 404, {}));
        return;
    }

    if (args.estado_cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion Está Vacio', 404, {}));
        return;
    }

    //Parámetro para modelo
    var numero_cotizacion = args.estado_cotizacion.numero_cotizacion;

    that.m_pedidos_clientes.estado_cotizacion(numero_cotizacion, function(err, array_estado_cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta Estado de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Estado Cotización Exitosa', 200, {resultado_consulta: array_estado_cotizacion}));

    });

};

//ESTADO PEDIDO DEL CLIENTE
//estadoPedido
// ????????????????????????????????????????
PedidosCliente.prototype.estadoPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.estado_pedido === undefined || args.estado_pedido.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido No Está Definido', 404, {}));
        return;
    }

    if (args.estado_pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido Está Vacio', 404, {}));
        return;
    }

    //Parámetro para modelo
    var numero_pedido = args.estado_pedido.numero_pedido;

    that.m_pedidos_clientes.estado_pedido(numero_pedido, function(err, array_estado_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta Estado de Pedido', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Estado Pedido Exitosa', 200, {resultado_consulta: array_estado_pedido}));

    });

};



//listarDetallePedido
// ????????????????????????????????????????
PedidosCliente.prototype.listarDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.detalle_pedido === undefined || args.detalle_pedido.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido No Está Definido', 404, {}));
        return;
    }

    if (args.detalle_pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido Está Vacio', 404, {}));
        return;
    }

    var numero_pedido = args.detalle_pedido.numero_pedido;

    that.m_pedidos_clientes.listar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Consulta Detalle Pedido', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Detalle Pedido Exitosa', 200, {resultado_consulta: detalle_pedido}));

    });

};



//cotizacionEsPedido
// ????????????????????????????????????????
PedidosCliente.prototype.cambiarEstadoCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.estado_cotizacion === undefined || args.estado_cotizacion.numero_cotizacion === undefined || args.estado_cotizacion.nuevo_estado === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion o nuevo_estado no están definidos', 404, {}));
        return;
    }

    if (args.estado_cotizacion.numero_cotizacion === '' || args.estado_cotizacion.nuevo_estado === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion o nuevo_estado están vacios', 404, {}));
        return;
    }

    //Parámetros para actualización
    var numero_cotizacion = args.estado_cotizacion.numero_cotizacion;
    var nuevo_estado = args.estado_cotizacion.nuevo_estado;

    that.m_pedidos_clientes.cambiar_estado_cotizacion(numero_cotizacion, nuevo_estado, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error al modificar el estado', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Modificación de estado Exitosa', 200, {}));

    });

};

// ????????????????????????????????????????
PedidosCliente.prototype.cambiarEstadoAprobacionCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.estado_cotizacion === undefined || args.estado_cotizacion.numero_cotizacion === undefined || args.estado_cotizacion.nuevo_estado === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion o nuevo_estado no están definidos', 404, {}));
        return;
    }

    if (args.estado_cotizacion.numero_cotizacion === '' || args.estado_cotizacion.nuevo_estado === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion o nuevo_estado están vacios', 404, {}));
        return;
    }

    //Parámetros para actualización
    var numero_cotizacion = args.estado_cotizacion.numero_cotizacion;
    var nuevo_estado = args.estado_cotizacion.nuevo_estado;
    var observacion = args.estado_cotizacion.observacion;

    that.m_pedidos_clientes.cambiar_estado_aprobacion_cotizacion(numero_cotizacion, nuevo_estado, observacion, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error al modificar el estado', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Modificación de estado Exitosa', 200, {}));

    });

};







// ????????????????????????????????????????
PedidosCliente.prototype.imprimirCotizacionCliente = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.encabezado_pedido_cliente === undefined || args.encabezado_pedido_cliente.numero_cotizacion === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion no está definido', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.codigo_origen_id === undefined || args.encabezado_pedido_cliente.empresa_origen === undefined
            || args.encabezado_pedido_cliente.fecha_registro === undefined) {

        res.send(G.utils.r(req.url, 'codigo_origen_id, empresa_origen o fecha_registro no están definidos', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.id_cliente === undefined || args.encabezado_pedido_cliente.nombre_cliente === undefined
            || args.encabezado_pedido_cliente.ciudad_cliente === undefined || args.encabezado_pedido_cliente.direccion_cliente === undefined) {

        res.send(G.utils.r(req.url, 'id_cliente, nombre_cliente, ciudad_cliente o direccion_cliente no están definidos', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.valor_total_sin_iva === undefined || args.encabezado_pedido_cliente.valor_total_con_iva === undefined) {

        res.send(G.utils.r(req.url, 'valor_total_sin_iva o valor_total_con_iva no están definidos', 404, {}));
        return;
    }


    if (args.encabezado_pedido_cliente.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion está vacio', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.codigo_origen_id === '' || args.encabezado_pedido_cliente.empresa_origen === ''
            || args.encabezado_pedido_cliente.fecha_registro === '') {

        res.send(G.utils.r(req.url, 'codigo_origen_id, empresa_origen o fecha_registro están vacios', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.id_cliente === '' || args.encabezado_pedido_cliente.nombre_cliente === ''
            || args.encabezado_pedido_cliente.ciudad_cliente === '' || args.encabezado_pedido_cliente.direccion_cliente === '') {

        res.send(G.utils.r(req.url, 'id_cliente, nombre_cliente, ciudad_cliente o direccion_cliente están vacios', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.valor_total_sin_iva === '' || args.encabezado_pedido_cliente.valor_total_con_iva === '') {

        res.send(G.utils.r(req.url, 'valor_total_sin_iva o valor_total_con_iva están vacios', 404, {}));
        return;
    }


    if (args.detalle_pedido_cliente === undefined) {
        res.send(G.utils.r(req.url, 'El detalle no está definido', 404, {}));
        return;
    }
    else {
        args.detalle_pedido_cliente.forEach(function(detalle) {

            if (detalle.codigo_producto === undefined || detalle.descripcion === undefined) {
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion no están definidos', 404, {}));
                return;
            }

            if (detalle.cantidad_solicitada === undefined || detalle.iva === undefined) {
                res.send(G.utils.r(req.url, 'cantidad_solicitada o iva no están definidos', 404, {}));
                return;
            }

            if (detalle.precio === undefined || detalle.total_sin_iva === undefined || detalle.total_con_iva === undefined) {
                res.send(G.utils.r(req.url, 'precio, total_sin_iva o total_con_iva no están definidos', 404, {}));
                return;
            }


            if (detalle.codigo_producto === '' || detalle.descripcion === '') {
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion están vacios', 404, {}));
                return;
            }

            if (detalle.cantidad_solicitada === '' || detalle.iva === '') {
                res.send(G.utils.r(req.url, 'cantidad_solicitada o iva están vacios', 404, {}));
                return;
            }

            if (detalle.precio === '' || detalle.total_sin_iva === '' || detalle.total_con_iva === '') {
                res.send(G.utils.r(req.url, 'precio, total_sin_iva o total_con_iva están vacios', 404, {}));
                return;
            }

        });
    }

    args.serverUrl = req.protocol + '://' + req.get('host') + "/";

    _generarDocumentoCotizacion(that, args, function(nombreTmp, estado_mail) {

        if (estado_mail !== undefined) {
            if (estado_mail === true) {
                res.send(G.utils.r(req.url, 'Email enviado exitosamente', 200, {}));
                return;
            }

            res.send(G.utils.r(req.url, 'Error al enviar el email', 500, {}));
            return;

        }
        else {
            res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
            return;
        }

//        if(error === {} && response === {}) {
//            res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
//            return;
//        }
//        else if(error) {
//            res.send(G.utils.r(req.url, 'Error al enviar el email', 500, {}));
//            return;
//        }
//        else {
//            res.send(G.utils.r(req.url, 'Email enviado exitosamente', 200, {}));
//            return;
//        }
    });

};

// ????????????????????????????????????????
function _generarDocumentoCotizacion(that, obj, callback) {


    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PedidosClientes/reports/cotizacion.html', 'utf8'),
            //helpers: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: obj
    },
    function(err, response) {


        response.body(function(body) {


            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
            var rutaArchivo = G.dirname + "/public/reports/" + nombreTmp;


            G.fs.writeFile(rutaArchivo, body, "binary", function(err) {

                if (obj.encabezado_pedido_cliente.email === true) {

                    var nombre_archivo = "Cotizacion No" + obj.encabezado_pedido_cliente.numero_cotizacion + ".pdf";
                    var destinatario = obj.encabezado_pedido_cliente.destinatarios;
                    //var subject = "Dusoft :: Cotización DUANA y Cia Ltda.";
                    var asunto = obj.encabezado_pedido_cliente.asunto;
                    var contenido = obj.encabezado_pedido_cliente.contenido;

                    __emailDocumento(that, destinatario, rutaArchivo, nombre_archivo, asunto, contenido, function(mail_exitoso) {

                        callback(nombreTmp, mail_exitoso);
                    });

                } else {
                    callback(nombreTmp);
                }

            });

        });


    });
}
;


// ????????????????????????????????????????
PedidosCliente.prototype.imprimirPedidoCliente = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.encabezado_pedido_cliente === undefined || args.encabezado_pedido_cliente.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.codigo_origen_id === undefined || args.encabezado_pedido_cliente.empresa_origen === undefined
            || args.encabezado_pedido_cliente.fecha_registro === undefined) {

        res.send(G.utils.r(req.url, 'codigo_origen_id, empresa_origen o fecha_registro no están definidos', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.id_cliente === undefined || args.encabezado_pedido_cliente.nombre_cliente === undefined
            || args.encabezado_pedido_cliente.ciudad_cliente === undefined || args.encabezado_pedido_cliente.direccion_cliente === undefined) {

        res.send(G.utils.r(req.url, 'id_cliente, nombre_cliente, ciudad_cliente o direccion_cliente no están definidos', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.valor_total_sin_iva === undefined || args.encabezado_pedido_cliente.valor_total_con_iva === undefined) {

        res.send(G.utils.r(req.url, 'valor_total_sin_iva o valor_total_con_iva no están definidos', 404, {}));
        return;
    }


    if (args.encabezado_pedido_cliente.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.codigo_origen_id === '' || args.encabezado_pedido_cliente.empresa_origen === ''
            || args.encabezado_pedido_cliente.fecha_registro === '') {

        res.send(G.utils.r(req.url, 'codigo_origen_id, empresa_origen o fecha_registro están vacios', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.id_cliente === '' || args.encabezado_pedido_cliente.nombre_cliente === ''
            || args.encabezado_pedido_cliente.ciudad_cliente === '' || args.encabezado_pedido_cliente.direccion_cliente === '') {

        res.send(G.utils.r(req.url, 'id_cliente, nombre_cliente, ciudad_cliente o direccion_cliente están vacios', 404, {}));
        return;
    }

    if (args.encabezado_pedido_cliente.valor_total_sin_iva === '' || args.encabezado_pedido_cliente.valor_total_con_iva === '') {

        res.send(G.utils.r(req.url, 'valor_total_sin_iva o valor_total_con_iva están vacios', 404, {}));
        return;
    }


    if (args.detalle_pedido_cliente === undefined) {
        res.send(G.utils.r(req.url, 'El detalle no está definido', 404, {}));
        return;
    }
    else {
        args.detalle_pedido_cliente.forEach(function(detalle) {

            if (detalle.codigo_producto === undefined || detalle.descripcion === undefined) {
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion no están definidos', 404, {}));
                return;
            }

            if (detalle.cantidad_solicitada === undefined || detalle.iva === undefined) {
                res.send(G.utils.r(req.url, 'cantidad_solicitada o iva no están definidos', 404, {}));
                return;
            }

            if (detalle.precio === undefined || detalle.total_sin_iva === undefined || detalle.total_con_iva === undefined) {
                res.send(G.utils.r(req.url, 'precio, total_sin_iva o total_con_iva no están definidos', 404, {}));
                return;
            }


            if (detalle.codigo_producto === '' || detalle.descripcion === '') {
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion están vacios', 404, {}));
                return;
            }

            if (detalle.cantidad_solicitada === '' || detalle.iva === '') {
                res.send(G.utils.r(req.url, 'cantidad_solicitada o iva están vacios', 404, {}));
                return;
            }

            if (detalle.precio === '' || detalle.total_sin_iva === '' || detalle.total_con_iva === '') {
                res.send(G.utils.r(req.url, 'precio, total_sin_iva o total_con_iva están vacios', 404, {}));
                return;
            }

        });
    }

    args.serverUrl = req.protocol + '://' + req.get('host') + "/";

    _generarDocumentoPedido(that, args, function(nombreTmp, estado_mail) {

        if (estado_mail !== undefined) {
            if (estado_mail === true) {
                res.send(G.utils.r(req.url, 'Email enviado exitosamente', 200, {}));
                return;
            }

            res.send(G.utils.r(req.url, 'Error al enviar el email', 500, {}));
            return;

        }
        else {
            res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
            return;
        }

//        if(error && response) {
//            res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
//            return;
//        }
//        else if(error) {
//            
//            if(error.no_mail) {
//                
//                res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
//                return;
//            }
//                
//            }
//            
//            res.send(G.utils.r(req.url, 'Error al enviar el email', 500, {}));
//            return;
//        }
//        else {
//            res.send(G.utils.r(req.url, 'Email enviado exitosamente', 200, {}));
//            return;
//        }

    });

};

// ????????????????????????????????????????

function _generarDocumentoPedido(that, obj, callback) {


    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PedidosClientes/reports/pedido.html', 'utf8'),
            //helpers: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: obj
    }, function(err, response) {

        response.body(function(body) {
            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
            var rutaArchivo = G.dirname + "/public/reports/" + nombreTmp;

            G.fs.writeFile(rutaArchivo, body, "binary", function(err) {

                if (err) {
                    console.log(err);
                } else {
                    //callback(nombreTmp);

                    if (obj.encabezado_pedido_cliente.email === true) {
                        var nombre_archivo = "Pedido No" + obj.encabezado_pedido_cliente.numero_pedido + ".pdf";
                        var destinatario = obj.encabezado_pedido_cliente.destinatarios;
                        //var subject = "Dusoft :: Pedido DUANA y Cia Ltda.";
                        var asunto = obj.encabezado_pedido_cliente.asunto;
                        var contenido = obj.encabezado_pedido_cliente.contenido;

                        __emailDocumento(that, destinatario, rutaArchivo, nombre_archivo, asunto, contenido, function(mail_exitoso) {

                            callback(nombreTmp, mail_exitoso);
                            return;
                        });
                    }
                    else {
                        callback(nombreTmp);
                        return;
                    }

                }

            });


        });


    });
    /*G.jsreport.reporter.render({
     template: {
     content: G.fs.readFileSync('app_modules/PedidosClientes/reports/pedido.html', 'utf8'),
     //helpers: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/javascripts/rotulos.js', 'utf8'),
     recipe: "phantom-pdf",
     engine: 'jsrender'
     },
     data: obj
     }).then(function(response) {
     
     var name = response.result.path;
     var fecha = new Date();
     var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
     G.fs.copySync(name, G.dirname + "/public/reports/" + nombreTmp);
     
     if (obj.encabezado_pedido_cliente.email === true) {
     var nombre_archivo = "Pedido No" + obj.encabezado_pedido_cliente.numero_pedido + ".pdf";
     var destinatario = obj.encabezado_pedido_cliente.destinatarios;
     //var subject = "Dusoft :: Pedido DUANA y Cia Ltda.";
     var asunto = obj.encabezado_pedido_cliente.asunto;
     var contenido = obj.encabezado_pedido_cliente.contenido;
     
     __emailDocumento(that, destinatario, name, nombre_archivo, asunto, contenido, function(mail_exitoso) {
     
     callback(nombreTmp, mail_exitoso);
     return;
     });
     }
     else {
     callback(nombreTmp);
     return;
     }
     
     //callback(nombreTmp);
     });*/
}
;

//Envío de Email
// ????????????????????????????????????????
function __emailDocumento(that, destinatario, ruta_archivo, nombre_archivo, subject, contenido, callback) {

//    var smtpTransport = that.emails.createTransport("SMTP", {
//        service: "Gmail",
//        auth: {
//            user: "alxlopez.duana.desarrollo@gmail.com",
//            pass: ""
//        }
//    });

    var smtpTransport = that.emails.createTransport();

    G.fs.readFile(ruta_archivo, function(err, data) {

        if (err) {

            callback(err, null);
            return;
        }

        var configuracion_email = {};
        configuracion_email.from = G.settings.email_sender;
        configuracion_email.to = destinatario;
        configuracion_email.subject = subject;
        configuracion_email.text = contenido;
        configuracion_email.html = contenido;
        configuracion_email.attachments = [{'filename': nombre_archivo, 'contents': data}]

        smtpTransport.sendMail(configuracion_email, function(error, response) {

            if (error) {
                //callback(error, response);
                callback(false);
                return;
            } else {
                smtpTransport.close();
                callback(true);
                return;
            }
        });

    });
}
;

//Insertar Detalle Pedido
// ????????????????????????????????????????
PedidosCliente.prototype.insertarDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.detalle_pedido === undefined || args.detalle_pedido.numero_pedido === undefined || args.detalle_pedido.codigo_producto === undefined || args.detalle_pedido.porc_iva === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido, codigo_producto o porc_iva No Están Definidos', 404, {}));
        return;
    }

    if (args.detalle_pedido.numero_unidades === undefined || args.detalle_pedido.valor_unitario === undefined || args.detalle_pedido.tipo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_unidades, valor_unitario o tipo_producto No Están Definidos', 404, {}));
        return;
    }

    if (args.detalle_pedido.numero_pedido === '' || args.detalle_pedido.codigo_producto === '' || args.detalle_pedido.porc_iva === '') {
        res.send(G.utils.r(req.url, 'numero_pedido, codigo_producto o porc_iva Están Vacios', 404, {}));
        return;
    }

    if (args.detalle_pedido.numero_unidades === '' || args.detalle_pedido.valor_unitario === '' || args.detalle_pedido.tipo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_unidades, valor_unitario o tipo_producto Están Vacios', 404, {}));
        return;
    }

    //Parámetros a insertar
    var numero_pedido = args.detalle_pedido.numero_pedido;
    var codigo_producto = args.detalle_pedido.codigo_producto;
    var porc_iva = args.detalle_pedido.porc_iva;
    var numero_unidades = args.detalle_pedido.numero_unidades;
    var valor_unitario = args.detalle_pedido.valor_unitario;
    var tipo_producto = args.detalle_pedido.tipo_producto;
    var usuario_id = req.session.user.usuario_id;

    //insertar_detalle_pedido = function(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, callback)

    that.m_pedidos_clientes.insertar_detalle_pedido(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, function(err, row) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Inserción del Detalle de Pedido', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Inserción del Detalle Pedido Exitosa', 200, {}));

    });
};

//eliminarRegistroDetallePedido}
// ????????????????????????????????????????
PedidosCliente.prototype.eliminarRegistroDetallePedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.eliminar_detalle_pedido === undefined || args.eliminar_detalle_pedido.numero_pedido === undefined || args.eliminar_detalle_pedido.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo_producto no están definidos', 404, {}));
        return;
    }

    if (args.eliminar_detalle_pedido.numero_pedido === '' || args.eliminar_detalle_pedido.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo_producto están vacios', 404, {}));
        return;
    }

    //Parámetro a insertar
    var numero_pedido = args.eliminar_detalle_pedido.numero_pedido;
    var codigo_producto = args.eliminar_detalle_pedido.codigo_producto;
    var usuario_solicitud = req.session.user.usuario_id;

    that.m_pedidos_clientes.eliminar_registro_detalle_pedido(numero_pedido, codigo_producto, usuario_solicitud, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Eliminación Registro Detalle Pedido', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Eliminación Registro Detalle Pedido Exitoso', 200, {}));

    });

};

//Modificar Cantidades Cotización
// ????????????????????????????????????????
PedidosCliente.prototype.modificarCantidadesCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.obj_pedido === undefined || args.obj_pedido.numero_cotizacion === undefined || args.obj_pedido.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion o codigo_producto no están definidos', 404, {}));
        return;
    }

    if (args.obj_pedido.cantidad === undefined) {
        res.send(G.utils.r(req.url, 'cantidad no está definida', 404, {}));
        return;
    }

    if (args.obj_pedido.numero_cotizacion === '' || args.obj_pedido.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion o codigo_producto están vacios', 404, {}));
        return;
    }

    if (args.obj_pedido.cantidad === '') {
        res.send(G.utils.r(req.url, 'cantidad está vacia', 404, {}));
        return;
    }

    //Parámetro a insertar
    var numero_cotizacion = args.obj_pedido.numero_cotizacion;
    var codigo_producto = args.obj_pedido.codigo_producto;
    var usuario_solicitud = req.session.user.usuario_id;
    var cantidad = args.obj_pedido.cantidad;

    that.m_pedidos_clientes.modificar_cantidades_cotizacion(numero_cotizacion, codigo_producto, usuario_solicitud, cantidad, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Modificación Cantidad', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Modificación Cantidad Exitosa', 200, {}));
    });
};

//Modificar Cantidades Pedido
// ????????????????????????????????????????
PedidosCliente.prototype.modificarCantidadesPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.obj_pedido === undefined || args.obj_pedido.numero_pedido === undefined || args.obj_pedido.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo_producto no están definidos', 404, {}));
        return;
    }

    if (args.obj_pedido.cantidad === undefined) {
        res.send(G.utils.r(req.url, 'cantidad no está definida', 404, {}));
        return;
    }

    if (args.obj_pedido.numero_pedido === '' || args.obj_pedido.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo_producto están vacios', 404, {}));
        return;
    }

    if (args.obj_pedido.cantidad === '') {
        res.send(G.utils.r(req.url, 'cantidad está vacia', 404, {}));
        return;
    }

    //Parámetro a insertar
    var numero_pedido = args.obj_pedido.numero_pedido;
    var codigo_producto = args.obj_pedido.codigo_producto;
    var usuario_solicitud = req.session.user.usuario_id;
    var cantidad = args.obj_pedido.cantidad;

    that.m_pedidos_clientes.modificar_cantidades_pedido(numero_pedido, codigo_producto, usuario_solicitud, cantidad, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Modificación Cantidad', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Modificación Cantidad Exitosa', 200, {}));

    });

};


PedidosCliente.$inject = ["m_pedidos_clientes", "e_pedidos_clientes", "m_productos", "m_pedidos", "m_terceros", "emails", "m_pedidos_farmacias"];

module.exports = PedidosCliente;
