
var PedidosCliente = function (pedidos_clientes, eventos_pedidos_clientes, productos, m_pedidos,
        m_terceros, emails, pedidos_farmacias, m_pedidos_clientes_log, terceros_clientes_model,m_pedidos_logs) {


    this.m_pedidos_clientes = pedidos_clientes;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_clientes = eventos_pedidos_clientes;
    this.m_productos = productos;
    this.m_pedidos = m_pedidos;
    this.m_terceros = m_terceros;
    this.emails = emails;
    this.m_pedidos_logs = m_pedidos_logs;
    this.m_pedidos_clientes_log = m_pedidos_clientes_log;
    this.terceros_clientes_model = terceros_clientes_model;
};

/**
 * +Descripcion Controlador encargado de consultar la lista de facturas
 *              de un pedido
 *  @author Cristian Ardila
 *  @fecha 2017-01-02
 */
PedidosCliente.prototype.listarFacturasPedido = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.pedidos_clientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.pedidos_clientes.numeroPedido === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de pedido', 404, {pedidos_clientes: []}));
        return;
    }

    var pedido = args.pedidos_clientes.numeroPedido;

    var parametros = {pedido: pedido};
    G.Q.ninvoke(that.m_pedidos_clientes, 'listarFacturasPedido', parametros).then(function (resultado) {

        if (resultado.length > 0) {

            res.send(G.utils.r(req.url, 'Consulta facturas', 200, {listar_tipo_documento: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }


    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();


};

/**
 * +Descripcion Actualizar estado del pedido
 *  @author Andres Gonzalez
 *  @fecha 2017-11-24
 */
PedidosCliente.prototype.actualizarEstadoPedido = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.pedidos_clientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.pedidos_clientes.numeroPedido === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de pedido', 404, {pedidos_clientes: []}));
        return;
    }
    if (args.pedidos_clientes.estado === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el estado que desea actualizar', 404, {pedidos_clientes: []}));
        return;
    }
   var usuario=req.session.user.usuario_id;
    
   var parametros ={
                    numeroPedido: args.pedidos_clientes.numeroPedido , 
		    estado: args.pedidos_clientes.estado,
		    numeroUnidades:0,
		    empresa_id:args.pedidos_clientes.empresa_id
		   };

   G.knex.transaction(function(transaccion) {
     /*
      * nota: al actualizar el detalle se ejecuta un trigger que coloca el estado en 3 cuando numero_unidades es 0
      */
	G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarNumeroUnidades',parametros,transaccion).then(function() {
	   
	   return G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstado',parametros,transaccion );

	}).then(function(resultado) {
	    
	     transaccion.commit();
	    
	}).fail(function (err) {
	    
	    transaccion.rollback(err);
	    
	}).done();

    }).then(function(result) {
	
	 var obj = {
            usuarioId: usuario, accion: '2', tipoPedido: '0', numeroPedido: parametros.numeroPedido,
            empresaId: parametros.empresa_id, codigoProducto: 0,
            cantidadSolicitada: 0, cantidadActual: 0
        };

        return G.Q.ninvoke(that.m_pedidos_logs, "guardarLog", obj);
	
    }).then (function(result) {
	
	 res.send(G.utils.r(req.url, 'actualizar Estado Pedido', 200, {pedidos: result}));
    }). catch (function(err) {
	 console.log("error transaccion ",err);
         res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};
/**
 * @api {post} /api/PedidosClientes/listarPedidos Listar Pedidos
 * @apiName Listar Pedidos Clientes
 * @apiGroup PedidosClientes
 * @apiDescription Proporciona un listado de Pedidos de Clientes, permite filtrar lo pedidos por los siguientes campos,
 * numero del pedido, identificacion o nombre del tercero, direccion, telefono, identificacion o nombre del vendedor.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de AutenticaciÃ³n, este define si el usuario esta autenticado o no.
 * @apiParam {Number} empresa_id Identificacion de la empresa de la cual se requieren los pedidos.
 * @apiParam {String} termino_busqueda Termino por el cual desea filtrar los pedidos.
 * @apiParam {Number} pagina_actual Numero de la pagina, requerido para la paginacion.
 */
PedidosCliente.prototype.listarPedidosClientes = function (req, res) {

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

    var fecha_inicial;
    var fecha_final;

    if (args.pedidos_clientes.fecha_inicial !== undefined || args.pedidos_clientes.fecha_final !== undefined) {
        fecha_inicial = args.pedidos_clientes.fecha_inicial;
        fecha_final = args.pedidos_clientes.fecha_final;
        //args.pedidos_clientes.filtros.filtroEstadoFacturado = args.pedidos_clientes.filtroEstadoFacturado;  
    }


    var empresa_id = args.pedidos_clientes.empresa_id;
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    var pagina_actual = args.pedidos_clientes.pagina_actual;

    var estadoPedido = args.pedidos_clientes.estado_pedido;
    var estadoSolicitud = args.pedidos_clientes.estado_solicitud;

    if (!args.pedidos_clientes.filtros) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }

    if (args.pedidos_clientes.filtro) {
        
        var extend = require('util')._extend;

        args.pedidos_clientes.filtros = extend(args.pedidos_clientes.filtro, args.pedidos_clientes.filtros); 
        
    }
    
    var filtro = args.pedidos_clientes.filtros;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id,
            termino_busqueda,
            filtro,
            pagina_actual,
            estadoPedido,
            estadoSolicitud,
            fecha_inicial,
            fecha_final, function (err, lista_pedidos_clientes) {
                
                res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));


            });
};


/**
 * @api {post} /api/PedidosClientes/asignarResponsable Asignar Responsables
 * @apiName Asignar Responsables.
 * @apiGroup PedidosClientes
 * @apiDescription Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de AutenticaciÃ³n, este define si el usuario esta autenticado o no.
 * @apiParam {String[]} pedidos Lista de pedidos
 * @apiParam {Number} estado_pedido ID del estado a asignar
 * @apiParam {Number} responsable Operario de Bodega al que se le asigna el pedido.
 * @apiSuccessExample Ejemplo VÃ¡lido del Request.
 */

PedidosCliente.prototype.asignarResponsablesPedido = function (req, res) {

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

    pedidos.forEach(function (numero_pedido) {


        G.Q.ninvoke(that.m_pedidos_clientes, "consultar_pedido", numero_pedido).then(function (cabecera_pedido) {
            if (cabecera_pedido[0].estado_actual_pedido === '0' || cabecera_pedido[0].estado_actual_pedido === null ||
                    cabecera_pedido[0].estado_actual_pedido === '8' || cabecera_pedido[0].estado_actual_pedido === '1') {
                return  G.Q.ninvoke(that.m_pedidos_clientes, "asignar_responsables_pedidos", numero_pedido, estado_pedido, responsable, usuario);

            } else {
                throw {msj: "El estado actual del pedido " + numero_pedido + " no permite modificarlo", status: 403, obj: {encabezado_pedido: {}}};
            }
        }).spread(function (rows, responsable_estado_pedido) {
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

        }).fail(function (err) {
            if (!err.status) {
                err = {};
                err.status = 500;
                err.msj = "Se ha generado un error..";
            }

            res.send(G.utils.r(req.url, err.msj, err.status, {}));
        }).done();

    });
};


/**
 * @api {post} /api/PedidosClientes/asignarResponsable Asignar Responsables
 * @apiName Asignar Responsables.
 * @apiGroup PedidosClientes
 * @apiDescription Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de AutenticaciÃ³n, este define si el usuario esta autenticado o no.
 * @apiParam {String[]} pedidos Lista de pedidos
 * @apiParam {Number} estado_pedido ID del estado a asignar
 * @apiParam {Number} responsable Operario de Bodega al que se le asigna el pedido.
 * @apiSuccessExample Ejemplo VÃ¡lido del Request.
 */

PedidosCliente.prototype.eliminarResponsablesPedido = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido no esta definido.', 404, {}));
        return;
    }

    if (args.pedidos_clientes.numero_pedido === '' || args.pedidos_clientes.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero_pedido no puede ser 0 o vacÃ­o', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_clientes.numero_pedido;
    var estado_pedido = ''; // 0 = No asignado

    that.m_pedidos_clientes.consultar_pedido(numero_pedido, function (err, pedido_cliente) {

        if (err || pedido_cliente.length === 0) {

        } else {
            var pedido = pedido_cliente[0];

            if ((pedido.estado_actual_pedido === '0' || pedido.estado_actual_pedido === '1') && pedido.estado_separacion === null) {

                that.m_pedidos_clientes.obtener_responsables_del_pedido(numero_pedido, function (err, responsables_pedido) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 0', 500, {}));
                        return;
                    } else {

                        if (responsables_pedido === undefined || responsables_pedido.length < 2) {
                            res.send(G.utils.r(req.url, 'El Pedido no ha registrado responsables', 500, {}));
                            return;
                        }

                        that.m_pedidos_clientes.eliminar_responsables_pedidos(numero_pedido, function (err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
                                // El estado del pedido es el inmediatamnte el anterior
                                estado_pedido = responsables_pedido[1].estado;

                                that.m_pedidos_clientes.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function (err, rows, resultado) {

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

                                        res.send(G.utils.r(req.url, 'El Pedido cambiÃ³ de estado correctamente', 200, {}));
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
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de AutenticaciÃ³n, este define si el usuario esta autenticado o no.
 * @apiParam {Number} operario_id Identificador asignado al operario de Bodega.
 * @apiParam {Number} pagina_actual Numero de la pagina que requiere.
 * @apiParam {Number} [limite] Cantidad de registros por cada pagina.
 * @apiSuccessExample Ejemplo VÃ¡lido del Request.
 */

PedidosCliente.prototype.listaPedidosOperariosBodega = function (req, res) {

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

    this.m_pedidos_clientes.listar_pedidos_del_operario(operario_bodega, termino_busqueda, filtro, pagina_actual, limite, function (err, lista_pedidos_clientes, total_registros) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
            return;
        }


        var i = lista_pedidos_clientes.length;

        lista_pedidos_clientes.forEach(function (pedido) {

            // Calcular el tiempo de separacion del pedido
            var fecha_separacion = 0;
            var tiempo_separacion = 0;

            if (pedido.fecha_separacion_pedido) {
                fecha_separacion = new Date(pedido.fecha_separacion_pedido);
                tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);
            }

            pedido.tiempo_separacion = tiempo_separacion;

            that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function (err, detalle_pedido) {
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
PedidosCliente.prototype.listarProductosClientes = function (req, res) {


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
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacÃ­os', 404, {}));
        return;
    }

    if (args.pedidos_clientes.contrato_cliente_id === '') {
        res.send(G.utils.r(req.url, 'contrato_cliente_id esta vacÃ­o', 404, {}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === '' || parseInt(args.pedidos_clientes.pagina_actual) <= 0) {
        res.send(G.utils.r(req.url, 'pagina_actual esta vacio o es 0', 404, {}));
        return;
    }

    if (args.pedidos_clientes.molecula === undefined) {
        args.pedidos_clientes.molecula = '';
    }



    G.Q.ninvoke(that, "__listarProductosClientes", args).then(function (resultado) {

        res.send(G.utils.r(req.url, resultado.msj, resultado.status,
                {
                    pedidos_clientes:
                            {
                                lista_productos: resultado.data.productos.sort(dynamicSort("codigo_producto"))
                            }
                }
        )
                );

        return;


    }).fail(function (err) {

        res.send(G.utils.r(req.url, {err: err.msj, status: err.status}, {}));

    }).done();

};

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de listar los productos
 */
PedidosCliente.prototype.__listarProductosClientes = function (args, callback) {

    var that = this;

    var empresa_id = (args.pedidos_clientes.empresa_id === undefined)
            ? args.pedidos_clientes.cotizacion.empresa_id
            : args.pedidos_clientes.empresa_id;
    var centro_utilidad = (args.pedidos_clientes.centro_utilidad_id === undefined)
            ? args.pedidos_clientes.cotizacion.centro_utilidad_id
            : args.pedidos_clientes.centro_utilidad_id;
    var bodega = (args.pedidos_clientes.bodega_id === undefined)
            ? args.pedidos_clientes.cotizacion.bodega_id
            : args.pedidos_clientes.bodega_id;
    var contrato_cliente = args.pedidos_clientes.contrato_cliente_id;
    var estadoMultiplePedido = args.pedidos_clientes.estadoMultiplePedido;

    var filtro = {
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto,
        termino_busqueda: args.pedidos_clientes.termino_busqueda,
        laboratorio_id: (args.pedidos_clientes.laboratorio_id === undefined) ? '' : args.pedidos_clientes.laboratorio_id,
        numero_cotizacion: (args.pedidos_clientes.numero_cotizacion === undefined) ? '' : args.pedidos_clientes.numero_cotizacion,
        numero_pedido: (args.pedidos_clientes.numero_pedido === undefined) ? '' : args.pedidos_clientes.numero_pedido,
        filtro_producto: 0
    };

    var filtroAvanzado = {
        molecula: args.pedidos_clientes.molecula,
        laboratorio_id: args.pedidos_clientes.laboratorio_id,
        codigoProducto: args.pedidos_clientes.codigoProducto,
        descripcionProducto: args.pedidos_clientes.descripcionProducto,
        concentracion: args.pedidos_clientes.concentracion,
        tipoBusqueda: args.pedidos_clientes.tipoBusqueda,
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto
    };

    var filtros = args.pedidos_clientes.filtro;
    var pagina = args.pedidos_clientes.pagina_actual;


    var parametros = {estadoMultiplePedido: estadoMultiplePedido,
        empresa_id: empresa_id,
        centro_utilidad: centro_utilidad,
        bodega: bodega,
        contrato_cliente: contrato_cliente,
        filtro: filtro,
        pagina: pagina,
        filtros: filtros,
        filtroAvanzado: filtroAvanzado
    };

    var objBodegaPedido = {sw_modulo: '1'};
  
    G.Q.ninvoke(that.m_pedidos_farmacias, "listarBodegasPedidos", objBodegaPedido).then(function (bodegasPedidos) {


        if (estadoMultiplePedido === 0) {

            bodegasPedidos = [];
            bodegasPedidos [0] = {empresa_id: empresa_id,
                centro_utilidad_id: centro_utilidad,
                bodega_id: bodega,
                orden: 1}

        }
        if (bodegasPedidos.length === 0) {

            throw {msj: 'No hay bodegas parametrizadas', status: 401, pedidos_clientes: {}};
        }

        return G.Q.nfcall(__bodegasPedidos, that, 0, bodegasPedidos, [], empresa_id,
                centro_utilidad,
                bodega,
                contrato_cliente,
                filtro,
                pagina,
                filtros, filtroAvanzado);


    }).then(function (productos) {

        return G.Q.nfcall(__productosBodegas, that, 0, productos, []);


    }).then(function (productos) {

        if (productos.length > 0) {

            callback(false, {status: 200, msj: 'Lista de productos', data: {productos: productos.sort(dynamicSort("bodega"))}});

        } else {
            throw {msj: 'El producto no existe', status: 401, pedidos_clientes: {}};
        }

    }).fail(function (err) {
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        callback(err, {status: status, msj: msj, data: {productos: {}}});

    }).done();

};

/**
 * +Descripcion Metodo encargado de ordenar los elementos de un arreglo
 *              en orden descendente
 *  @author http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
 */
function dynamicSort(property) {

    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * +Descripcion: Metodo encargado de unificar los arreglos de productos que
 *               lleguen
 *  @author Andres Mauricio Tascon
 *  @fecha 15/02/2017
 */
function __productosBodegas(that, index, productos, listaProductos, callback) {

    var producto = productos[index];

    if (!producto) {

        callback(false, listaProductos);
        return;
    }
    producto.forEach(function (row) {
        listaProductos.push(row);
    });
    index++;
    setTimeout(function () {
        __productosBodegas(that, index, productos, listaProductos, callback);
    }, 0);

}
;

/**
 * +Descripcion Metodo encargado de consultar los productos segun las bodegas
 *              enviadas lo cual por cada consulta por bodega generara un arreglo
 *              diferente posteriormente se almacenan en un nuevo arreglo de productos
 *              
 *  @author Cristian Ardila
 *  @fecha 15/02/2017            
 */
function __bodegasPedidos(that, index, bodegasPedidos, listaProductos, empresa_id,
        centro_utilidad,
        bodega,
        contrato_cliente,
        filtro,
        pagina,
        filtros, filtroAvanzado, callback) {

    var bodegas = bodegasPedidos[index];

    if (!bodegas) {

        callback(false, listaProductos);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_pedidos_clientes, "listar_productos",
            bodegas.empresa_id, bodegas.centro_utilidad_id, bodegas.bodega_id, contrato_cliente, filtro, pagina, filtros, filtroAvanzado).then(function (resultado) {

        if (resultado.length > 0) {

            listaProductos.push(resultado);

        }

        setTimeout(function () {
            __bodegasPedidos(that, index, bodegasPedidos, listaProductos, empresa_id,
                    centro_utilidad,
                    bodega,
                    contrato_cliente,
                    filtro,
                    pagina,
                    filtros, filtroAvanzado, callback);
        }, 0);

    }).fail(function (err) {
        console.log("err (/fail) [__bodegasPedidos]: ", err);
    }).done();

}
;




/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/





/*
 * Autor : Camilo Orozco
 * Descripcion : Insertar cotizacion
 */
PedidosCliente.prototype.insertarCotizacion = function (req, res) {

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
    if (!cotizacion.empresa_id || !cotizacion.centro_utilidad_id || !cotizacion.bodega_id) {
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

    if(args.pedidos_clientes.estadoMultiplePedido === undefined){
     res.send(G.utils.r(req.url, 'estadoMultiplePedido esta vacia', 404, {}));
     return;
     
     }
    cotizacion.usuario_id = req.session.user.usuario_id;
    cotizacion.estadoMultiplePedido = args.pedidos_clientes.estadoMultiplePedido;
    var obj = {
        "tipo_id_tercero": cotizacion.cliente.tipo_id_tercero,
        "tercero_id": cotizacion.cliente.id
    };
    
    G.Q.ninvoke(that, "__insertarCotizacion", obj, cotizacion).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Cotizacion registrada correctamente', 200, resultado));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, err.msj, err.status, {pedidos_clientes: {}}));
    });

};

PedidosCliente.prototype.__insertarCotizacion = function (obj, cotizacion, callback) {

    var that = this;

    G.Q.ninvoke(that.terceros_clientes_model, "obtenterClientePorId", obj).
            then(function (tercero) {

                if (tercero[0].tipo_bloqueo_id !== '1') {
                    throw {msj: "El cliente seleccionado se encuentra bloqueado o inactivo", status: 403};
                } else {
                    return G.Q.ninvoke(that.m_pedidos_clientes, "insertar_cotizacion", cotizacion);
                }

            }).spread(function (rows, result) {

        var numero_cotizacion = (rows.length > 0) ? rows[0].numero_cotizacion : 0;
        callback(false, {pedidos_clientes: {numero_cotizacion: numero_cotizacion}});


    }).fail(function (err) {
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        callback(err, {status: status, msj: msj});

    }).done();

};
/*
 * @autor : Cristian Manuel Ardila Troches
 * @fecha 02/12/2015
 * +Descripcion : Metodo encargado de insertar los productos en una cotizacion
 */
PedidosCliente.prototype.insertarDetalleCotizacion = function (req, res) {

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
        res.send(G.utils.r(req.url, 'La cantidad solicitada no puede ser menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precioVentaIva === undefined || producto.precioVentaIva === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.precioVentaIva <= 0) {
        res.send(G.utils.r(req.url, 'El valor del precio de venta no puede ser cero (0)', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;

    var parametros = {empresaId: cotizacion.empresa_id, codigoProducto: producto.codigo_producto, contratoId: cotizacion.cliente.contrato_id};

    var obj = {
        "tipo_id_tercero": cotizacion.cliente.tipo_id_tercero,
        "tercero_id": cotizacion.cliente.id
    };
    
    
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalProductosCotizacion', cotizacion.numero_cotizacion).then(function(resultado){
         
        if(resultado[0].total >= 60){
            throw {msj: "La cantidad de items no puede exceder las 60 unidades", status: 403};
        }else{
            return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: producto.cantidad_solicitada, codigo_producto: producto.codigo_producto});
        }
            
    }).then(function (resultado) {

                if (resultado.length > 0 && resultado[0].valido === '1') {
                    return G.Q.ninvoke(that.terceros_clientes_model, "obtenterClientePorId", obj);
                } else {
                    throw {msj: "La cantidad no corresponde a la unidad de medida", status: 403};
                }

            }).then(function (tercero) {

        if (tercero[0].tipo_bloqueo_id !== '1') {
            throw {msj: "El cliente seleccionado se encuentra bloqueado o inactivo", status: 403};
        } else {
            return G.Q.ninvoke(that.m_productos, 'consultarPrecioReguladoProducto', parametros);
        }

    }).then(function (resultado) {

        /**
         * +Descripcion: Se invoca la funcion con un object {valido=boolean, msj = string}
         */
        var precioVenta = __validarPrecioVenta(producto, resultado, 0);

        if (precioVenta.valido) {
            return  G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoCotizacion', cotizacion.numero_cotizacion);
        } else {
            throw {msj: precioVenta.msj, status: 403};
        }
    }).then(function (rows) {

        /**
         * +Descripcion: Se valida si el estado de la cotizacion es
         *               1 activo
         *               4 activo (desaprobado por cartera)
         */
        if (rows[0].estado === '1' || rows[0].estado === '4') {
            return  G.Q.ninvoke(that.m_pedidos_clientes, 'consultarProductoDetalleCotizacion', cotizacion.numero_cotizacion, producto);
        } else {
            throw {msj: 'La cotizacion debe encontrarse activa o desaprobada por cartera', status: 403};
        }

    }).then(function (rows) {

        /**
         * +Descripcion: Se valida si el producto es diferente al del detalle
         *               y si es asi se procede a modficar el detalle
         */
        if (rows.length === 0) {
            return  G.Q.ninvoke(that.m_pedidos_clientes, 'insertar_detalle_cotizacion', cotizacion, producto);
        } else {
            throw {msj: 'El producto ya aparece registrado en la cotizacion', status: 403};
        }

    }).then(function (resultado) {

        if (resultado.rowCount === 0) {
            throw {msj: 'Error al registrar el producto', status: 403};
        } else {
            res.send(G.utils.r(req.url, 'Producto registrado correctamente', 200, {pedidos_clientes: {}}));
        }

    }).fail(function (err) {

        var msj = "Error interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        res.send(G.utils.r(req.url, msj, status, {pedidos_clientes: {}}));
        //res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};



/*
 * Autor : Camilo Orozco
 * Descripcion : Modificar detalle cotizacion
 */
PedidosCliente.prototype.modificarDetalleCotizacion = function (req, res) {


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
        res.send(G.utils.r(req.url, 'La cantidad solicitada no puede ser menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    cotizacion.usuario_id = req.session.user.usuario_id;


    var paramLogExistencia = {
        numero: cotizacion.numero_cotizacion,
        tipo: '0',
        pendiente: 0
    };


    /*Se invoca la funcion encargada de traer los parametros para actualizar el estado
     del pedido a aprobado o denegado por cartera*/
    var paramLogCotizacionActualizar = __parametrosLogs(cotizacion.numero_cotizacion, cotizacion.productos, cotizacion.usuario_id, cotizacion.observacion_cartera, cotizacion.total, 0, 0);
    var precioProducto;
    
    var parametros = {empresaId: producto.empresaIdProducto,
    codigoProducto: producto.codigo_producto,
    contratoId: cotizacion.cliente.contrato_id};
    
    G.Q.ninvoke(that.m_productos, 'consultarPrecioReguladoProducto', parametros).then(function (_precioProducto) {
        precioProducto = _precioProducto;
        return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoCotizacion', cotizacion.numero_cotizacion);
    }).then(function (resultado) {

        /**
         * +Descripcion: Se valida si el estado de la cotizacion es
         *               1 activo
         *               4 activo (desaprobado por cartera)
         */
        if (resultado[0].estado === '1' || resultado[0].estado === '4') {
            return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: producto.cantidad_solicitada, codigo_producto: producto.codigo_producto})

        } else {
            throw 'La cotizacion debe encontrarse activa o desaprobada por cartera';
        }

    }).then(function (resultado) {
        
        
        var precioVenta = __validarPrecioVenta(producto, precioProducto, 0);
        
        if (precioVenta.valido) {
            if (resultado.length > 0 && resultado[0].valido === '1') {
                return  G.Q.ninvoke(that.m_pedidos_clientes, 'modificar_detalle_cotizacion', cotizacion, producto);

            } else {
                throw  "La cantidad no corresponde a la unidad de medida";
            }
        } else {
            throw precioVenta.msj;
        }



    }).then(function (resultado) {

        if (resultado > 0) {

            res.send(G.utils.r(req.url, 'Se modifica la cotizacion satisfactoriamenteo', 200, {pedidos_clientes: {}}));
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);

        } else {
            throw 'Error al modificar el producto';
        }
    }).then(function (resultado) {

        /**
         * +Descripcion Si el numero de cotizacion ya se encuentra en la tabla
         *              de trazabilidad de ventas, lo que hara sera actualizar
         *              la informacion, de lo contrario lo creara
         */
        if (resultado.length > 0) {

            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logActualizarSolicitudProducto', paramLogCotizacionActualizar);
        }
    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

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
PedidosCliente.prototype.actualizarCabeceraCotizacion = function (req, res) {


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
    var parametros = {
        cotizacion :cotizacion,
        bodegaActual : args.pedidos_clientes.bodega,
        bodegaDestino : args.pedidos_clientes.bodega,
        that :that,
        clienteMultiple : args.pedidos_clientes.clienteMultiple
    };
    

    G.Q.nfcall(that.m_pedidos_clientes.actualizarCabeceraCotizacion, cotizacion).then(function (rows) {
         
      return parametros.clienteMultiple===1?true:false;
        
    }).then(function (resultado) {   
        
        if(resultado){
            
         return G.Q.nfcall(__insertarCabeceraDetalleBodegasMultiple,parametros);
         
        }else{
            
          return false; 
          
        }
        
    }).then(function (resultado) {   

        res.send(G.utils.r(req.url, 'Observacion actualizada correctamente', 200, {pedidos_clientes: ''}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Error Interno", 500, {pedidos_clientes: []}));

    }).done();

};

function __insertarCabeceraDetalleBodegasMultiple(parametros,callback){
    
    G.Q.ninvoke(parametros.that.m_pedidos_clientes,"consultar_detalle_cotizacion", parametros.cotizacion,"").then(function (rows) {
   
        return G.Q.nfcall(__agruparProductosPorBodega,rows[0]);
     
    }).then(function (resultado) { 
         
          return G.Q.nfcall(__insertarCabeceraClientesCotizacion,resultado,parametros,0);
 
        
    }).then(function (resultado) {    
        
        callback(false);
        
    }).fail(function (err) {
//console.log("Error __insertarCabeceraDetalleBodegasMultiple",err);
   callback(err);     

    }).done();
    
}

function __agruparProductosPorBodega(data,callback){
   var agrupacion=[];
   
   data.forEach(function(item){
       
       if(Array.isArray(agrupacion[item.bodega_origen_producto])){           
           agrupacion[item.bodega_origen_producto].push(item);
       }else{
           agrupacion[item.bodega_origen_producto]=[];
           agrupacion[item.bodega_origen_producto].push(item);
       }
       
   });
    callback(false,agrupacion);    
}

function __insertarCabeceraClientesCotizacion(datos,parametros,index,callback){
 
  
 if(!Object.keys(datos)[index]){
   callback(false);   
 }

   var cabecera={ bodega : Object.keys(datos)[index], numero_cotizacion : datos[Object.keys(datos)[index]][0].numero_cotizacion};
   var empresa=datos[Object.keys(datos)[index]][0].empresa_origen_producto;
   var centro_utilidad=datos[Object.keys(datos)[index]][0].centro_utilidad_origen_producto;
   var bodega=datos[Object.keys(datos)[index]][0].bodega_origen_producto;
   var productos=datos[Object.keys(datos)[index]];
   index++;
   
 if(parametros.bodegaActual !== cabecera.bodega){

    G.Q.ninvoke(parametros.that.m_pedidos_clientes,"insertar_encabezado_pedido_cliente", cabecera).then(function (rows) {
   
         parametros.bodega=cabecera.bodega;
         parametros.numeroPedido=rows.rows[0].numero_pedido;
         parametros.numeroPedidoorigen=cabecera.numero_cotizacion;

         return G.Q.ninvoke(parametros.that.m_pedidos_clientes,"insertar_detalle_pedido_cliente",parametros);
        
    }).then(function (resultado) {  
        
        return G.Q.ninvoke(parametros.that.m_pedidos_clientes,"insertar_ventas_ordenes_pedido_multiple_clientes",parametros);
        
    }).then(function (resultado) {  
      
        return G.Q.nfcall(__totalizarPedido,productos,0,0);
        
    }).then(function (resultado) { 
       
       var  cotizacion=  {numero_cotizacion:parametros.numeroPedido, total:resultado,empresa_id:empresa,centro_utilidad_id:centro_utilidad,bodega_id:bodega};
    
       return G.Q.ninvoke(parametros.that.m_pedidos_clientes,"generar_pedido_cliente",cotizacion);
        
    }).then(function (resultado) {
        
        __insertarCabeceraClientesCotizacion(datos,parametros,index,callback);
       
    }).fail(function (err) {

     callback(err);  

    }).done();
    
    }else{ 
        
     __insertarCabeceraClientesCotizacion(datos,parametros,index,callback);
    
    }
}


function __totalizarPedido(productos,index,total,callback){
    var producto=productos[index];
    if(!producto){
        callback(false,total);
    }
    total+=parseFloat(producto.total);
    index++;
    __totalizarPedido(productos,index,total,callback);        
}

PedidosCliente.prototype.consultarPedidoMultipleCliente = function (req, res) {
     var that = this;
     var args = req.body.data;
     parametros= {cotizacion:args.cotizacion};
     
    G.Q.nfcall(that.m_pedidos_clientes.consultarPedidoMultipleCliente,parametros ).then(function (rows) {

        res.send(G.utils.r(req.url, 'Consulta correcta', 200, {consultarPedidoMultipleCliente: rows}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {consultarPedidoMultipleCliente: err}));
    }).done();
     
}

PedidosCliente.prototype.actualizarBodegaCotizacionClientesMultiples = function (req, res) {
     var that = this;
     var args = req.body.data;
     parametros= {cotizacion:args.cotizacion,bodega:args.bodega};
     
    G.Q.nfcall(that.m_pedidos_clientes.actualizarBodegaCotizacionClientesMultiples,parametros ).then(function (rows) {

        res.send(G.utils.r(req.url, 'Consulta correcta', 200, {actualizarBodegaCotizacionClientesMultiples: rows}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {actualizarBodegaCotizacionClientesMultiples: err}));
    }).done();
     
}


/*
 * Author : Eduar Garcia
 * Descripcion :  Cambia el estado de una cotizacion
 */
PedidosCliente.prototype.modificarEstadoCotizacion = function (req, res) {
    var that = this;

    var args = req.body.data;
    var cotizacion = args.pedidos_clientes.cotizacion;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    G.Q.nfcall(that.m_pedidos_clientes.modificarEstadoCotizacion, cotizacion).then(function (rows) {

        that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
        res.send(G.utils.r(req.url, 'Cotizacion cambiada correctamente', 200, {pedidos_clientes: []}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {pedidos_clientes: []}));
    }).done();

};


/*
 * Autor : Camilo Orozco
 * Descripcion : Listar Cotizaciones
 */
PedidosCliente.prototype.listarCotizaciones = function (req, res) {

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

    if (!args.pedidos_clientes.filtro) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }

    var filtros = args.pedidos_clientes.filtro;

    var empresa_id = args.pedidos_clientes.empresa_id;
    var fecha_inicial = args.pedidos_clientes.fecha_inicial;
    var fecha_final = args.pedidos_clientes.fecha_final;
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    var pagina_actual = args.pedidos_clientes.pagina_actual;

    var estadoCotizacion = args.pedidos_clientes.estado_cotizacion;
    var bodega=args.pedidos_clientes.bodega.codigo;
console.log("req.session",req.session);
console.log("args.pedidos_clientes",args.pedidos_clientes.bodega.codigo);
    that.m_pedidos_clientes.listar_cotizaciones(empresa_id,
            fecha_inicial,
            fecha_final,
            termino_busqueda,
            pagina_actual,
            estadoCotizacion,
            filtros,bodega, function (err, lista_cotizaciones) {

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
PedidosCliente.prototype.eliminarCotizacion = function (req, res) {


    var that = this;

    var args = req.body.data;


    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes === '') {
        res.send(G.utils.r(req.url, 'La cotizacion no esta definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;

    if (cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'el numero de cotizacion no esta definido o esta vacÃ­o', 404, {}));
        return;
    }




    that.m_pedidos_clientes.consultarEstadoCotizacion(cotizacion.numero_cotizacion, function (err, rows) {

        /**
         * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
         */
        if (!err) {
            /**
             * +Descripcion: Se valida si el numero de la cotizacion ya se encuentra
             *               en la tabla ventas_ordenes_pedidos
             */
            if (rows.length === 0 || rows[0].estado === '1') {

                /**
                 * +Descripcion: Se valida si ya se genero un pedido por medio de la cotizacion
                 */
                that.m_pedidos_clientes.consultaCotizacionEnPedido(cotizacion.numero_cotizacion, function (estado, rows) {
                    /**
                     * +Descripcion: se valida que la consulta se ejecute satisfactoriamente
                     */
                    if (!estado) {
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
                            that.m_pedidos_clientes.eliminarDetalleCotizacion(cotizacion.numero_cotizacion, function (estado, rows) {

                                if (estado) {
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

            } else {
                res.send(G.utils.r(req.url, 'La cotizacion solo debe estar en estado activo', 404, {pedidos_clientes: []}));
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
 * Descripcion : Consultar Cotizacion
 */
PedidosCliente.prototype.consultarCotizacion = function (req, res) {

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

    that.m_pedidos_clientes.consultar_cotizacion(cotizacion, function (err, cotizacion) {

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
PedidosCliente.prototype.consultarDetalleCotizacion = function (req, res) {

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

    var termino_busqueda = args.pedidos_clientes.termino_busqueda;


    G.Q.ninvoke(that.m_pedidos_clientes, "consultar_detalle_cotizacion", cotizacion, termino_busqueda).then(function (resultado) {
       
        if (resultado[0].length > 0) {
            res.send(G.utils.r(req.url, 'Cotizacion', 200, {pedidos_clientes: {lista_productos: resultado[0]}}));
            return;
        } else {
            throw 'Consulta sin resultados';
            return;
        }

    }).fail(function (err) {
        console.log("err ", err)
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};


/*
 * Autor : Camilo Orozco
 * Descripcion : Eliminar Producto Cotizacion
 */
PedidosCliente.prototype.eliminarProductoCotizacion = function (req, res) {

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

    /**
     * +Descripcion: Se permitira ejecutar la accion de eliminar_producto_cotizacion
     *               siempre y cuando la cotizacion tenga el estado (Estado del Pedido ) 1
     *               estado_pedido (Estado de solicitud ) 4 pero anterior a esto
     *               se validara de que la cotizacion al menos quede con un solo pro-
     *               ducto
     */
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalProductosCotizacion', cotizacion.numero_cotizacion).then(function (resultado) {

        if (resultado.length > 0) {

            if (resultado[0].total === "1") {
                throw 'La cotizacion no puede quedar sin productos';
                return;
            } else {
                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoCotizacion', cotizacion.numero_cotizacion);
            }
        }

    }).then(function (resultado) {

        /**
         * +Descripcion: Se valida si el estado de la cotizacion es
         *               1 activo
         *               4 activo (desaprobado por cartera)
         */
        if (resultado[0].estado === '1' || resultado[0].estado === '4') {
            return G.Q.ninvoke(that.m_pedidos_clientes, 'eliminar_producto_cotizacion', cotizacion, producto);
        } else {
            throw 'Para modificar la cotizacion debe estar activa o desaprobada por cartera';
            return;
        }

    }).then(function (resultado) {

        if (resultado > 0) {
            res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {pedidos_clientes: []}));
            return;
        } else {
            throw 'Error al eliminar el producto';
            return;
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();


};


/*
 * Autor : Camilo Orozco
 * Descripcion : Cargar Archivo Plano
 */
PedidosCliente.prototype.cotizacionArchivoPlano = function (req, res) {

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
    var estadoMultiplePedido = args.pedidos_clientes.estadoMultiplePedido;
    cotizacion.usuario_id = req.session.user.usuario_id;
    cotizacion.estadoMultiplePedido = args.pedidos_clientes.estadoMultiplePedido;

    var limite_productos = 60;
    var usuario = req.session.user;
    var _productosInvalidosNoExistentes = "";
    var _productosValidosExistentes = "";
    var _productosPlanoValidadosValido = "";
    var _productosPlanoValidadosInvalido = "";
    var def = G.Q.defer();
    var __productoSinDisponibilidadTotal = "";
    var _detalleCotizacion = "";
    var productosPlano = "";
    /**
     * +Descripcion Consulta si la formula esta en estado activa o inactiva, ni no existe
     *              proseguira a crearse en los siguientes metodos
     */
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoCotizacion', cotizacion.numero_cotizacion).then(function (resultado) {

        /**
         * +Descripcion: Se valida si el estado de la cotizacion es
         *               1 activo
         *               4 activo (desaprobado por cartera)
         */
        if (resultado.length === 0 || resultado[0].estado === '1' || resultado[0].estado === '4') {
            /*
             *+Descripcion Se obtienen los productos del archivo plano 
             */
            return G.Q.nfcall(__subir_archivo_plano, req.files);

        } else {
            throw {msj: 'La cotizacion debe encontrarse activa o desaprobada por cartera', status: 500, data: {pedidos_clientes: {}}};
        }

    }).then(function (contenido) {
        
        if (contenido.length > 0) {
            /*
             * +Descripcion Se valida si cada uno de los productos existe en el inventario
             */
            return G.Q.nfcall(__validar_productos_archivo_plano, that, 0, contenido, [], []);  

        } else {
            throw {msj: "El archivo esta vacio", status: 500, data: {pedidos_clientes: {}}};
        }

    }).then(function (productosPlano) {
        /*
         * +Descripcion Productos que no se encuentran en el inventario
         */
        _productosInvalidosNoExistentes = productosPlano[1];
        _productosValidosExistentes = productosPlano[0];

        if (productosPlano[0].length > limite_productos) {
            throw {msj: "Lista de Productos excede el limite permitido 25 productos por pedido", status: 400, data: {pedidos_clientes: {}}};

        } else {
            /**
             * +Descripcion Se verifica el precio de venta del producto, si es regulado
             */
            return G.Q.nfcall(__validar_datos_productos_archivo_plano, that, args, _productosValidosExistentes, [], [], 0);
        }


    }).then(function (productosPlanoValidados) {
        return G.Q.nfcall(__productosBodegas, that, 0, productosPlanoValidados[0], []);

    }).then(function (resultado) {

        return G.Q.nfcall(__agregarCantidadSolicitadaProducto, that, 0, resultado, _productosValidosExistentes, [], []);

    }).then(function (resultado) {

        return G.Q.nfcall(__cantidadSolicitadaProducto, that, 0, args, resultado[0], [], []);

    }).then(function (resultado) {

        
        _productosPlanoValidadosValido = resultado[0];
        productosPlano = resultado[0];
        _productosPlanoValidadosInvalido = resultado[1];

        /*
         * +Descripcion Productos invalidos que no cumplen
         *  1) Precio regulado
         *  2) unidad de medida
         */

        if (_productosPlanoValidadosValido.length === 0) {

            throw {msj: 'Lista de Productos 1',
                status: 200,
                data: {pedidos_clientes: {
                        productos_validos: _productosPlanoValidadosValido,
                        productos_invalidos: _productosPlanoValidadosInvalido === undefined ? _productosPlanoValidadosInvalido : _productosPlanoValidadosInvalido.concat(_productosInvalidosNoExistentes)
                    }}};
            return;
        }

        return G.Q.ninvoke(that.m_pedidos_clientes, "consultar_detalle_cotizacion", cotizacion, '');

    }).then(function (resultadoConsultaDetalle) {

        _detalleCotizacion = resultadoConsultaDetalle[0];
        if (resultadoConsultaDetalle.length > limite_productos) {
            throw {msj: 'Lista de Productos excede el limite permitido 25 productos por pedido ', status: 400, data: {pedidos_clientes: {}}};
            return;
        }

        return G.Q.nfcall(__agrupar_productos_por_tipo, _productosPlanoValidadosValido, {}, 0);

    }).then(function (resultadoProductosAgrupados) {

        cotizacion.tipo_producto = (cotizacion.tipo_producto === '' || cotizacion.tipo_producto === undefined) ? Object.keys(resultadoProductosAgrupados) : cotizacion.tipo_producto;
        
        _productosPlanoValidadosValido = resultadoProductosAgrupados[cotizacion.tipo_producto[0]];

        if (_productosPlanoValidadosValido === undefined || _productosPlanoValidadosValido.length === 0) {
            throw {msj: 'Lista de Productos 2', status: 200, data: {pedidos_clientes: {
                        productos_validos: _productosPlanoValidadosValido,
                        productos_invalidos: _productosPlanoValidadosInvalido === undefined ?
                                _productosInvalidosNoExistentes : _productosPlanoValidadosInvalido.concat(_productosInvalidosNoExistentes)
                    }}};
            return;
        }
        /**
         * +Descripcion Se verifica si la cotizacion ya ha sido creada
         */
        if (cotizacion.numero_cotizacion === 0) {      
            return G.Q.ninvoke(that.m_pedidos_clientes, "insertar_cotizacion", cotizacion);
        } else {
            def.resolve();
        }

    }).then(function (rows, result) {

        cotizacion.numero_cotizacion = (!rows) ? cotizacion.numero_cotizacion : rows[0][0].numero_cotizacion;
        productosPreparadosCotizacion = [];
        productosPreparadosCotizacionInvalidos = [];

        return G.Q.nfcall(__productosValidosExtraidosPlano, that, 0, _productosPlanoValidadosValido, _productosValidosExistentes)

    }).then(function (resultado) {
    
        productosPlano.forEach(function(row){
            if(cotizacion.tipo_producto[0] !== row.tipo_producto_id){
                 row.mensajeError = 'El tipo del producto no corresponde al tipo de la cotizacion ';
                _productosPlanoValidadosInvalido.push(row);
            }

        })
        
        productosPreparadosCotizacion.forEach(function (row) {

            _productosValidosExistentes.forEach(function (row2) {

                if (row.codigo_producto === row2.codigo_producto) {

                    row2.totalSolicitado += row.sumaCantidadTotalSolicitadaBodega;
                    row2.totalDisponible += row.sumaCantidadTotalDisponibleBodega;
                }
            });
        });

        return G.Q.nfcall(__validarTotalSolicitadoBodegas, that, 0, productosPreparadosCotizacion, _productosValidosExistentes, [], [], estadoMultiplePedido);

    }).then(function (resultado) {


        __productoSinDisponibilidadTotal = resultado[1];

        if (resultado[0].length > 0) {
            return G.Q.nfcall(__insertarDetalleCotizacion, that, 0, usuario, cotizacion, resultado[0], []);
        } else {


            productosInvalidosTodos =
                    _productosPlanoValidadosInvalido === undefined ? _productosInvalidosNoExistentes :
                    _productosPlanoValidadosInvalido.concat(_productosInvalidosNoExistentes).concat(productosPreparadosCotizacionInvalidos, __productoSinDisponibilidadTotal);
        }
        throw {msj: 'Lista de Productos 3', status: 200, data: {pedidos_clientes: {
                    productos_validos: _productosPlanoValidadosValido,
                    productos_invalidos: productosInvalidosTodos
                }}};

        return;
        //
    }).then(function (resultado) {

        productosDuplicadosInvalidos = resultado;

        if (productosDuplicadosInvalidos.length > 0 || __productoSinDisponibilidadTotal.length > 0) {
            productosInvalidosTodos = _productosPlanoValidadosInvalido === undefined
                    ? productosDuplicadosInvalidos.concat(_productosInvalidosNoExistentes) :
                    _productosPlanoValidadosInvalido.concat(productosDuplicadosInvalidos).
                    concat(_productosInvalidosNoExistentes).concat(productosPreparadosCotizacionInvalidos, __productoSinDisponibilidadTotal);
        } else {
            productosInvalidosTodos = _productosPlanoValidadosInvalido === undefined
                    ? _productosInvalidosNoExistentes :
                    _productosPlanoValidadosInvalido.concat(_productosInvalidosNoExistentes).concat(productosPreparadosCotizacionInvalidos, __productoSinDisponibilidadTotal);
        }
       
        throw {msj: 'Cotizacion creada correctamente', status: 200, data: {pedidos_clientes: {
                    numero_cotizacion: cotizacion.numero_cotizacion,
                    productos_validos: _productosPlanoValidadosValido[0],
                    productos_invalidos: productosInvalidosTodos

                }}};
        return;

    }).fail(function (err) {

        console.log("err [cotizacionArchivoPlano]:", err);
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }
        res.send(G.utils.r(req.url, msj, status, err.data));
    }).done();

};



/**
 * 
 * pongo esta __productosValidosExtraidosPlano en vez de esta __seleccionarProductoMultipleDisponibilidadMayor
 */
function __productosValidosExtraidosPlano(that, index, productos, productosSolicitados, callback) {

    var productoPlano = productosSolicitados[index];

    var obj = {codigo_producto: '', cantidad_solicitada: 0, total_solicitado: 0, total_disponible: 0}

    if (!productoPlano) {

        callback(false);
        return;
    }


    index++;

    G.Q.nfcall(__seleccionarProductoMultipleDisponibilidadMayor, that, 0, productos, productoPlano,
            obj).then(function (resultado) {

        __productosValidosExtraidosPlano(that, index, productos, productosSolicitados, callback);
    }).fail(function (resultado) {
        callback(true);
    }).done();
}
;


/**
 * @author Cristian Ardila
 * +Descripcion Funcion que permite validar que la cantidad solicitada
 *              sea igual a la cantidad separada del producto en diferentes bodegas
 * @fecha 2017-03-06 YYYY-MM-DD
 */
function __validarTotalSolicitadoBodegas(that, index, productos, productosValidosExistentes, productosValidos, productosInvalidos, estadoMultiplePedido, callback) {

    var producto = productosValidosExistentes[index];

    if (!producto) {

        callback(false, productosValidos, productosInvalidos);
        return;
    }
    index++;
    productos.forEach(function (row) {


        if (producto.codigo_producto === row.codigo_producto) {

            if (estadoMultiplePedido === 1) {
                if (producto.totalSolicitado <= producto.totalDisponible) {//&& estadoMultiplePedido

                    productosValidos.push(row);
                } else {
                    productosInvalidos.push(row);
                }

            } else {

                if (producto.totalSolicitado <= producto.totalDisponible && producto.totalSolicitado === producto.cantidad_solicitada) {//&& estadoMultiplePedido
                    
                    productosValidos.push(row);
                } else {
                    row.mensajeError = "No hay disponibilidad suficiente";
                    row.cantidadValida = false;
                    productosInvalidos.push(row);
                }

            }

        }

    });

    __validarTotalSolicitadoBodegas(that, index, productos, productosValidosExistentes, productosValidos, productosInvalidos, estadoMultiplePedido, callback)

}


/**
 * Lo mas prudente es invocar esta funcion recursiva desde otra funcion recursiva que envie
 *     solo una vez cada producto solicitado y de esta manera garantizo que no haya duplicidad
 *     de productos en mi arreglo
 */
var productosPreparadosCotizacion = [];
var productosPreparadosCotizacionInvalidos = [];

function __seleccionarProductoMultipleDisponibilidadMayor(that, index, productos, productosSolicitados, obj, callback) {

    var producto = productos[index];
    var unidadMedida = 0;

    if (!producto) {
        callback(false, productosPreparadosCotizacion);
        return;
    }
    index++;


    /**
     * +Descripcion Se compara que el codigo del producto consultado de la lista
     *              de productos segun la bodega, corresponda con el codigo del producto del plano
     *              
     */
    if (producto.codigo_producto === productosSolicitados.codigo_producto) {

        //Se valida de que haya cantidad disponible en la bodega
        if (producto.cantidad_disponible > 0) {

            /*
             * +Descripcion Se valida si la cantidad disponible en bodega es menor a la cantidad
             *              solicitada
             */
            if (producto.cantidad_disponible < productosSolicitados.cantidad_solicitada) {
                /*
                 * +Descripcion Se valida si el producto se encuentra en otra bodega 
                 *              y que la cantidad solicitada del producto del plano
                 *              sea mayor a la cantidad solicitada separada hasta 
                 *              el momento en bodegas diferentes para el mismo producto
                 *              
                 */
                if (obj.codigo_producto === producto.codigo_producto && productosSolicitados.cantidad_solicitada > obj.total_solicitado) {



                    if (productosSolicitados.cantidad_solicitada > obj.total_solicitado) {
                        /*
                         * +Descripcion Si la cantidad disponible que hay en bodega es 
                         *              menor a la cantidad solicitada, se setea la cantidad solicitada del producto
                         *              con el valor de la cantidad disponible, esto con el objetivo de que
                         *              se separe una parte del producto de la bodega actual
                         *              Ejemplo:
                         *              cantidad solicitada = 15; cantidad disponible 5
                         *              cantidad solicitada = 5; quedara pendiente 10 cantidades la cual se buscara en
                         *              la otra bodega
                         *              
                         *              Si la cantidad disponible es mayor a la solicitada
                         *              restele a la cantidad solicitada la cantidad acumulada separada hasta ahora
                         *              del producto del plano en las bodegas donde se encuentre disponibilidad
                         *              Ejmeplo
                         *              cantidad solicitada = 100; cantidad separada hasta el momento = 60
                         *              cantidad solicitada = 40; ya que se habia separado en la bodega anterior 60 cantidades
                         */
                        /* if(producto.cantidad_disponible < productosSolicitados.cantidad_solicitada){
                         console.log("Entra si es menor la disponibilidad")
                         producto.cantidad_solicitada = producto.cantidad_disponible;
                         }else{*/

                        producto.cantidad_solicitada -= obj.cantidad_solicitada;
                        // }  

                        /**
                         * +Descripcion Se valida la unidad de medida que requiere el producto
                         *              para ser separado, si cumple con la unidad de medida el
                         *              producto se almacenara en el arreglo De productos validos
                         *              de lo contrario se almacenara en el arreglo de productos invalidos
                         */
                        unidadMedida = producto.cantidad_solicitada % (producto.unidad_medida === null ? 1 : producto.unidad_medida) === 0 ? 1 : 0;

                        if (unidadMedida === 1) {
                            obj.total_solicitado += producto.cantidad_solicitada;
                            obj.total_disponible += producto.cantidad_disponible;
                            productosPreparadosCotizacion.push(producto);

                        } else {
                            obj.cantidad_solicitada = 0;
                            productosSolicitados.mensajeError = "no hay disponibilidad suficiente";
                            productosSolicitados.cantidadValida = false;
                            productosPreparadosCotizacionInvalidos.push(productosSolicitados);
                        }
                    }

                } else {

                    obj.total_solicitado = 0;
                    producto.cantidad_solicitada = producto.cantidad_disponible;
                    obj.cantidad_solicitada = producto.cantidad_solicitada;
                    obj.codigo_producto = producto.codigo_producto;

                    unidadMedida = producto.cantidad_solicitada % (producto.unidad_medida === null ? 1 : producto.unidad_medida) === 0 ? 1 : 0;

                    if (unidadMedida === 1) {
                        obj.total_solicitado += producto.cantidad_solicitada;
                        obj.total_disponible += producto.cantidad_disponible;
                        productosPreparadosCotizacion.push(producto);
                    } else {
                        obj.cantidad_solicitada = 0;
                        productosSolicitados.mensajeError = "no hay disponibilidad suficiente";
                        productosSolicitados.cantidadValida = false;
                        productosPreparadosCotizacionInvalidos.push(productosSolicitados);
                    }
                }
            }


            if (producto.cantidad_disponible >= productosSolicitados.cantidad_solicitada) {
             
                if (obj.codigo_producto === producto.codigo_producto) {

                    if (productosSolicitados.cantidad_solicitada > obj.total_solicitado) {

                        producto.cantidad_solicitada -= obj.cantidad_solicitada;
                        unidadMedida = producto.cantidad_solicitada % (producto.unidad_medida === null ? 1 : producto.unidad_medida) === 0 ? 1 : 0;

                        if (unidadMedida === 1) {

                            obj.total_solicitado += producto.cantidad_solicitada;
                            obj.total_disponible += producto.cantidad_disponible;
                            productosPreparadosCotizacion.push(producto);
                        } else {
                            obj.cantidad_solicitada = 0;
                            productosSolicitados.mensajeError = "no hay disponibilidad suficiente";
                            productosSolicitados.cantidadValida = false;
                            productosPreparadosCotizacionInvalidos.push(productosSolicitados);
                        }
                    }

                } else {

                    obj.total_solicitado = 0;
                    obj.cantidad_solicitada = producto.cantidad_solicitada;
                    obj.codigo_producto = producto.codigo_producto;
                    unidadMedida = producto.cantidad_solicitada % (producto.unidad_medida === null ? 1 : producto.unidad_medida) === 0 ? 1 : 0;

                    if (unidadMedida === 1) {
                        obj.total_solicitado += producto.cantidad_solicitada;
                        obj.total_disponible += producto.cantidad_disponible;
                        productosPreparadosCotizacion.push(producto);
                    } else {
                        obj.cantidad_solicitada = 0;
                        productosSolicitados.mensajeError = "no hay disponibilidad suficiente";
                        productosSolicitados.cantidadValida = false;
                        productosPreparadosCotizacionInvalidos.push(productosSolicitados);
                    }
                }
            }
        } else {
            productosSolicitados.mensajeError = "no hay disponibilidad suficiente";
            productosSolicitados.cantidadValida = false;
            productosPreparadosCotizacionInvalidos.push(productosSolicitados);
        }
    }

    if (obj.codigo_producto === producto.codigo_producto) {

        producto.sumaCantidadTotalSolicitadaBodega = obj.total_solicitado;
        producto.sumaCantidadTotalDisponibleBodega = obj.total_disponible;

    }

    __seleccionarProductoMultipleDisponibilidadMayor(that, index, productos, productosSolicitados, obj, callback);

}
;

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de adicionar al arreglo general de los productos
 *             la cantidad solicitada a cada producto
 * @fecha 22/02/2017
 */
function __agregarCantidadSolicitadaProducto(that, index, productos, _productosValidosExistentes, productos_validos, productos_invalidos, callback) {

    var producto = _productosValidosExistentes[index];

    if (!producto) {
        callback(false, productos_validos, productos_invalidos);
        return;
    }


    productos.forEach(function (row) {

        if (row.codigo_producto === producto.codigo_producto) {

            row.cantidad_solicitada = producto.cantidad_solicitada;

            productos_validos.push(row);
        }

    });

    index++;
    __agregarCantidadSolicitadaProducto(that, index, productos, _productosValidosExistentes, productos_validos, productos_invalidos, callback);

}
;

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de validar el producto si este cumple con
 *              - Unidad de medida
 *              - Precio regulado
 *              - Precio de venta
 * @fecha 22/02/2017
 */
function __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback) {

    var producto = productos[index];
    var def = G.Q.defer();
    //producto.contrato_cliente_id = obj.pedidos_clientes.cotizacion.cliente.contrato_id;
    if (!producto) {
        callback(false, productosValidos, productosInvalidos);
        return;
    }

    var parametros = {empresaId: producto.empresa_id,
        codigoProducto: producto.codigo_producto,
        contratoId: obj.pedidos_clientes.cotizacion.cliente.contrato_id};



    producto.precio_venta = producto.precio_producto;
    producto.tipo_producto = producto.tipo_producto_id;
    producto.empresaIdProducto = producto.empresa_id;
    producto.centroUtilidadProducto = producto.centro_utilidad;
    producto.bodegaProducto = producto.bodega;
    producto.contrato_cliente_id = obj.pedidos_clientes.cotizacion.cliente.contrato_id;
    index++;

    G.Q.ninvoke(that.m_productos, 'consultarPrecioReguladoProducto', parametros).then(function (resultado) {

        if (!resultado || resultado === undefined) {

            setTimeout(function () {
                __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback);
            }, 0);
            return;
        }


        /**
         * +Descripcion: Se invoca la funcion con un object {valido=boolean, msj = string}
         **/
        var precioVenta = __validarPrecioVenta(producto, resultado, 0);

        if (precioVenta.valido) {
            productoUnidadMedida = producto;
            return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: producto.cantidad_solicitada, codigo_producto: producto.codigo_producto});

        } else {
            productoUnidadMedida = producto;
            productosInvalidos.push(productoUnidadMedida);
            def.resolve();
        }

        __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback);
        return;

    }).then(function (resultado) {

        if (!resultado) {

            setTimeout(function () {
                __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback);
            }, 0);

        } else if (resultado.length > 0 && resultado[0].valido === '1') {

            productosValidos.push(productoUnidadMedida);

            setTimeout(function () {
                __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback);
            }, 0);

        } else {

            producto.mensajeError = "La cantidad ingresada no es valida para el producto";
            producto.cantidadValida = false;
            productosInvalidos.push(productoUnidadMedida);

            setTimeout(function () {
                __cantidadSolicitadaProducto(that, index, obj, productos, productosValidos, productosInvalidos, callback);
            }, 0);
        }
    }).fail(function (err) {
        console.log("err [__cantidadSolicitadaProducto]: ", err);
        callback(err);
    }).done();
}

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de insertar un arreglo de productos en la tabla
 *              ventas_ordenes_pedidos_d_tmp
 * 
 */
function __insertarDetalleCotizacion(that, index, usuario, cotizacion, _productos_validos, _productos_invalidos, callback) {

    var producto = _productos_validos[index];
    if (!producto) {
        callback(false, _productos_invalidos);
        return;
    }


    that.m_pedidos_clientes.insertar_detalle_cotizacion(cotizacion, producto, function (err, rows) {
        if (err) {

            _productos_invalidos.push(producto);
        }

        index++;
        var porcentaje = (index * 100) / _productos_validos.length;
        that.e_pedidos_clientes.onNotificarProgresoArchivoPlanoClientes(usuario, porcentaje, function () {

            setTimeout(function () {

                __insertarDetalleCotizacion(that, index, usuario, cotizacion, _productos_validos, _productos_invalidos, callback);
            }, 0);
        });

    });
}

/*
 * Autor : Camilo Orozco
 * Descripcion : Generar las observaciones ingresadas por el area de cartera
 */
PedidosCliente.prototype.observacionCarteraCotizacion = function (req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.cotizacion === undefined || args.pedidos_clientes.cotizacion === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }

    var cotizacion = args.pedidos_clientes.cotizacion;
    cotizacion.usuario_id = req.session.user.usuario_id;
    var productos = cotizacion.productos;


    if (cotizacion.numero_cotizacion === null  || cotizacion.numero_cotizacion === undefined || cotizacion.numero_cotizacion === '') {
        res.send(G.utils.r(req.url, 'numero_cotizacion no esta definido o esta vacio', 404, {}));
        return;
    }

    if (cotizacion.aprobado_cartera === undefined || cotizacion.aprobado_cartera === '') {
        res.send(G.utils.r(req.url, 'aprobado_cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    if (cotizacion.observacion_cartera === undefined || cotizacion.observacion_cartera === '') {
        res.send(G.utils.r(req.url, 'Debe diligenciar el campo de observacion cartera', 404, {}));
        return;
    }

    var paramLogExistencia = {
        numero: cotizacion.numero_cotizacion,
        tipo: '0',
        pendiente: 1

    };
    var paramLogCliente;
    /*Se invoca la funcion encargada de traer los parametros para actualizar el estado
     del pedido a aprobado o denegado por cartera*/

    if (cotizacion.aprobado_cartera === 1) {
        paramLogCliente = __parametrosLogs(cotizacion.numero_cotizacion, productos, cotizacion.usuario_id, cotizacion.observacion_cartera, cotizacion.total, 0, 1);
    } else {
        paramLogCliente = __parametrosLogs(cotizacion.numero_cotizacion, productos, cotizacion.usuario_id, cotizacion.observacion_cartera, cotizacion.total, 0, 2);
    }


    /**
     * +Descripcion: Se invoca un modelo encargado de insertar los registros
     * a una tabla log de seguimiento para cuando se realice la aprobacion
     * de la cotizacion por parte de cartera
     * @fecha: 29/09/2015
     * @author Cristian Ardila
     * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
     */

    var obj = {
        "tipo_id_tercero": cotizacion.cliente.tipo_id_tercero,
        "tercero_id": cotizacion.cliente.id
    };

    G.Q.ninvoke(that.terceros_clientes_model, "obtenterClientePorId", obj).
            then(function (tercero) {

                if (tercero[0].tipo_bloqueo_id !== '1') {
                    throw {msj: "El cliente seleccionado se encuentra bloqueado o inactivo", status: 403};
                } else {
                    return G.Q.ninvoke(that.m_pedidos_clientes, 'observacion_cartera_cotizacion', cotizacion);
                }


            }).then(function (resultado) {
        if (resultado.rowCount === 0) {
            throw 'Error actualizando la observacion de cartera';
        } else {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);
        }

    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Observacion registrada correctamente', 200, {pedidos_clientes: {}}));
        that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numeroCotizacion);

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logAprobacionCotizacion', paramLogCliente);
        }
        return;

    }).fail(function (err) {

        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        res.send(G.utils.r(req.url, msj, status, {}));
    }).done();

};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar Reporte PDF de contizaciones y enviar por email
 */
PedidosCliente.prototype.reporteCotizacion = function (req, res) {


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

    that.m_pedidos_clientes.consultar_cotizacion(cotizacion, function (err, datos_cotizacion) {

        if (err || datos_cotizacion.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno consultado la cotizacion', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.m_pedidos_clientes.consultar_detalle_cotizacion(cotizacion, '', function (err, lista_productos) {

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


                _generar_reporte_cotizacion(datos_reporte, function (nombre_reporte) {

                    if (enviar_email) {

                        var path = G.dirname + "/public/reports/" + nombre_reporte;
                        var filename = "CotizacionNo-" + cotizacion.numero_cotizacion + '.pdf';

                        __enviar_correo_electronico(that, emails, path, filename, subject, message, function (enviado) {

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
PedidosCliente.prototype.consultarPedido = function (req, res) {

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

    that.m_pedidos_clientes.consultar_pedido(pedido.numero_pedido, function (err, datos_pedido) {

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
PedidosCliente.prototype.consultarDetallePedido = function (req, res) {

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

    that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function (err, lista_productos) {

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
PedidosCliente.prototype.generarPedido = function (req, res) {

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
    that.pedidoGenerado;

    /**
     * +Descripcion: Funcion encargada de verificar si el numero de cotizacion
     *               ya tiene un pedido asignado
     */
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarExistenciaPedidoCotizacion', cotizacion.numero_cotizacion).then(function (resultado) {

        if (resultado.length > 0) {
            throw 'La cotizacion ya se encuentra con un pedido asignado';
            return;
        } else {
            /**
             * +Descripcion: FUncion encargada de verificar el estado de una cotizacion
             **/
            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoCotizacion', cotizacion.numero_cotizacion);

        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            cotizacion.usuario_id = resultado[0].usuario_id;

            /**
             * +Descripcion: Se valida si el estado de la cotizacion es 3 (aprobado por cartera)
             **/
            if (resultado[0].estado === '3') {

                return G.Q.ninvoke(that.m_pedidos_clientes, 'generar_pedido_cliente', cotizacion);

            } else {
                throw 'La cotizacion no se encuentra aprobada por cartera';
                return;
            }

        } else {
            throw 'Ha ocurrido un error';
        }

    }).then(function (resultado) {

        that.pedidoGenerado = resultado;
        return G.Q.ninvoke(that.m_pedidos_clientes, 'asignar_responsables_pedidos', resultado.numero_pedido, resultado.estado, null, cotizacion.usuario_id);


    }).then(function (resultado) {

        if (resultado.length > 0) {

            return G.Q.ninvoke(that.m_pedidos_clientes, 'terminar_estado_pedido', that.pedidoGenerado.numero_pedido, [that.pedidoGenerado.estado], '1');

        } else {

            throw 'Se ha Generado un Error en la Asignacion de Responsables';
        }


    }).then(function (resultado) {

        if (resultado.rowCount > 0) {
            var cliente = 0;
            var autorizacion = {};
            autorizacion.farmacia = cliente;
            autorizacion.empresa_id = cotizacion.empresa_id;
            autorizacion.numero_pedido = that.pedidoGenerado.numero_pedido;



            var notificacion = {
                aliasModulo: 'productos_en_pedidos',
                opcionModulo: "sw_ver_notificaciones",
                titulo: "Autorizaciones Pedidos Clientes",
                mensaje: "El pedido No. " + autorizacion.numero_pedido + " requiere autorizacion"
            };

            G.Q.nfcall(__guardarAutorizacion, that, autorizacion).then(function (resultado) {
                if (resultado) {
                    that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: that.pedidoGenerado.numero_pedido});
                    G.eventEmitter.emit("onRealizarNotificacionWeb", notificacion);
                }
                res.send(G.utils.r(req.url, 'Se Almaceno Correctamente!', 200, {numero_pedido: autorizacion.numero_pedido}));
            }).fail(function (err) {
                res.send(G.utils.r(req.url, 'Error Finalizando el Registro de la Autorizacion', 500, {documento_temporal: {}}));
            });


            that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
            res.send(G.utils.r(req.url, 'Pedido Generado Correctamente No. ' + that.pedidoGenerado.numero_pedido, 200, {pedidos_clientes: that.pedidoGenerado}));
            return;

        } else {

            throw 'Error finalizando el estado del pedido';
        }


    }).fail(function (err) {
        console.log("err [generarPedido]: ", err)
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};

/**
 * +Descripcion: funcion que guarda el pedido de productos bloqueados
 * @author Andres M Gonzalez
 * @fecha: 16/05/2016
 * @params el arreglo autorizacion y this de generarPedidoFarmacia
 */
function __guardarAutorizacion(thats, autorizacion, callback) {
    var producto;
    var def = G.Q.defer();
    var bloqueo = false;

    G.Q.ninvoke(thats.m_pedidos_clientes, "consultar_detalle_pedido", autorizacion.numero_pedido).then(function (resultado) {
        producto = resultado;
        for (var i = 0; i < producto.length; i++) {
            if (producto[i].bloqueado === '0') {
                bloqueo = true;
            }
        }
    }).then(function () {

        if (bloqueo) {
            var estado_pedido = '10';
            thats.m_pedidos_clientes.actualizar_estado_actual_pedido(autorizacion.numero_pedido, estado_pedido, function (_err) {
                if (_err) {
                    throw 'Se ha generado un error interno code 2';
                    return;
                }
            });
            autorizacion.productos = producto;
            return G.Q.ninvoke(thats.m_pedidos, "guardarAutorizacion", autorizacion);
        } else {
            def.resolve();
        }

    }).then(function () {
        callback(false, bloqueo);
    }).fail(function (err) {
        callback(err);
    }).done();
}


/*
 * @author  Cristian Ardila
 * @fecha 18/03/2016 4:39 pm
 * +Descripcion : Metodo encargado de insertar los productos en un pedido
 *                validando si el producto tiene o no precio regulado
 *                y enviando notificaciones a cartera cada vez que el costo total
 *                del pedido este por encima del valor total de cuando se creo
 *                la cotizacion, prosiguiendo a almacenar la trazabilidad de este
 *                proceso en los logs de trazabilidad ventas
 */
PedidosCliente.prototype.insertarDetallePedido = function (req, res) {

    var that = this;
    var args = req.body.data;
    var def = G.Q.defer();
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
        res.send(G.utils.r(req.url, 'La cantidad solicitada no puede ser menor o igual a cero', 404, {}));
        return;
    }
    if (producto.precioVentaIva === undefined || producto.precioVentaIva === '') {
        res.send(G.utils.r(req.url, 'precioVentaIva no esta definido o esta vacio', 404, {}));
        return;
    }

    if (producto.precioVentaIva <= 0) {
        res.send(G.utils.r(req.url, 'El valor del precio de venta no puede ser cero (0)', 404, {}));
        return;
    }

    pedido.usuario_id = req.session.user.usuario_id;
    /* +Descripcion Objeto de parametros para la validar la existencia de un pedido
     * @param numero: numero del pedido
     *        tipo:   0=cotizacion, 1=pedido
     *        pendiente: 0=solictado autorizacion
     */
    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };
    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los
     *               productos o aÃ±adirle mas productos a un pedido el total es
     *               mayor > igual = Ã³ menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);
    var estado_pedido = 0;
    /**
     * +Descripcion: Promesa encargada de consultar el precio regulado de un
     *               producto, y validar si este precio esta por debajo del valor
     *               de venta
     * @fecha: 03/12/2015
     * @param {string} pedido.empresa_id
     * @param {string} codigo_producto
     * @returns {function}
     */
    var parametros = {empresaId: pedido.empresa_id, codigoProducto: producto.codigo_producto, contratoId: pedido.cliente.contrato_id}

    /*+Descripcion Objeto de parametros para la validar la existencia de un pedido
     * @param numero: numero del pedido
     *        tipo:   0=cotizacion, 1=pedido
     *        pendiente: 0=solictado autorizacion
     */
    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };
     
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalProductosPedido', pedido.numero_pedido).then(function(resultado){
          
        if(resultado[0].total >= 60){
            throw "La cantidad de items no puede exceder las 60 unidades";
        }else{
            return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: producto.cantidad_solicitada, codigo_producto: producto.codigo_producto})
            
        }
            
    }).then(function (resultado) {

                if (resultado.length > 0 && resultado[0].valido === '1') {
                    return G.Q.ninvoke(that.m_productos, 'consultarPrecioReguladoProducto', parametros);
                } else {
                    throw "La cantidad no corresponde a la unidad de medida";
                }

            }).then(function (resultado) {

        /**
         * +Descripcion: Se invoca la funcion con un object {valido=boolean, msj = string}
         */
        var precioVenta = __validarPrecioVenta(producto, resultado, 0);

        if (precioVenta.valido) {
            return  G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoPedidoEstado', numeroPedido);
        } else {
            throw precioVenta.msj;
        }
    }).then(function (resultado) {
        /**
         * +Descripcion: Se permitira ejecutar la accion de consultarTotalValorPedidoCliente
         *               siempre y cuando el pedido tenga el
         *               estado (Estado del Pedido ) 1
         *               estado_pedido (Estado de solicitud ) 0
         */
        if (resultado[0].estado === '1' && (resultado[0].estado_pedido === '0')) {

            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalValorPedidoCliente', numeroPedido);

        } else {
            throw 'El pedido debe encontrarse activo ó para autorizar nuevamente por cartera';
        }
    }).then(function (rows) {

        /*var totalValorPedidoActual = rows[0].valor_total_cotizacion;
         
         if (totalValorPedidoNuevo > totalValorPedidoActual) {
         estado_pedido = 1;
         } else {
         estado_pedido = 1;
         }*/
        estado_pedido = 1;
        /**
         * +Descripcion: Se valida si el pedido ya cuenta con ese producto en el detalle
         */
        return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarProductoPedido', pedido, producto);

    }).then(function (resultado) {

        /**
         * +Descripcion: Se valida si el producto es diferente al del detalle
         *               y si es asi se procede a modficar el detalle
         */
        /* if (resultado.length === 0) {
         return G.Q.ninvoke(that.m_pedidos_clientes, 'insertarDetallePedido', pedido, producto);
         } else {*/
        if (resultado.rows.length > 0) {
            throw 'El producto ya aparece registrado en el pedido';
        } else {

            return G.Q.ninvoke(that.m_pedidos_clientes, 'insertarDetallePedido', pedido, producto);
        }

    }).then(function (resultado) {

        if (resultado.rowCount === 0) {
            throw 'Error Interno';
        } else
            pedido.aprobado_cartera = '0';
        pedido.observacion_cartera = '';

        return  G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstadoPedido', pedido, estado_pedido);

    }).then(function (resultado) {

        if (resultado > 0) {
            /*
             * +Descripcion Se valida el estado del pedido, si es estado 4
             *              entonces se enviara la notificacion de que el pedido
             *              solicita a cartera la aprobacion y se almacenara esta
             *              trazabilidad en la tabla (ventas_trazabilidad)
             */
            if (estado_pedido === 1) { //estado_pedido

                that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
                res.send(G.utils.r(req.url, 'Producto aniadido correctamente ', 200, {pedidos_clientes: {}}));
                return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);
            } else {

                def.resolve();
            }

        } else {
            throw 'Error actualizando la observacion de cartera';
        }

    }).then(function (resultado) {

        var paramLogAutorizarPedido = __parametrosLogs(pedido.numero_pedido, pedido.productos, pedido.usuario_id, "Se solicita aprobacion Pedido", totalValorPedidoNuevo, 1, 0);
        /**
         * +Descripcion Si el pedido no se encuentra registrado en la tabla de trazabilidad
         *              se procede a registrarlo, de lo contrario solo lo actualizara
         */

        if (!resultado || resultado.length === 0) {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogAutorizarPedido);
        } else {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logActualizarSolicitudProducto', paramLogAutorizarPedido);
        }

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Producto aÃ±adido correctamente ', 200, {pedidos_clientes: {}}));
    })
            .fail(function (err) {
                res.send(G.utils.r(req.url, err, 500, {}));
            }).done();
};




/*
 * @author : Cristian M. Ardila T.
 * +Descripcion : Funcion encargada de consultar el estado de un pedido
 *                y el valor total de ese pedido, cuanto suma el valor de todos
 *                sus productos
 * @fecha:  28/11/2015
 */
PedidosCliente.prototype.validarEstadoTotalValorPedido = function (req, res) {
 

    var that = this;

    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }


    var pedido = args.pedidos_clientes.pedido;

    pedido.usuario_id = req.session.user.usuario_id;

    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);
    var totalValorPedidoActual = 0;
    
    
     var obj = {
            "tipo_id_tercero": pedido.cliente.tipo_id_tercero,
            "tercero_id": pedido.cliente.id
        };
    /**
     * +Descripcion: Metodo encargado de consultar el estado actual de un pedido
     */
    
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoPedidoEstado', numeroPedido).then(function(resultado){
        
        
         if (resultado[0].estado === '1' && (resultado[0].estado_pedido === '0')) {

            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalValorPedidoCliente', numeroPedido);

        } else {
            throw 'El pedido debe encontrarse activo ó para autorizar nuevamente por cartera';
        }
    }).then(function (rows) {
 
        if (rows.length > 0) {
                totalValorPedidoActual = rows[0].valor_total_cotizacion;

                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoAutorizacionCliente', obj);



            } else {
                throw "Error al consultar el total del valor del pedido";
            }
        
       

    }).then(function (resultado) {
        
        
        /**
         * +Descripcio Si esta creado en la tabla de vntas_contratos_clientes
         */
        if (resultado.length > 0) {
            
            /*
             * +Descripcion Si El cliente esta autorizado, el estado del pedido seguira en 1
             *              por lo cual no necesitara aprobar cartera
             */
            if (resultado[0].sw_facturacion_agrupada === '1' && resultado[0].sw_autorizacion === '0') {
                estado_pedido = 1;
            }else{
                /**
                 * +Descripcion Si no esta autorizado se valida si el valor actual del pedido
                 *              es menor al inicial
                 */
                if (totalValorPedidoNuevo > totalValorPedidoActual) {
                    estado_pedido = 4;
                } else {
                    estado_pedido = 1;
                }
            }
        } else {
            if (totalValorPedidoNuevo > totalValorPedidoActual) {
                estado_pedido = 4;
            } else {
                estado_pedido = 1;
            }
        }
        
         
        return res.send(G.utils.r(req.url, 'Estado del pedido es ' + estado_pedido, 200, {pedidos_clientes: [estado_pedido]}));
        
}).fail(function(err){
    
     res.send(G.utils.r(req.url, err, 500, {}));
     
}).done();

};


/*
 * @author : Cristian Ardila
 * @fecha 28/11/2015
 * +Descripcion : Metodo encargado de modificar en multiples productos de un pedido
 *               las cantidades
 */
PedidosCliente.prototype.insertarCantidadProductoDetallePedido = function (req, res) {

    var that = this;
    var args = req.body.data;

    // Pedido
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'La variable pedidos_clientes no esta definida o esta vacÃ­a', 404, {}));
        return;
    }


    // Pedido
    if (args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'La variable pedido no esta definida o esta vacÃ­a', 404, {}));
        return;
    }
    // Producto
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'La variable producto no esta definida o esta vacÃ­a', 404, {}));
        return;
    }

    // Estado
    if (args.pedidos_clientes.estado === undefined || args.pedidos_clientes.estado === '') {
        res.send(G.utils.r(req.url, 'La variable estado no esta definida o esta vacÃ­a', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    //Se adiciona al objeto producto un a variable mas, El usuario de la session
    pedido.usuario_id = req.session.user.usuario_id;
    var producto = args.pedidos_clientes.producto;
    var estado_pedido = args.pedidos_clientes.estado;

    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);


    var paramLogAutorizarPedido = __parametrosLogs(pedido.numero_pedido, producto, pedido.usuario_id, "Se solicita aprobacion Pedido", totalValorPedidoNuevo, 1, 0);
    var paramLogActualizarAutorizarPedido = __parametrosLogs(pedido.numero_pedido, producto, pedido.usuario_id, "Se solicita aprobacion Pedido", totalValorPedidoNuevo, 1, 0);

    /* +Descripcion Objeto de parametros para la validar la existencia de un pedido
     * @param numero: numero del pedido
     *        tipo:   0=cotizacion, 1=pedido
     *        pendiente: 0=solictado autorizacion
     */
    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };

    var obj = {productos: producto,
        index: 0,
        pedido: pedido,
        contexto: that
    };
    /**
     * +Descripcion: Esta funcion es una funcion recursiva la cual recibe como
     *               parametro un objeto con los productos a los cuales les modificara
     *               el detalle
     */
    G.Q.nfcall(__productosPedidos, obj).then(function (resultado) {


        pedido.aprobado_cartera = '0';
        pedido.observacion_cartera = '';
        /**
         * +Descripcion: Esta funcion sera la encargada de actualizar el
         *               estado del pedido
         */
        return G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstadoPedido', pedido, estado_pedido);
        
        
    }).then(function (resultado) {
        /**
         * +Descripcion: Si se actualiza el estado del pedido satisfactoriamente
         *               se procede a consultar si este pedido con el estdo actual
         *               se encuentra ya registrado en la table de trazabilidad
         *
         */
        if (resultado > 0) {

            res.send(G.utils.r(req.url, 'Se modifica el pedido satisfactoriamente', 200, {pedidos_clientes: {}}));
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);
        } else {
            throw 'Error actualizando la observacion de cartera';
        }

    }).then(function (resultado) {
        /**
         * +Descripcion Si el pedido no se encuentra registrado en la tabla de trazabilidad
         *              se procede a registrarlo, de lo contrario solo lo actualizara
         */
        if (resultado.length === 0) {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogAutorizarPedido);
        } else {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logActualizarSolicitudProducto', paramLogActualizarAutorizarPedido);
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/**
 * +Descripcion
 * @param {type} req
 * @param {type} res
 * @returns {unresolved} */
PedidosCliente.prototype.enviarNotificacionPedidosClientes = function (req, res) {

    var that = this;
    var args = req.body.data;

    // Pedidos
    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'La variable pedidos_clientes no esta definida o esta vacÃ­a', 404, {}));
        return;
    }


    // Pedido
    if (args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'La variable pedido no esta definida o esta vacÃ­a', 404, {}));
        return;
    }
    // Producto
    if (args.pedidos_clientes.producto === undefined || args.pedidos_clientes.producto === '') {
        res.send(G.utils.r(req.url, 'La variable producto no esta definida o esta vacÃ­a', 404, {}));
        return;
    }

    // Estado
    if (args.pedidos_clientes.estado === undefined || args.pedidos_clientes.estado === '') {
        res.send(G.utils.r(req.url, 'La variable estado no esta definida o esta vacÃ­a', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    //Se adiciona al objeto producto un a variable mas, El usuario de la session
    pedido.usuario_id = req.session.user.usuario_id;
    var estado_pedido = args.pedidos_clientes.estado;


    that.m_pedidos_clientes.actualizarEstadoPedido(pedido, estado_pedido, function (err, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error actualizando la observacion de cartera', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
            res.send(G.utils.r(req.url, 'Modificacion exitosa', 200, {pedidos_clientes: {}}));
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
PedidosCliente.prototype.consultarEstadoPedido = function (req, res) {

    var that = this;

    var args = req.body.data;

    var numeroPedido = args.pedidos_clientes.pedido;
    that.m_pedidos_clientes.consultarEstadoPedido(numeroPedido, function (estado, rows) {

        if (!estado) {
            res.send(G.utils.r(req.url, 'Consultando estado del pedido', 200, {pedidos_clientes: rows[0]}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Error interno', 500, {pedidos_clientes: []}));
            return;
        }

    });
};

/**
 * @author Cristian Ardila
 * @fecha  11/03/2016
 * +Descripcion Metodo el cual se encarga de ordenar los parametros para los
 *              logs de trazabilidad de ventas
 */
function __parametrosLogs(numero, productos, usuario, observacion, total, tipo, accion) {


    var detalle = [];
    var paramLogCliente = {};
    detalle.push("Detalle (  Cantidad de items: " + productos.length + " productos, Total: " + total + ")");
    if (accion === 1 || accion === 2) {

        paramLogCliente = {
            detalle: {
                tipo: tipo,
                pendiente: accion,
                numero: numero,
                solicitud: detalle.toString(),
                aprobacion: observacion,
                fecha_aprobacion: 'now()',
                usuario_aprobacion: usuario
            }
        };
    }

    if (accion === 0) {

        paramLogCliente = {
            detalle: {
                tipo: tipo,
                pendiente: accion,
                numero: numero,
                solicitud: detalle.toString(),
                fecha_solicitud: 'now()',
                aprobacion: observacion,
                fecha_aprobacion: null,
                usuario_id: usuario
            }
        };

    }
    if (accion === 3) {

        paramLogCliente = {
            detalle: {
                tipo: tipo,
                pendiente: accion,
                numero: numero,
                solicitud: null,
                fecha_solicitud: 'now()',
                aprobacion: observacion,
                fecha_aprobacion: null,
                usuario_id: usuario
            }
        };

    }

    return paramLogCliente;
}
/**
 * @author Cristian Ardila
 * @fecha 09/11/2015
 * +Descripcion: Controlador encargado de actualizar el estado de la cotizacion
 *               para solicitar aprobacion por cartera
 */
PedidosCliente.prototype.solicitarAutorizacion = function (req, res) {

    var that = this;
    var args = req.body.data;
    var cotizacion = args.pedidos_clientes.cotizacion;
    var productos = args.pedidos_clientes.cotizacion.cotizacion.productos;
    cotizacion.usuario_id = req.session.user.usuario_id;


    /*Se recorre el arreglo de los productos y se suma el valor total con iva
     * de cada producto para almacenarlo en el log de trazabilidad de ventas
     */
    var totalValorProductos = 0;
    productos[0].forEach(function (row) {

        var valorTotalIva = parseFloat(row.valor_total_con_iva);
        totalValorProductos += valorTotalIva;

    });

    /*Se invoca la funcion encargada de traer los parametros almacenarlos
     * en la tabla de trazabilidad de venta*/
    var paramLogCliente = __parametrosLogs(cotizacion.numeroCotizacion, productos[0], cotizacion.usuario_id, "Se solicita aprobacion", totalValorProductos, 0, 0);
    /**
     * +Descripcion: Se invoca un modelo encargado de insertar los registros
     * a una tabla log de seguimiento para cuando realiza la solicitud de autorizar
     * una cotizacion pero previamente se invoca el modelo para cambiar el estado
     * de la cotizacion para solicitar autorizacion por cartera
     * @fecha: 29/09/2015
     * @author Cristian Ardila
     * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
     */
    G.Q.ninvoke(that.m_pedidos_clientes, 'solicitarAutorizacion', cotizacion).then(function (resultado) {
        if (resultado.rowCount === 0) {
            throw 'Error actualizando la observacion de cartera';
        } else {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogCliente);
        }

    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Se cambia el estado de la cotizacion para solicitar autorizacion a cartera', 200, {pedidos_clientes: []}));
        that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numeroCotizacion);
        return;

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};


/**
 * @author: Cristian Ardila
 * +Descripcion: Funcion encargada de invocar el modelo que consultara el estado
 *               de un pedido, enviando como parametro el numero de pedido
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PedidosCliente.prototype.consultarEstadoCotizacion = function (req, res) {
 
    var that = this;

    var args = req.body.data;

    var numeroCotizacion = args.pedidos_clientes.cotizacion;

    G.Q.ninvoke(that.m_pedidos_clientes, "consultarEstadoCotizacion", numeroCotizacion).then(function (rows) {

        if (rows.length > 0) {
            res.send(G.utils.r(req.url, 'Consultando estado de la cotizacion', 200, {pedidos_clientes: rows[0]}));
        } else {

            throw 'No hay registros';
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {pedidos_clientes: []}));
    }).done();

};
/*
 * Autor : Camilo Orozco
 * Descripcion : Modificar detalle pedido
 */
PedidosCliente.prototype.modificarDetallePedido = function (req, res) {
    
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

    if (producto.cantidad_solicitada === undefined || producto.cantidad_solicitada === '' /*|| producto.cantidad_solicitada <= '0'*/) {
        res.send(G.utils.r(req.url, 'La cantidad solicitada no puede ser menor o igual a cero', 404, {}));
        return;
    }

    if (producto.precio_venta === undefined || producto.precio_venta === '') {
        res.send(G.utils.r(req.url, 'precio_venta no esta definido o esta vacio', 404, {}));
        return;
    }

    if (!producto.cantidadPendienteDespachar || producto.cantidadPendienteDespachar.length === 0) {
        res.send(G.utils.r(req.url, 'la cantidad pendiente no esta definida o esta vacÃ­a', 404, {}));
        return;
    }

    pedido.usuario_id = req.session.user.usuario_id;


    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los
     *               productos o aÃ±adirle mas productos a un pedido el total es
     *               mayor > igual = Ã³ menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);
    var totalValorPedidoActual = 0;
    var estado_pedido = 0;

    /*Se recorre el arreglo de los productos y se suma el valor total de con iva
     * de cada producto
     */
    var totalValorProductos = 0;
    pedido.productos.forEach(function (row) {

        var valorTotalIva = parseFloat(row.valor_total_con_iva);
        totalValorProductos += valorTotalIva;

    });

    var paramLogAutorizarPedido = __parametrosLogs(pedido.numero_pedido, pedido.productos, pedido.usuario_id, "Se solicita aprobacion Pedido", totalValorProductos, 1, 0);
    /* +Descripcion Objeto de parametros para la validar la existencia de un pedido
     * @param numero: numero del pedido
     *        tipo:   0=cotizacion, 1=pedido
     *        pendiente: 0=solictado para autoriza
     */
    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };

    /**
     * +Descripcion Metodo encargado de consultar el estado de un pedido, recibiendo
     *              como parametro el numero del pedido
     */
    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoPedidoEstado', numeroPedido).then(function (resultado) {
        /**
         * +Descripcion: Se permitira ejecutar la accion de consultarTotalValorPedidoCliente
         *               siempre y cuando el pedido tenga el
         *               estado (Estado del Pedido ) 1
         *               estado_pedido (Estado de solicitud ) 0
         */
        if (resultado[0].estado === '1' && (resultado[0].estado_pedido === '0' || resultado[0].estado_pedido === '8')) {
            return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: producto.cantidad_solicitada, codigo_producto: producto.codigo_producto})

        } else {
            throw ("El pedido debe estar activo o para autorizar nuevamente por cartera");
        }
    }).then(function (resultado) {

        if (resultado.length > 0 && resultado[0].valido === '1') {
            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalValorPedidoCliente', numeroPedido);

        } else {
            throw "La cantidad no corresponde a la unidad de medida";
        }

    }).then(function (resultado) {


        var obj = {
            "tipo_id_tercero": pedido.cliente.tipo_id_tercero,
            "tercero_id": pedido.cliente.id
        };
        
        if (resultado.length > 0) {
            totalValorPedidoActual = resultado[0].valor_total_cotizacion;

            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoAutorizacionCliente', obj);
 
           

        } else {
            throw ("Error al consultar el total del valor del pedido");
        }

    }).then(function (resultado) {
        
        /**
         * +Descripcio Si esta creado en la tabla de vntas_contratos_clientes
         */
        if (resultado.length > 0) {
            
            /*
             * +Descripcion Si El cliente esta autorizado, el estado del pedido seguira en 1
             *              por lo cual no necesitara aprobar cartera
             */
            if (resultado[0].sw_facturacion_agrupada === '1' && resultado[0].sw_autorizacion === '0') {
                estado_pedido = 1;
            }else{
                /**
                 * +Descripcion Si no esta autorizado se valida si el valor actual del pedido
                 *              es menor al inicial
                 */
                if (totalValorPedidoNuevo > totalValorPedidoActual) {
                    estado_pedido = 4;
                } else {
                    estado_pedido = 1;
                }
            }
        } else {
            if (totalValorPedidoNuevo > totalValorPedidoActual) {
                estado_pedido = 4;
            } else {
                estado_pedido = 1;
            }
        }
        
        
        /**
        * +Descripcion: la funcion se encargara de modificar el detalle del pedido
        *               en este caso, lo mas relevante sera la cantidad de un
        *               producto
        */
        return G.Q.ninvoke(that.m_pedidos_clientes, 'modificar_detalle_pedido', pedido, producto);
 
    }) .then(function (resultado) {

                if (resultado.rowCount > 0) {
                    pedido.aprobado_cartera = '0';
                    pedido.observacion_cartera = '';
                    /**
                     * +Descripcion: Esta funcion sera la encargada de actualizar el
                     *               estado del pedido
                     */
                    return G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstadoPedido', pedido, estado_pedido);
                } else {
                    throw 'Error actualizando la observacion de cartera';
                }

            }).then(function (resultado) {
        /**
         * +Descripcion: Si se actualiza el estado del pedido satisfactoriamente
         *               se procede a consultar si este pedido con el estdo actual
         *               se encuentra ya registrado en la table de trazabilidad
         *
         */
        if (resultado > 0) {
            that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
            res.send(G.utils.r(req.url, 'Se modifica el pedido satisfactoriamenteo', 200, {pedidos_clientes: {}}));
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);
        } else {
            throw 'Error actualizando la observacion de cartera';
        }
    }).then(function (resultado) {
        /**
         * +Descripcion Si el pedido no se encuentra registrado en la tabla de trazabilidad
         *              se procede a registrarlo, de lo contrario solo lo actualizara
         */
        if (resultado.length === 0) {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogAutorizarPedido);
        } else {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logActualizarSolicitudProducto', paramLogAutorizarPedido);
        }
    }).fail(function (err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
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
PedidosCliente.prototype.eliminarProductoPedido = function (req, res) {

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
    /* +Descripcion Objeto de parametros para la validar la existencia de un pedido
     * @param numero: numero del pedido
     *        tipo:   0=cotizacion, 1=pedido
     *        pendiente: 0=solictado autorizacion
     */
    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };
    /**
     * +Descripcion: Proceso para validar que al modificar las cantidades de los
     *               productos o aÃ±adirle mas productos a un pedido el total es
     *               mayor > igual = Ã³ menor < al actual y en base a esto modificar
     *               el estado del pedido, si el nuevo valor total del pedido es
     *               mayor al actual se actualizara el estado de 1 a estado_pedido =4
     *               y el pedido debera ser autorizado nuevamente por cartera
     *               si el nuevo valor total del pedido es menor, su estado quedara
     *               igual (No asignado)
     * @fecha: 04/11/2015
     */
    var numeroPedido = pedido.numero_pedido;
    var totalValorPedidoNuevo = __totalNuevoPrecioVenta(pedido);

    var totalValorPedidoActual;
    var estado_pedido;
    var estado_pedido;
    var estado_pedido;

    /**
     * +Descripcion Parametros exclusivos para consultar la disponibilidad 
     *              que tiene el producto
     */
    var empresa_id = args.pedidos_clientes.empresa_id;
    var centro_utilidad = args.pedidos_clientes.centro_utilidad_id;
    var bodega = args.pedidos_clientes.bodega_id;
    var contrato_cliente = args.pedidos_clientes.contrato_cliente_id;

    var filtro = {
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto,
        termino_busqueda: args.pedidos_clientes.termino_busqueda,
        laboratorio_id: (args.pedidos_clientes.laboratorio_id === undefined) ? '' : args.pedidos_clientes.laboratorio_id,
        numero_cotizacion: (args.pedidos_clientes.numero_cotizacion === undefined) ? '' : args.pedidos_clientes.numero_cotizacion,
        numero_pedido: (args.pedidos_clientes.numero_pedido === undefined) ? '' : args.pedidos_clientes.numero_pedido,
        filtro_producto: 0
    };

    var filtroAvanzado = {
        molecula: args.pedidos_clientes.molecula,
        laboratorio_id: args.pedidos_clientes.laboratorio_id,
        codigoProducto: args.pedidos_clientes.codigoProducto,
        descripcionProducto: args.pedidos_clientes.descripcionProducto,
        concentracion: args.pedidos_clientes.concentracion,
        tipoBusqueda: args.pedidos_clientes.tipoBusqueda,
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto
    };

    var filtros = args.pedidos_clientes.filtro;
    var pagina = args.pedidos_clientes.pagina_actual;

    var parametros = {empresa_id: empresa_id,
        centro_utilidad: centro_utilidad,
        bodega: bodega,
        contrato_cliente: contrato_cliente,
        filtro: filtro,
        pagina: pagina,
        filtros: filtros,
        filtroAvanzado: filtroAvanzado
    };

    var disponibilidadProducto;
    var paramLogAutorizarPedido = __parametrosLogs(pedido.numero_pedido, pedido.productos, pedido.usuario_id, "Se solicita aprobacion Pedido", totalValorPedidoNuevo, 1, 0);
    /**
     * +Descripcion: Se permitira ejecutar la accion de eliminarProductoPedido
     *               siempre y cuando el pedido tenga el
     *               estado (Estado del Pedido ) 1
     *               estado_pedido (Estado de solicitud ) 0 pero anterior a esto
     *               se validara de que el pedido al menos quede con un solo pro-
     *               ducto
     */

    G.Q.ninvoke(that.m_pedidos_clientes, 'listar_productos',
            parametros.empresa_id,
            parametros.centro_utilidad,
            parametros.bodega,
            parametros.contrato_cliente,
            parametros.filtro,
            parametros.pagina,
            parametros.filtros,
            parametros.filtroAvanzado).then(function (resultado) {

        disponibilidadProducto = resultado[0].cantidad_disponible;

        return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalProductosPedido', numeroPedido);

    }).then(function (resultado) {

        if (resultado.length > 0) {

            if (resultado[0].total === "1") {
                throw 'El pedido no puede quedar sin productos';
                return;
            } else {
                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoPedidoEstado', numeroPedido);
            }
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            if (resultado[0].estado === '1' &&
                    (resultado[0].estado_pedido === '0' || resultado[0].estado_pedido === '8' && producto.cantidadPendiente > 0)
                    || resultado[0].estado === '4' && disponibilidadProducto === 0
                    || resultado[0].estado === '4' && disponibilidadProducto < producto.cantidad_solicitada
                    ) {

                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarTotalValorPedidoCliente', numeroPedido);

            } else {
                throw 'El pedido debe <br>\n' + '1. estar activo <br>\n' + ' 2. para autorizar nuevamente por cartera <br>\n' + ' 3. contener pendientes';
                return;
            }

        } else {
            throw 'Error interno';
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {


            estado_pedido = 1;
            return G.Q.ninvoke(that.m_pedidos_clientes, 'eliminar_producto_pedido', pedido, producto);

        } else {
            throw 'Error Interno';
            return;
        }

    }).then(function (resultado) {


        if (resultado.rowCount > 0) {

            pedido.aprobado_cartera = '0';
            pedido.observacion_cartera = '';
            return G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstadoPedido', pedido, estado_pedido);

        } else {
            throw 'Error Interno';
            return;
        }

    }).then(function (resultado) {

        if (resultado > 0) {

            that.e_pedidos_clientes.onNotificarEstadoPedido(pedido.numero_pedido, estado_pedido);
            res.send(G.utils.r(req.url, 'Se modifica el pedido satisfactoriamenteo', 200, {pedidos_clientes: {}}));
            //Agregamdo validacion
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);
        } else {

            throw  'Error actualizando la observacion de cartera';
            return;

        }

    }).then(function (resultado) {

        /**
         * +Descripcion Si el pedido no se encuentra registrado en la tabla de trazabilidad
         *              se procede a registrarlo, de lo contrario solo lo actualizara  
         */

        if (estado_pedido === 1) { //estado_pedido = 4  

            if (resultado.length === 1) {
                return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logActualizarSolicitudProducto', paramLogAutorizarPedido);
            } else {
                return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogAutorizarPedido);
            }

        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author : Camilo Orozco
 * +Descripcion : Generar las observaciones ingresadas por el area de cartera
 * +Modificacion: Se reemplaza la funcion observacion_cartera_pedido por
 *               actualizarPedidoCarteraEstadoNoAsigando con el proposito de
 *               actualizar el estado del pedido a 1
 * @fecha: 05/11/15
 */
PedidosCliente.prototype.observacionCarteraPedido = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.pedido === undefined || args.pedidos_clientes.pedido === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o pedido No Estan Definidos', 404, {}));
        return;
    }

    var pedido = args.pedidos_clientes.pedido;
    var aprobado = args.pedidos_clientes.aprobado;
    pedido.usuario_id = req.session.user.usuario_id;

    if (pedido.numero_pedido === undefined || pedido.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'El numero de pedido no esta definido o esta vacio', 404, {}));
        return;
    }

    if (pedido.aprobado_cartera === undefined || pedido.aprobado_cartera === '') {
        res.send(G.utils.r(req.url, 'La aporbacion cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    if (pedido.observacion_cartera === undefined || pedido.observacion_cartera === '') {
        res.send(G.utils.r(req.url, 'El campo de observacion de cartera no esta definido o esta vacio', 404, {}));
        return;
    }

    var paramLogExistencia = {
        numero: pedido.numero_pedido,
        tipo: '1',
        pendiente: 0
    };

    var estadoAprobacion;
    if (aprobado === 4) {

        estadoAprobacion = 2;
    } else {
        estadoAprobacion = 1;
    }
    pedido.estado_desaprobado = aprobado;
    var paramLogActualizarAutorizarPedido = __parametrosLogs(pedido.numero_pedido, pedido.productos, pedido.usuario_id, pedido.observacion_cartera, pedido.total, 1, estadoAprobacion);

    G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarPedidoCarteraEstadoNoAsigando', pedido).then(function (resultado) {

        if (resultado > 0) {

            res.send(G.utils.r(req.url, 'Modificacion exitosa', 200, {pedidos_clientes: {}}));
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logConsultarExistenciaNumero', paramLogExistencia);

        } else {

            throw ('Error Actualizando el estado del pedidopara la aprobacion')
        }
    }).then(function (resultado) {

        /**
         * +Descripcion Se actualizara el estado del pedido a aprobado
         */
        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logAprobacionCotizacion', paramLogActualizarAutorizarPedido);
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar Reporte PDF de Pedido y enviar por email
 */
PedidosCliente.prototype.reportePedido = function (req, res) {


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

    that.m_pedidos_clientes.consultar_pedido(pedido.numero_pedido, function (err, datos_pedido) {

        if (err || datos_pedido.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno consultado la cotizacion', 500, {pedidos_clientes: []}));
            return;
        } else {
            that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function (err, lista_productos) {

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

                _generar_reporte_pedido(datos_reporte, function (nombre_reporte) {

                    if (enviar_email) {

                        var path = G.dirname + "/public/reports/" + nombre_reporte;
                        var filename = "PedidoNo-" + pedido.numero_cotizacion + '.pdf';

                        __enviar_correo_electronico(that, emails, path, filename, subject, message, function (enviado) {

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
                then(function () {
                    return  G.Q.nfcall(G.fs.unlink, ruta_tmp);
                }).then(function () {
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
                fail(function (err) {
                    G.fs.unlinkSync(ruta_nueva);
                    callback(true);
                }).
                done();

    } else {
        callback(true);
    }
}
;

/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de validar la disponibilidad de un producto
 *              invocando a la vez una funcion recursiva la cual se encargara
 *              de todo el proceso
 * @fecha 29/09/2016 DD/MM/YYYY
 */
var productosSinDisponible = [];
var productosDisponibles = [];
PedidosCliente.prototype.validarDisponibilidad = function (req, res) {

    var that = this;
    var args = req.body.data;
    productosSinDisponible = [];

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.empresa_id === undefined || args.pedidos_clientes.centro_utilidad_id === undefined || args.pedidos_clientes.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.contrato_cliente_id === undefined) {
        res.send(G.utils.r(req.url, 'contrato_cliente_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_clientes.empresa_id === '' || args.pedidos_clientes.centro_utilidad_id === '' || args.pedidos_clientes.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacÃ­os', 404, {}));
        return;
    }

    if (args.pedidos_clientes.contrato_cliente_id === '') {
        res.send(G.utils.r(req.url, 'contrato_cliente_id esta vacÃ­o', 404, {}));
        return;
    }

    if (args.pedidos_clientes.pagina_actual === '' || parseInt(args.pedidos_clientes.pagina_actual) <= 0) {
        res.send(G.utils.r(req.url, 'pagina_actual esta vacio o es 0', 404, {}));
        return;
    }

    if (args.pedidos_clientes.molecula === undefined) {
        args.pedidos_clientes.molecula = '';
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
        numero_pedido: (args.pedidos_clientes.numero_pedido === undefined) ? '' : args.pedidos_clientes.numero_pedido,
        filtro_producto: 1
    };

    var filtroAvanzado = {
        molecula: args.pedidos_clientes.molecula,
        laboratorio_id: args.pedidos_clientes.laboratorio_id,
        codigoProducto: args.pedidos_clientes.codigoProducto,
        descripcionProducto: args.pedidos_clientes.descripcionProducto,
        concentracion: args.pedidos_clientes.concentracion,
        tipoBusqueda: args.pedidos_clientes.tipoBusqueda,
        tipo_producto: (args.pedidos_clientes.tipo_producto === undefined) ? '' : args.pedidos_clientes.tipo_producto
    };


    var filtros = args.pedidos_clientes.filtro;
    var pagina = args.pedidos_clientes.pagina_actual;

    var parametros = {empresa_id: empresa_id,
        centro_utilidad: centro_utilidad,
        bodega: bodega,
        contrato_cliente: contrato_cliente,
        filtro: filtro,
        pagina: pagina,
        filtros: filtros,
        filtroAvanzado: filtroAvanzado
    };

    var productos = args.pedidos_clientes.productos;

    G.Q.nfcall(__disponibilidadProductos, that, 0, productos, parametros).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Nombre Reporte', 200, {pedidos_clientes: {producto: resultado}}));


    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {pedidos_clientes: []}));
    }).done();

};

/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de recorrer el arreglo de los productos
 *              temporales que se almacenaran como pendientes
 * @fecha 2016-08-01
 * @Funcion local
 */
function __disponibilidadProductos(that, index, productos, parametros, callback) {

    var producto = productos[index];
    var def = G.Q.defer();
    var productoUnidadMedida = "";
    if (!producto) {

        callback(false, productosSinDisponible);//rowCount  
        return;
    }

    parametros.filtro.termino_busqueda = producto.codigo_producto;

    G.Q.ninvoke(that.m_pedidos_clientes, 'listar_productos',
            parametros.empresa_id,
            parametros.centro_utilidad,
            parametros.bodega,
            parametros.contrato_cliente,
            parametros.filtro,
            parametros.pagina,
            parametros.filtros,
            parametros.filtroAvanzado)
            .then(function (resultado) {


                if (producto.cantidad_solicitada > resultado[0].cantidad_disponible || resultado[0].cantidad_disponible === 0) {
                    productoUnidadMedida = resultado[0];
                    resultado[0].cantidad_solicitada = producto.cantidad_solicitada;
                    productosSinDisponible.push(resultado[0]);
                    def.resolve();
                } else {
                    resultado[0].cantidad_solicitada = producto.cantidad_solicitada;
                    productoUnidadMedida = resultado[0];

                    return G.Q.nfcall(that.m_productos.validarUnidadMedidaProducto, {cantidad: parseInt(producto.cantidad_solicitada), codigo_producto: producto.codigo_producto});

                }


            }).then(function (resultado) {

        index++;

        if (!resultado) {

            setTimeout(function () {
                __disponibilidadProductos(that, index, productos, parametros, callback);
            }, 0);

        } else if (resultado.length > 0 && resultado[0].valido === '1') {             
            productosDisponibles.push(productoUnidadMedida);
            setTimeout(function () {
                __disponibilidadProductos(that, index, productos, parametros, callback);
            }, 0);

        } else {
            producto.mensajeError = "La cantidad ingresada no es valida para el producto";
            producto.cantidadValida = false;
            productosSinDisponible.push(productoUnidadMedida);

            setTimeout(function () {
                __disponibilidadProductos(that, index, productos, parametros, callback);
            }, 0);
        }

    }).fail(function (err) {
    }).done();

}
;

/*
 * Autor : Eduar Garcia
 * Descripcion : Validar que los codigos de los productos del archivo plano sean validos.
 *
 */
function __validar_productos_archivo_plano(that, index, filas, productosValidos, productosInvalidos, callback) {

    var producto = filas[index];
    if (!producto) {

        callback(false, productosValidos, productosInvalidos);
        return;
    }

    /**
     * +Descripcion Funcion encargada de modificar el detalle del pedido
     */
    G.Q.ninvoke(that.m_productos, 'validar_producto', producto.codigo).then(function (resultado) {

        var _producto = {codigo_producto: producto.codigo, cantidad_solicitada: producto.cantidad};

        if (resultado.length > 0 && producto.cantidad > 0) {

            _producto.tipoProductoId = resultado[0].tipo_producto_id;
            _producto.descripcion = resultado[0].descripcion_producto;
            _producto.cantidadSolicitada = producto.cantidad;
            _producto.totalSolicitado = 0;
            _producto.totalDisponible = 0;
            productosValidos.push(_producto);

        } else {
            _producto.mensajeError = "No existe en inventario";
            _producto.existeInventario = false;
            productosInvalidos.push(_producto);

        }

        index++;
        setTimeout(function () {
            __validar_productos_archivo_plano(that, index, filas, productosValidos, productosInvalidos, callback);
        }, 0);

    }).fail(function (error) {

        callback(error);
    });
}
;




/**
 * @author Cristian Ardila
 * +Descripcion Funcion encargada se obtener todo el detalle de los productos
 *              del archivo plano
 * @fecha 07/03/2017 DD/MM/YYYY         
 */
function __validar_datos_productos_archivo_plano(that, obj, productos, productos_validos, productos_invalidos, index, callback) {
    
    var producto = productos[index];

    if (!producto) {
        callback(false, productos_validos, productos_invalidos);
        return;
    }

    obj.pedidos_clientes.contrato_cliente_id = obj.pedidos_clientes.cotizacion.cliente.contrato_id;
    obj.pedidos_clientes.codigoProducto = producto.codigo_producto;
    obj.pedidos_clientes.termino_busqueda = producto.codigo_producto;
    obj.pedidos_clientes.filtro = {nombre: 'Codigo', tipo_busqueda: 2, numero: [null], tipo: 1}
    obj.pedidos_clientes.tipoBusqueda = 0;

    
    G.Q.ninvoke(that, "__listarProductosClientes", obj).then(function (lista_productos) {

        index++;
        if (lista_productos.length === 0) {
            

            productos_invalidos.push(lista_productos.data.productos.sort(dynamicSort("codigo_producto")));

            setTimeout(function() {
                __validar_datos_productos_archivo_plano(that, obj, productos, productos_validos, productos_invalidos, index, callback);
            }, 0);
            return;
        }else{

            var _producto = lista_productos.data.productos.sort(dynamicSort("codigo_producto"));
            producto.contrato_cliente_id = obj.pedidos_clientes.cotizacion.cliente.contrato_id;

            productos_validos.push(_producto);

        }
        setTimeout(function(){
            __validar_datos_productos_archivo_plano(that, obj, productos, productos_validos, productos_invalidos, index, callback);
        }, 0);


    }).fail(function (err) {
        
        console.log("error[__validar_datos_productos_archivo_plano]: ", err)
    }).done();
};





/**
 * @author Cristian Ardila
 * @fecha  04/04/2016
 * +Descripcion Metodo encargado de validar si un producto es regulado,
 *              regulado = 1 (regulado), 2(no regulado)
 * @param {type} producto
 * @param {type} resultado
 */
function __validarPrecioVenta(producto, resultado, tipo) {

    var precioVenta;
    if (tipo === 0) {
        precioVenta = Number(producto.precioVentaIva);
    } else {
        precioVenta = Number(resultado[0].precio_producto);
    }

    var valido = true;

    var precioRegulado = Number(resultado[0].precio_regulado);
    var precioPactado = Number(resultado[0].precio_pactado);
    var costoCompra = Number(resultado[0].costo_ultima_compra);
    var msj = "";

    /**
     * +Descripcion: Valida si el producto es regulado
     */
    if (resultado[0].sw_regulado === '1') {

        /**
         * +Descripcion: Si precio de venta es mayor al precio regulado
         *              Ã³ el precio pactado es mayor al regulado
         *              cancele la accion
         */
        if (precioVenta > precioRegulado || precioPactado > precioRegulado) {
            valido = false;
            msj = 'El precio de venta esta por encima del regulado';
        }
    }
    /**
     * +Descripcion: Valida si el producto no es regulado y su precio pctado
     *               esta en 0
     */
    if (resultado[0].sw_regulado !== '1' && precioPactado === 0) {
        if (precioVenta < costoCompra) {
            valido = false;
            msj = "El precio de venta esta por debajo del costo";
        }
    }

    if (precioVenta === 0) {
        valido = false;
        msj = "El precio de venta debe ser mayor a cero (0)";
    }

    return {valido: valido, msj: msj}
}


/*
 * @author Camilo Orozco
 * +Descripcion Separar productos segun sea su tipo ej. Normales, Alto Costo, Controlados etc.
 */
function __agrupar_productos_por_tipo(productos, productosAgrupados, index, callback) {

    var productosAgrupados = {};

    if (productos.length === 0) {
        callback(productosAgrupados);
        return;
    }

    productos.forEach(function (row) {
        if (productosAgrupados[row.tipo_producto]) {
            productosAgrupados[row.tipo_producto].push(row);
        } else {
            productosAgrupados[row.tipo_producto] = [row];
        }
    });

    callback(false, productosAgrupados);



}


/*
 * @author Camilo Orozco
 * +Descripcion Generar reporte decotizaciones
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
    }, function (err, response) {

        response.body(function (body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function (err) {

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
    }, function (err, response) {

        response.body(function (body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function (err) {

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

    var messageDefect = "<ul><li>1. FAVOR CONFIRMAR COTIZACION AL CORREO ventas@duanaltda.com PARA PODER TRAMITAR SU PEDIDO (Aplica solo para empleados).</li>\n\
                             <li>2. USTED TENDRA UN PLAZO DE 8 DIAS CONTADOS AL MOMENTO DE LA CONFIRMACION DEL PEDIDO, PARA RECLAMARLO DE LO CONTRARIO SERA BLOQUEADO EN EL SISTEMA PARA COMPRAR.</li>\n\
                             <li>" + message + "</li></ul>";
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
        html: messageDefect,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function (error, response) {

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



/*
 * Author : Cristian Ardila
 * Descripcion :  Funcion recursiva que recorrera un arreglo de productos
 *                y los ira modificando uno a uno incovando al modelo
 *                modifcar_detalle_pedido
 * Modificacion: Se migra a KNEX.js
 * @fecha: 17/03/2016 5:05 pm
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.insertarCantidadProductoDetallePedido
 */
function __productosPedidos(parametros, callback) {

    var resultado = parametros.productos[parametros.index];

    if (!resultado) {
        return callback(resultado);
    }
    /**
     * +Descripcion Funcion encargada de modificar el detalle del pedido
     */
    G.Q.ninvoke(parametros.contexto.m_pedidos_clientes, 'modificar_detalle_pedido', parametros.pedido, resultado).then(function (resultado) {

        setTimeout(function () {
            parametros.index++;
            __productosPedidos(parametros, callback);
        }, 0);

    }).fail(function (error) {

        callback(error);
    });
}
;




/*********************************GENERAR PEDIDO DESDE FARMACIAS *******************************/
/**
 * +Descripcion Metodo encargado de validar los productos enviados desde el modulo
 *              de farmacia, validacion consiste en precio regulado etc 
 * @fecha 30/01/2017
 * @author Cristian Ardila 
 */
function __validarProductosPedidosBodegaFarmacia(that, index, cotizacion, productos, productos_validos, productos_invalidos, callback) {

    var producto = productos[index];

    if (!producto) {

        callback(false, productos_validos, productos_invalidos);
        return;
    }

    index++;
    var parametros = {empresaId: cotizacion.empresa_id, codigoProducto: producto.codigo_producto, contratoId: cotizacion.cliente.contrato_cliente_id};
    G.Q.ninvoke(that.m_productos, 'consultarPrecioReguladoProducto', parametros).then(function (resultado) {

        /**
         * +Descripcion: Se invoca la funcion con un object {valido=boolean, msj = string}
         **/
        var precioVenta = __validarPrecioVenta(producto, resultado, 0);

        if (precioVenta.valido) {
            productos_validos.push(producto);
        } else {

            producto.mensajeError = precioVenta.msj;
            productos_invalidos.push(producto);

        }
        setTimeout(function () {
            __validarProductosPedidosBodegaFarmacia(that, index, cotizacion, productos, productos_validos, productos_invalidos, callback);
        }, 0);

    }).fail(function (err) {
        callback({msj: 'Error al consultar el precio regulado de cada producto', status: 500, pedidos_clientes: ''});
        console.log("err (/fail) [__validarProductosPedidosBodegaFarmacia]: ", err);
    }).done();



}
;


/**
 * +Descripcion Metodo encargado de insertar los productos en el detalle del pedido
 * @fecha 30/01/2017
 * @author Cristian Ardila 
 */
function __insertarProductosFarmaciaCotizacion(that, index, cotizacion, productos, callback) {

    var producto = productos[index];
    if (!producto) {
        callback(false);
        return;
    }

    G.Q.ninvoke(that.m_pedidos_clientes, 'insertar_detalle_cotizacion', cotizacion, producto).then(function (resultado) {

        setTimeout(function () {
            __insertarProductosFarmaciaCotizacion(that, index, cotizacion, productos, callback);
        }, 0);

    }).fail(function (err) {
        callback({msj: 'Error al insertar los productos en la cotizacion', status: 500, pedidos_clientes: ''});
        console.log("err (/fail) [__insertarProductosFarmaciaCotizacion]: ", err);
    }).done();

    index++;


}
;




function __precioVentaProductos(that, index, cotizacion, callback) {

    var productosInvalidos = [];
    var producto = cotizacion.productos[index];

    if (!producto) {
        callback(false, cotizacion);
        return;
    }

    index++;
    /**
     * +Descripcion Parametros exclusivos para consultar la disponibilidad 
     *              que tiene el producto
     */
    var filtro = {
        tipo_producto: (cotizacion.tipo_producto === undefined) ? '' : cotizacion.tipo_producto,
        termino_busqueda: producto.codigo_producto,
        laboratorio_id: (cotizacion.laboratorio_id === undefined) ? '' : cotizacion.laboratorio_id,
        numero_cotizacion: (cotizacion.numero_cotizacion === undefined) ? '' : cotizacion.numero_cotizacion,
        numero_pedido: (cotizacion.numero_pedido === undefined) ? '' : cotizacion.numero_pedido,
        filtro_producto: 0
    };

    var filtroAvanzado = {
        molecula: cotizacion.molecula,
        laboratorio_id: cotizacion.laboratorio_id,
        codigoProducto: cotizacion.codigoProducto,
        descripcionProducto: cotizacion.descripcionProducto,
        concentracion: cotizacion.concentracion,
        tipoBusqueda: 0,
        tipo_producto: (cotizacion.tipo_producto === undefined) ? '' : cotizacion.tipo_producto
    };

    var filtros = '';

    /**
     * +Descripcion: Se permitira ejecutar la accion de eliminarProductoPedido
     *               siempre y cuando el pedido tenga el
     *               estado (Estado del Pedido ) 1
     *               estado_pedido (Estado de solicitud ) 0 pero anterior a esto
     *               se validara de que el pedido al menos quede con un solo pro-
     *               ducto
     */
    var parametros = {empresaId: cotizacion.empresa_id, codigoProducto: producto.codigo_producto, contratoId: cotizacion.cliente.contrato_cliente_id};



    G.Q.ninvoke(that.m_pedidos_clientes, 'listar_productos',
            cotizacion.empresa_id,
            cotizacion.centro_utilidad_id,
            cotizacion.bodega_id,
            cotizacion.cliente.contrato_cliente_id,
            filtro,
            1, filtros, filtroAvanzado).then(function (lista_productos) {

        var _producto = lista_productos[0];
        producto.codigo_producto = _producto.codigo_producto;
        producto.iva = _producto.iva;
        producto.precio_venta = _producto.precio_producto;
        producto.tipo_producto = _producto.tipo_producto_id;
        producto.precioVentaIva = _producto.precio_producto;
        producto.sumaCantidadTotalSolicitadaBodega = 0;
        producto.sumaCantidadTotalDisponibleBodega = 0;
        producto.mensajeError = "";
        producto.cantidadValida = true;
        setTimeout(function () {
            __precioVentaProductos(that, index, cotizacion, callback);
        }, 0);

    }).fail(function (err) {
        producto.mensajeError = 'No se encuentra en la bodega el producto ';
        productosInvalidos.push(producto)
        callback({msj: 'El producto no se encuentra en la bodega', status: 403, pedidos_clientes: {productos_invalidos: productosInvalidos}});
        //callback({ msj:'Error al consultar el producto',  status:500,  pedidos_clientes:''});
        console.log("err (/fail) [__precioVentaProductos]: ", err);
    }).done();

}
;


/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de automatizar todo el proceso de cotizacion
 *              y pedido, generando el pedido sin las previas autorizaciones
 *              de cartera
 * @fecha 01/02/2017 (DD/MM/YYYY)
 */
PedidosCliente.prototype.generarPedidoBodegaFarmacia = function (req, res) {

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
    if (!cotizacion.empresa_id || !cotizacion.centro_utilidad_id || !cotizacion.bodega_id) {
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
    var obj = {
        "tipo_id_tercero": cotizacion.cliente.tipo_id_tercero,
        "tercero_id": cotizacion.cliente.id
    };
    var def = G.Q.defer();
    var generarPedidoCliente;

    G.Q.ninvoke(that.terceros_clientes_model, "obtenterClientePorId", obj).then(function (tercero) {

        if (tercero.length > 0) {
            if (tercero[0].tipo_bloqueo_id !== '1') {
                cotizacion.cliente.tipoBloqueoId = tercero[0].tipo_bloqueo_id;
                throw {msj: "El cliente seleccionado se encuentra bloqueado o inactivo", status: 404, pedidos_clientes: {}};
            } else {
                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoAutorizacionCliente', obj);
            }
        } else {
            throw {msj: "El tercero no se encuentra registrado", status: 404, pedidos_clientes: {}};
        }



    }).then(function (resultado) {
        if (resultado.length > 0) {
            if (resultado[0].sw_facturacion_agrupada === '1' && resultado[0].sw_autorizacion === '0') {
                cotizacion.cliente.contrado_id = resultado[0].contrato_cliente_id;
                cotizacion.cliente.contrato_cliente_id = resultado[0].contrato_cliente_id;
                return G.Q.nfcall(__precioVentaProductos, that, 0, cotizacion);
            } else {
                throw {msj: "La farmacia no esta permitida para generar pedidos", status: 404, pedidos_clientes: {}};
            }
        } else {
            throw {msj: "El cliente no se encuentra registrado en la tabla de contratos", status: 404, pedidos_clientes: {}};
        }

    }).then(function (resultado) {

        return G.Q.nfcall(__validarProductosPedidosBodegaFarmacia, that, 0, cotizacion, cotizacion.productos, [], [])

    }).then(function (productos) {

        if (productos[1].length > 0) {
            throw {msj: "Lista de productos no validos", status: 403, pedidos_clientes: {productos_invalidos: productos[1]}};

            return;
        }
        if (cotizacion.cliente_autorizado) {

            def.resolve();
        } else {
            return G.Q.ninvoke(that, "__insertarCotizacion", obj, cotizacion);

        }

    }).then(function (resultado) {

        if (!resultado) {
            cotizacion.numero_cotizacion = cotizacion.cliente_autorizado;
            def.resolve();
        } else {
            cotizacion.numero_cotizacion = resultado.pedidos_clientes.numero_cotizacion;
            return G.Q.nfcall(__insertarProductosFarmaciaCotizacion, that, 0, cotizacion, cotizacion.productos);

        }

    }).then(function (resultado) {

        cotizacion.total = __totalNuevoPrecioVenta(cotizacion);

        var paramLogCliente = __parametrosLogs(cotizacion.numero_cotizacion, cotizacion.productos, cotizacion.usuario_id, "Se solicita aprobacion", cotizacion.total, 0, 0);
        return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logTrazabilidadVentas', paramLogCliente);

    }).then(function (resultado) {

        var paramLogCliente = __parametrosLogs(cotizacion.numero_cotizacion, cotizacion.productos, cotizacion.usuario_id, "APROBADO AUTOMATICAMENTE", cotizacion.total, 0, 1);
        return G.Q.ninvoke(that.m_pedidos_clientes_log, 'logAprobacionCotizacion', paramLogCliente);

    }).then(function (resultado) {
        cotizacion.empresa_id = '03';
        cotizacion.centro_utilidad_id = '1';
        cotizacion.bodega_id = '03';
        return G.Q.ninvoke(that.m_pedidos_clientes, 'generar_pedido_cliente', cotizacion);

    }).then(function(resultado){

        generarPedidoCliente = resultado;
        if (!cotizacion.pedido_multiple_farmacia || cotizacion.pedido_multiple_farmacia === undefined) {
     
            def.resolve();
        }else{
     
            return G.Q.ninvoke(that.m_pedidos_clientes, 'actualizarEstadoPedidoMultipleFarmacia', 
            {numero_pedido:resultado.numero_pedido,
            pedido_multiple_farmacia:cotizacion.pedido_multiple_farmacia}); 
        }        
    
    }).then(function (resultado) {
  
        return G.Q.ninvoke(that, "__asignarResponsablesPedidos", cotizacion, generarPedidoCliente);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, resultado.msj, resultado.status, resultado.data));

    }).fail(function (err) {
        console.log("err [generarPedidoBodegaFarmacia]: ", err);
        res.send(G.utils.r(req.url, err.msj, err.status, {pedidos_clientes: err.pedidos_clientes}));
    });

};




PedidosCliente.prototype.consultarEstadoAutorizacion = function (req, res) {

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



    var cotizacion = args.pedidos_clientes.cotizacion;

    var obj = {
        "tipo_id_tercero": cotizacion.cliente.tipo_id_tercero,
        "tercero_id": cotizacion.cliente.id
    };


    G.Q.ninvoke(that.m_pedidos_clientes, 'consultarExistenciaPedidoCotizacion', cotizacion.numero_cotizacion).then(function (resultado) {

        if (resultado.length > 0) {

            throw {msj: 'La cotizacion ya se encuentra con un pedido asignado', status: 404, pedidos_clientes: {}};
            return;
        } else {

            return G.Q.ninvoke(that.terceros_clientes_model, "obtenterClientePorId", obj);

        }

    }).then(function (tercero) {

        if (tercero.length > 0) {
            if (tercero[0].tipo_bloqueo_id !== '1') {
                cotizacion.cliente.tipoBloqueoId = tercero[0].tipo_bloqueo_id;
                throw {msj: "El cliente seleccionado se encuentra bloqueado o inactivo", status: 404, pedidos_clientes: {}};
            } else {
                return G.Q.ninvoke(that.m_pedidos_clientes, 'consultarEstadoAutorizacionCliente', obj);
            }
        } else {
            throw {msj: "El tercero no se encuentra registrado", status: 404, pedidos_clientes: {}};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            if (resultado[0].sw_facturacion_agrupada === '1' && resultado[0].sw_autorizacion === '0') {
                return res.send(G.utils.r(req.url, 'La farmacia esta autorizada', 200, {pedidos_clientes: []}));
            } else {
                throw {msj: "El Cliente no esta autorizado para realizar el Pedido", status: 404, pedidos_clientes: {}};
            }
        } else {
            throw {msj: "El cliente no se encuentra registrado en la tabla de contratos", status: 404, pedidos_clientes: {}};
        }
    }).fail(function (err) {
        console.log("err [consultarEstadoAutorizacion]: ", err);
        res.send(G.utils.r(req.url, err.msj, err.status, {pedidos_clientes: err.pedidos_clientes}));
    });


}




PedidosCliente.prototype.actualizarProductoCotizacionBodegaCosmitet = function (req, res) {

    var that = this;

    var args = req.body.data;

    // Cotizacion
    if (args.pedidos_clientes === undefined || args.pedidos_clientes === '') {
        res.send(G.utils.r(req.url, 'pedidos_clientes o cotizacion No Estan Definidos', 404, {}));
        return;
    }
    var productos = args.pedidos_clientes.productos;


    G.Q.nfcall(__actualizarProductoCotizacionBodegaCosmitet, that, 0, productos).then(function (rows) {

        res.send(G.utils.r(req.url, 'Producto actualizado satisfactoriamente', 200, {pedidos_clientes: rows}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, "Error Interno", 500, {pedidos_clientes: []}));

    }).done();

};

function __actualizarProductoCotizacionBodegaCosmitet(that, index, productos, callback) {

    var producto = productos[index];

    if (!producto) {

        callback(false);
        return;
    }
    index++;

    G.Q.ninvoke(that.m_pedidos_clientes, "actualizarProductoCotizacionBodegaCosmitet", producto).then(function (rows) {

        setTimeout(function () {
            __actualizarProductoCotizacionBodegaCosmitet(that, index, productos, callback);
        }, 0);

    }).fail(function (err) {

        setTimeout(function () {
            __actualizarProductoCotizacionBodegaCosmitet(that, index, productos, callback);
        }, 0);
    }).done();



}
;
/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de asignar el responsable del pedido, actualizar
 *              el estado terminado del pedido, y si es el caso almacenar los productos
 *              proximos a autorizar
 * @fecha 03/02/2017 (DD/MM/YYYY)
 */
PedidosCliente.prototype.__asignarResponsablesPedidos = function (cotizacion, pedidoGenerado, callback) {

    var that = this;
    that.pedidoGenerado = pedidoGenerado;
    var autorizacion = {};


    G.Q.ninvoke(that.m_pedidos_clientes, 'asignar_responsables_pedidos', pedidoGenerado.numero_pedido, pedidoGenerado.estado, null, cotizacion.usuario_id)

            .then(function (resultado) {

                if (resultado.length > 0) {
                    return G.Q.ninvoke(that.m_pedidos_clientes, 'terminar_estado_pedido', that.pedidoGenerado.numero_pedido, [that.pedidoGenerado.estado], '1');
                } else {
                    throw {msj: 'Se ha Generado un Error en la Asignacion de Responsables', status: 401, pedidos_clientes: {}};
                }

            }).then(function (resultado) {

        if (resultado.rowCount > 0) {

            var cliente = 0;
            autorizacion.farmacia = cliente;
            autorizacion.empresa_id = cotizacion.empresa_id;
            autorizacion.numero_pedido = that.pedidoGenerado.numero_pedido;

            return G.Q.nfcall(__guardarAutorizacion, that, autorizacion);
        } else {
            throw {msj: 'Error finalizando el estado del pedido', status: 401, pedidos_clientes: {}};
        }

    }).then(function (resultado) {
	
        var notificacion = {
            aliasModulo: 'productos_en_pedidos',
            opcionModulo: "sw_ver_notificaciones",
            titulo: "Autorizaciones Pedidos Clientes",
            mensaje: "El pedido No. " + autorizacion.numero_pedido + " requiere autorizacion"
        };

        if (resultado) {
            that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: that.pedidoGenerado.numero_pedido});
            G.eventEmitter.emit("onRealizarNotificacionWeb", notificacion);
        }

        that.e_pedidos_clientes.onNotificarEstadoCotizacion(cotizacion.numero_cotizacion);
        callback(false, {status: 200, msj: 'Pedido Generado Correctamente No . ' + that.pedidoGenerado.numero_pedido, data: {pedidos_clientes: that.pedidoGenerado}});

    }).fail(function (err) {
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        callback(err, {status: status, msj: msj});

    }).done();

};


PedidosCliente.$inject = ["m_pedidos_clientes",
    "e_pedidos_clientes",
    "m_productos",
    "m_pedidos",
    "m_terceros",
    "emails",
    "m_pedidos_farmacias", "m_pedidos_clientes_log", "terceros_clientes_model","m_pedidos_logs"];

module.exports = PedidosCliente;
