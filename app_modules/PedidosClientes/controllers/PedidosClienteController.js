
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

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.empresa_id === undefined || args.pedidos_clientes.centro_utilidad_id === undefined || args.pedidos_clientes.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }
    
    if (args.pedidos_clientes.pagina_actual === undefined || args.pedidos_clientes.termino_busqueeeda === undefined || args.pedidos_clientes.centro_utilidad_id === undefined || args.pedidos_clientes.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }
    
    if (args.pedidos_clientes.empresa_id === '' || args.pedidos_clientes.centro_utilidad_id === '' || args.pedidos_clientes.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }
   


    return;
    /****************************/
    var that = this;

    var args = req.body.data;

    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.productos.empresa_id === '' || args.productos.centro_utilidad_id === '' || args.productos.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }

    if (args.productos.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var empresa_id = args.productos.empresa_id;
    var centro_utilidad_id = args.productos.centro_utilidad_id;
    var bodega_id = args.productos.bodega_id;
    var contrato_cliente_id = args.productos.contrato_cliente_id;
    var termino_busqueda = args.productos.termino_busqueda;
    var laboratorio = args.productos.laboratorio;
    var concentracion = args.productos.concentracion;
    var pagina_actual = args.productos.pagina_actual;
    var pedido_cliente_id_tmp = args.productos.pedido_cliente_id_tmp;
    var filtro = args.productos.filtro;

    /* Inicio - Modificación para Tipo Producto */
    var tipo_producto = '0';

    if (args.productos.tipo_producto !== undefined) {
        tipo_producto = args.productos.tipo_producto;
    }
    /* Fin - Modificación para Tipo Producto */


    this.m_productos.listar_productos_clientes(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, laboratorio, concentracion, pagina_actual, filtro, function(err, lista_productos) {

        var i = lista_productos.length;

        if (i === 0) {
            res.send(G.utils.r(req.url, 'Lista de productos vacía', 200, {lista_productos: []}));
            return;
        }

        lista_productos.forEach(function(producto) {

            //producto.existencia
            that.m_pedidos_farmacias.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_farmacias) {

                var cantidad_total_pendiente_farmacias = (total_pendiente_farmacias.length > 0) ? total_pendiente_farmacias[0].cantidad_total_pendiente : 0;

                that.m_pedidos_clientes.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_clientes) {

                    var cantidad_total_pendiente_clientes = (total_pendiente_clientes.length > 0) ? total_pendiente_clientes[0].cantidad_total_pendiente : 0;

                    that.m_pedidos_farmacias.calcular_cantidad_reservada_temporales_farmacias(producto.codigo_producto, function(err, total_reservado_temporales) {

                        var cantidad_reservada_temporales = (total_reservado_temporales.length > 0) ? total_reservado_temporales[0].total_reservado : 0;

                        that.m_pedidos_clientes.calcular_cantidad_reservada_cotizaciones_clientes(producto.codigo_producto, function(err, total_reservado_cotizaciones) {

                            var cantidad_reservada_cotizaciones = (total_reservado_cotizaciones.length > 0) ? total_reservado_cotizaciones[0].total_reservado : 0;

                            var disponibilidad_bodega = producto.existencia - cantidad_total_pendiente_farmacias - cantidad_total_pendiente_clientes
                                    - cantidad_reservada_temporales - cantidad_reservada_cotizaciones;

                            producto.disponible = (disponibilidad_bodega < 0) ? 0 : disponibilidad_bodega;

                            if (--i === 0) {

                                if (err) {
                                    res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
                                    return;
                                }

                            }
                        });
                    });
                });
            });
        });
    });
};


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




/**
 * @api {post} /api/PedidosClientes/insertarCotizacion Insertar Cotización
 * @apiName Insertar Cotización.
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

// ????????????????????????????????????????
PedidosCliente.prototype.insertarCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizacion_encabezado === undefined || args.cotizacion_encabezado.empresa_id === undefined
            || args.cotizacion_encabezado.tipo_id_tercero === undefined || args.cotizacion_encabezado.tercero_id === undefined
            || args.cotizacion_encabezado.centro_utilidad === undefined || args.cotizacion_encabezado.bodega === undefined) {

        res.send(G.utils.r(req.url, 'empresa_id, tipo_tercero_id o tercero_id No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_encabezado.tipo_id_vendedor === undefined || args.cotizacion_encabezado.vendedor_id === undefined
            || args.cotizacion_encabezado.estado === undefined) {

        res.send(G.utils.r(req.url, 'tipo_id_vendedor, vendedor_id o estado No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_encabezado.empresa_id === '' || args.cotizacion_encabezado.tipo_id_tercero === '' || args.cotizacion_encabezado.tercero_id === ''
            || args.cotizacion_encabezado.centro_utilidad === '' || args.cotizacion_encabezado.bodega === '') {
        res.send(G.utils.r(req.url, 'empresa_id, tipo_id_tercero o tercero_id Están Vacios', 404, {}));
        return;
    }

    if (args.cotizacion_encabezado.tipo_id_vendedor === '' || args.cotizacion_encabezado.vendedor_id === '' || args.cotizacion_encabezado.estado === '') {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor, vendedor_id o estado Están Vacios', 404, {}));
        return;
    }

    //Parámetros a insertar
    var empresa_id = args.cotizacion_encabezado.empresa_id;
    var tipo_id_tercero = args.cotizacion_encabezado.tipo_id_tercero;
    var tercero_id = args.cotizacion_encabezado.tercero_id;
    var usuario_id = req.session.user.usuario_id;
    var tipo_id_vendedor = args.cotizacion_encabezado.tipo_id_vendedor;
    var vendedor_id = args.cotizacion_encabezado.vendedor_id;
    var estado = args.cotizacion_encabezado.estado;
    var observaciones = args.cotizacion_encabezado.observaciones;
    var centro_utilidad = args.cotizacion_encabezado.centro_utilidad;
    var bodega = args.cotizacion_encabezado.bodega;

    that.m_pedidos_clientes.insertar_cotizacion(empresa_id, tipo_id_tercero, tercero_id, usuario_id,
            tipo_id_vendedor, vendedor_id, estado, observaciones, centro_utilidad, bodega, function(err, row) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Inserción del Encabezado de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Inserción del Encabezado Cotización Exitosa', 200, {resultado_consulta: row}));

    });

};

/**
 * @api {post} /api/PedidosClientes/insertarDetalleCotizacion Insertar Detalle Cotización
 * @apiName Insertar Cotización.
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
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 'jhon.doe',
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : {
 *              asignacion_pedidos :  { 
 *                                      pedidos : [],
 *                                      estado_pedido: '',
 *                                      responsable : ''
 *                                  }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosClientes/insertarDetalleCotizacion',   
 *       msj : 'Asignacion de Resposables',
 *       status: '200',
 *       obj : {
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/insertarDetalleCotizacion',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

// ????????????????????????????????????????
PedidosCliente.prototype.insertarDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizacion_detalle === undefined || args.cotizacion_detalle.pedido_cliente_id_tmp === undefined || args.cotizacion_detalle.codigo_producto === undefined || args.cotizacion_detalle.porc_iva === undefined) {
        res.send(G.utils.r(req.url, 'pedido_cliente_id_tmp, codigo_producto o porc_iva No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_detalle.numero_unidades === undefined || args.cotizacion_detalle.valor_unitario === undefined || args.cotizacion_detalle.tipo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_unidades, valor_unitario o tipo_producto No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_detalle.pedido_cliente_id_tmp === '' || args.cotizacion_detalle.codigo_producto === '' || args.cotizacion_detalle.porc_iva === '') {
        res.send(G.utils.r(req.url, 'pedido_cliente_id_tmp, codigo_producto o porc_iva Están Vacios', 404, {}));
        return;
    }

    if (args.cotizacion_detalle.numero_unidades === '' || args.cotizacion_detalle.valor_unitario === '' || args.cotizacion_detalle.tipo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_unidades, valor_unitario o tipo_producto Están Vacios', 404, {}));
        return;
    }

    //Parámetros a insertar
    var pedido_cliente_id_tmp = args.cotizacion_detalle.pedido_cliente_id_tmp;
    var codigo_producto = args.cotizacion_detalle.codigo_producto;
    var porc_iva = args.cotizacion_detalle.porc_iva;
    var numero_unidades = args.cotizacion_detalle.numero_unidades;
    var valor_unitario = args.cotizacion_detalle.valor_unitario;
    var tipo_producto = args.cotizacion_detalle.tipo_producto;
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_clientes.insertar_detalle_cotizacion(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, function(err, row) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Inserción del Detalle de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Inserción del Detalle Cotización Exitosa', 200, {}));

    });

};

//INSERTAR PEDIDO CLIENTES
// ????????????????????????????????????????
PedidosCliente.prototype.insertarPedidoCliente = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedido_cliente === undefined || args.pedido_cliente.numero_cotizacion === undefined) {
        res.send(G.utils.r(req.url, 'número_cotizacion No Está Definido', 404, {}));
        return;
    }

    if (args.pedido_cliente.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'número_cotizacion Está Vacio', 404, {}));
        return;
    }

    //Parámetro a insertar
    var numero_cotizacion = args.pedido_cliente.numero_cotizacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_clientes.insertar_pedido_cliente(numero_cotizacion, function(err, rows, fecha_registro_encabezado) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en la inserción del Pedido', 500, {}));
            return;
        }

        var numero_pedido = rows.rows[0].pedido_cliente_id;
        var fecha_registro = fecha_registro_encabezado;

        console.log(">>>> RESULTADO GENERAR PEDIDO: ", rows);
        console.log(">>>>> FECHA REGISTRO ENCABEZADO: ", fecha_registro);
        //res.send(G.utils.r(req.url, 'Inserción Exitosa del Pedido', 200, {numero_pedido: rows.rows[0].pedido_cliente_id}));

        /*Inicio - Modificación para estados*/

        //that.m_terceros.seleccionar_operario_por_usuario_id(usuario_id, function(err, operario_array) {

//            if (err) {
//                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Selección del Operario', 500, {}));
//                return;
//            }
        //else {

        var responsable = null;//operario_array[0].operario_id;

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, '0', responsable, usuario_id, function(err, rows, responsable_estado_pedido) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            /*Inicio - Actualización sw_terminado*/
            that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, ['0'], '1', function(err, rows, results) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                    return;
                }

                res.send(G.utils.r(req.url, 'Encabezado del pedido almacenado exitosamente', 200, {numero_pedido: numero_pedido, fecha_registro: fecha_registro}));
                return;

            });
            /*Fin - Actualización sw_terminado*/

        });

        //} // fin else
        //});
        /*Fin - Modificación para estados*/

    });

};

//LISTAR COTIZACIONES CLIENTES
// ????????????????????????????????????????
PedidosCliente.prototype.listarCotizaciones = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizaciones_cliente === undefined || args.cotizaciones_cliente.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id No Está Definido', 404, {}));
        return;
    }

    if (args.cotizaciones_cliente.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id Está Vacio', 404, {}));
        return;
    }

    //Parámetros de búsqueda
    var empresa_id = args.cotizaciones_cliente.empresa_id;
    var termino_busqueda = args.cotizaciones_cliente.termino_busqueda;
    var pagina = args.cotizaciones_cliente.pagina_actual;

    that.m_pedidos_clientes.listar_cotizaciones(empresa_id, termino_busqueda, pagina, function(err, listado_cotizaciones) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta de Cotización Exitosa', 200, {resultado_consulta: listado_cotizaciones}));

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

//consultarEncabezadoCotizacion
// ????????????????????????????????????????
PedidosCliente.prototype.consultarEncabezadoCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizacion_cliente === undefined || args.cotizacion_cliente.numero_cotizacion === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion No está definido', 404, {}));
        return;
    }

    if (args.cotizacion_cliente.numero_cotizacion === "") {
        res.send(G.utils.r(req.url, 'numero_cotizacion está vacio', 404, {}));
        return;
    }

    //Parámetro para el modelo
    var numero_cotizacion = args.cotizacion_cliente.numero_cotizacion;

    that.m_pedidos_clientes.consultar_encabezado_cotizacion(numero_cotizacion, function(err, encabezado_cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Encabezado Cotización', 404, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Encabezado Cotización Exitosa', 200, {resultado_consulta: encabezado_cotizacion}));
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

// ????????????????????????????????????????
PedidosCliente.prototype.listarDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.detalle_cotizacion === undefined || args.detalle_cotizacion.numero_cotizacion === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion No Está Definido', 404, {}));
        return;
    }

    if (args.detalle_cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion Está Vacio', 404, {}));
        return;
    }

    var numero_cotizacion = args.detalle_cotizacion.numero_cotizacion;

    that.m_pedidos_clientes.listar_detalle_cotizacion(numero_cotizacion, function(err, detalle_cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Consulta Detalle Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Detalle Cotización Exitosa', 200, {resultado_consulta: detalle_cotizacion}));

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

//eliminar_registro_detalle_cotizacion
// ????????????????????????????????????????
PedidosCliente.prototype.eliminarRegistroDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.eliminar_detalle_cotizacion === undefined || args.eliminar_detalle_cotizacion.numero_cotizacion === undefined || args.eliminar_detalle_cotizacion.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_cotizacion o codigo_producto no están definidos', 404, {}));
        return;
    }

    if (args.eliminar_detalle_cotizacion.numero_cotizacion === '' || args.eliminar_detalle_cotizacion.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion o codigo_producto están vacios', 404, {}));
        return;
    }

    //Parámetro de búsqueda
    var numero_cotizacion = args.eliminar_detalle_cotizacion.numero_cotizacion;
    var codigo_producto = args.eliminar_detalle_cotizacion.codigo_producto;
    var usuario_solicitud = req.session.user.usuario_id;

    that.m_pedidos_clientes.eliminar_registro_detalle_cotizacion(numero_cotizacion, codigo_producto, usuario_solicitud, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Eliminación Registro Detalle Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Eliminación Registro Detalle Cotización Exitoso', 200, {}));

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
PedidosCliente.prototype.cambiarEstadoAprobacionPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.estado_pedido === undefined || args.estado_pedido.numero_pedido === undefined || args.estado_pedido.nuevo_estado === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o nuevo_estado no están definidos', 404, {}));
        return;
    }

    if (args.estado_pedido.numero_pedido === '' || args.estado_pedido.nuevo_estado === '') {
        res.send(G.utils.r(req.url, 'numero_pedido o nuevo_estado están vacios', 404, {}));
        return;
    }

    //Parámetros para actualización
    var numero_pedido = args.estado_pedido.numero_pedido;
    var nuevo_estado = args.estado_pedido.nuevo_estado;
    var observacion = args.estado_pedido.observacion;

    that.m_pedidos_clientes.cambiar_estado_aprobacion_pedido(numero_pedido, nuevo_estado, observacion, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error al modificar el estado', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Modificación de estado Exitosa', 200, {}));

    });

};

// ????????????????????????????????????????
PedidosCliente.prototype.pedidoClienteArchivoPlano = function(req, res) {

    var that = this;

    var args = req.body.data;
    var session = req.body.session;

    //VERIFICACION DATOS PARA CONSULTA PRODUCTOS

    if (args.pedido_cliente === undefined || args.pedido_cliente.empresa_id === undefined || args.pedido_cliente.centro_utilidad_id === undefined || args.pedido_cliente.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedido_cliente.contrato_cliente_id === undefined || args.pedido_cliente.pedido_cliente_id_tmp === undefined || args.pedido_cliente.tipo_producto === undefined) {
        res.send(G.utils.r(req.url, 'contrato_cliente_id, pedido_cliente_id_tmp o tipo_producto no estan definidos', 404, {}));
        return;
    }

    if (args.pedido_cliente.empresa_id === '' || args.pedido_cliente.centro_utilidad_id === '' || args.pedido_cliente.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }

    if (args.pedido_cliente.contrato_cliente_id === '' || args.pedido_cliente.pedido_cliente_id_tmp === '' || args.pedido_cliente.tipo_producto === '') {
        res.send(G.utils.r(req.url, 'contrato_cliente_id, pedido_cliente_id_tmp o tipo_producto están vacios', 404, {}));
        return;
    }

    //VERIFICACION DE DATOS PARA ENCABEZADO. empresa_id se verifica arriba

    if (args.pedido_cliente === undefined || args.pedido_cliente.tipo_id_tercero === undefined || args.pedido_cliente.tercero_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedido_cliente.tipo_id_vendedor === undefined || args.pedido_cliente.vendedor_id === undefined || args.pedido_cliente.estado === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor, vendedor_id o estado no estan definidos', 404, {}));
        return;
    }

    if (args.pedido_cliente.tipo_id_tercero === '' || args.pedido_cliente.tercero_id === '') {
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id están vacios', 404, {}));
        return;
    }

    if (args.pedido_cliente.tipo_id_vendedor === '' || args.pedido_cliente.vendedor_id === '' || args.pedido_cliente.estado === '') {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor, vendedor_id o estado están vacios', 404, {}));
        return;
    }

    //VERIFICACION DEL FILE

    if (req.files === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere un archivo plano', 404, {}));
        return;
    }

    __subir_archivo_plano(req.files, function(continuar, contenido) {

        if (continuar) {

            var lista_productos = contenido[0].data;

            //console.log(">>>>>>> Cantidad de Columnas Es: ", lista_productos[0].length)
            if (lista_productos[0].length < 2) { // Para archivo de 2 columnas

                //console.log(">>>>>>> La Cantidad de Columnas no es correcta. Debe tener al menos 3:")    
                //console.log(">>>>>>> Cantidad de Columnas Es: ", lista_productos[0].length)  

                res.send(G.utils.r(req.url, 'La Cantidad de Columnas no es correcta. Debe tener al menos 2 Columnas', 404, {}));
                return;
            }
            else {
                //console.log("El Número de columnas es CORRECTO!");

                __validar_productos_archivo_plano(that, lista_productos, function(productos_validos, productos_invalidos) {

                    if (productos_validos.length === 0) {
                        res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedido_cliente: {productos_validos: productos_validos, productos_invalidos: productos_invalidos}}));
                        return;
                    }

                    var j = productos_validos.length;

                    var empresa_id = args.pedido_cliente.empresa_id;
                    var tipo_id_tercero = args.pedido_cliente.tipo_id_tercero;
                    var tercero_id = args.pedido_cliente.tercero_id;
                    var usuario_id = req.session.user.usuario_id;
                    var tipo_id_vendedor = args.pedido_cliente.tipo_id_vendedor;
                    var vendedor_id = args.pedido_cliente.vendedor_id;
                    var estado = args.pedido_cliente.estado;
                    var observaciones = args.pedido_cliente.observaciones;
                    var centro_utilidad_id = args.pedido_cliente.centro_utilidad_id;
                    var bodega_id = args.pedido_cliente.bodega_id;

                    if (j > 0) {
                        //INSERTAR ENCABEZADO
                        that.m_pedidos_clientes.insertar_cotizacion(empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones, centro_utilidad_id, bodega_id, function(err, array_pedido_cliente_id_tmp) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Error en Inserción del Encabezado de Cotización', 500, {}));
                                return;
                            }

                            var contrato_cliente_id = args.pedido_cliente.contrato_cliente_id;
                            var pedido_cliente_id_tmp = array_pedido_cliente_id_tmp[0].pedido_cliente_id_tmp;
                            var tipo_producto = args.pedido_cliente.tipo_producto;
                            var pagina_actual = 1;

                            productos_validos.forEach(function(producto_valido) {

                                var filtro = {
                                    buscar_todo: true,
                                    buscar_por_codigo: false,
                                    buscar_por_molecula: false,
                                    buscar_por_descripcion: false
                                };

                                var termino_busqueda = producto_valido.codigo_producto;

                                //Consultar tipo_producto_id y cantidad_pendiente
                                that.m_productos.listar_productos_clientes(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, "", "", pagina_actual, filtro, function(err, lista_productos) {

                                    var i = lista_productos.length;

                                    if (i === 0) {
                                        res.send(G.utils.r(req.url, 'Lista de productos vacía', 200, {lista_productos: []}));
                                        return;
                                    }

                                    lista_productos.forEach(function(producto) {

                                        //Datos a Insertar
                                        var codigo_producto = producto_valido.codigo_producto;
                                        var porc_iva = producto.porc_iva;
                                        var numero_unidades = parseInt(producto_valido.cantidad_solicitada);
                                        //var valor_unitario = parseFloat(producto_valido.precio_unitario);
                                        var valor_unitario = 0;

                                        if (parseFloat(producto.precio_contrato) > 0)
                                            valor_unitario = parseFloat(producto.precio_contrato);
                                        else
                                            valor_unitario = parseFloat(producto.precio_venta_anterior);

                                        var tipo_producto_id = producto.tipo_producto_id;

                                        //INSERTAR DETALLE
                                        that.m_pedidos_clientes.insertar_detalle_cotizacion(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto_id, function(err, rows, result) {
                                            if (err) {
                                                productos_invalidos.push(producto);
                                            }
                                            if (--j === 0) {
                                                res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedido_cliente_detalle: {numero_cotizacion: pedido_cliente_id_tmp, productos_validos: productos_validos, productos_invalidos: productos_invalidos}}));
                                                return;
                                            }

                                        });

                                    });
                                });
                            });
                        });
                    }

                    else {
                        res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedido_cliente_detalle: {numero_cotizacion: pedido_cliente_id_tmp, productos_validos: productos_validos, productos_invalidos: productos_invalidos}}));
                        return;
                    }

                });
            }
        } else {
            // Error
            //console.log('Se ha generado error subiendo el archivo Plano. Revise el formato!');
            res.send(G.utils.r(req.url, 'Se ha generado error subiendo el archivo Plano. Revise el formato!', 404, {}));
            return;
        }
    });
};

// ????????????????????????????????????????

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

// ????????????????????????????????????????
function __validar_productos_archivo_plano(contexto, contenido_archivo_plano, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];
    var filas = [];


    contenido_archivo_plano.forEach(function(row) {
        filas.push(row);
    });


    var i = filas.length;

    //Programar aquí la validación de la cantidad de columnas
    //var cantidad_columnas = filas[0].length;

    //console.log(">>>>>>>>>>>>>> La Cantidad de Columnas es: ", cantidad_columnas);

    filas.forEach(function(row) {
        var codigo_producto = row[0] || '';
        var cantidad_solicitada = row[1] || 0;
        //var precio_unitario = row[2] || 0;

        that.m_productos.validar_producto(codigo_producto, function(err, existe_producto) {

            //var producto = {codigo_producto: codigo_producto, cantidad_solicitada: cantidad_solicitada, precio_unitario: precio_unitario};
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
