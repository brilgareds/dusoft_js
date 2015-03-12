
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes, productos, m_pedidos) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;
    this.m_productos = productos;
    this.m_pedidos = m_pedidos;
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
 * @apiSuccessExample Ejemplo Válido del Request.
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 'jhon.doe',
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : {
 *              pedidos_clientes :  { 
 *                                      termino_busqueda : '',
 *                                      pagina_actual: ''
 *                                  }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosClientes/listarPedidos',   
 *       msj : 'Lista Pedidos Clientes',
 *       status: '200',
 *       obj : {
 *                  pedidos_clientes : [ 
 *                                        {   
 *                                             numero_pedido: 33872,
 *                                             tipo_id_cliente: 'CE',
 *                                             identificacion_cliente: '10365',
 *                                             nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL
 *                                             direccion_cliente: 'CALLE 14 15-49',
 *                                             telefono_cliente: '8236444',
 *                                             tipo_id_vendedor: 'CC ',
 *                                             idetificacion_vendedor: '94518917',
 *                                             nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',
 *                                             estado: '1',
 *                                             descripcion_estado: 'Activo',
 *                                             estado_actual_pedido: '1',
 *                                             descripcion_estado_actual_pedido: 'Separado',
 *                                             fecha_registro: '2014-01-21T17:28:50.700Z' 
 *                                         }
 *                                      ]
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/listarPedidos',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.termino_busqueda === undefined || args.pedidos_clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos_clientes.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var empresa_id = '03';
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;
    var pagina_actual = args.pedidos_clientes.pagina_actual;
    var filtro = args.pedidos_clientes.filtro;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));
    });
};

/**/
PedidosCliente.prototype.consultarPedido = function(req, res) {


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
 *       service : '/api/PedidosClientes/asignarResponsable',   
 *       msj : 'Asignacion de Resposables',
 *       status: '200',
 *       obj : {
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/asignarResponsable',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
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



    //var empresa_id = req.body.empresa_id;
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
                        console.log('==== Notificar Reasignación ======');
                        console.log("responsable Nuevo", responsable, " Repsonable Vejo", responsable_estado_pedido.responsable_id);
                        console.log('===================================');
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
 *       service : '/api/PedidosClientes/asignarResponsable',   
 *       msj : 'Asignacion de Resposables',
 *       status: '200',
 *       obj : {
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/asignarResponsable',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
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
    var estado_pedido = '0'; // 0 = No asignado

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

                        that.m_pedidos_clientes.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
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

                                        res.send(G.utils.r(req.url, 'El Pedido cambio de estado correctamente', 200, {}));
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
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 'jhon.doe',
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : {
 *              pedidos_clientes : { 
 *                                  operario_id:  19,
 *                                  pagina_actual : 1,
 *                                  limite : 40
 *                              }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosClientes/listaPedidosOperarioBodega',   
 *       msj : 'Lista Pedidos Clientes',
 *       status: '200',
 *       obj : {
 *                  pedidos_clientes : [ 
 *                                        {   
 *                                             numero_pedido: 33872,
 *                                             tipo_id_cliente: 'CE',
 *                                             identificacion_cliente: '10365',
 *                                             nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL
 *                                             direccion_cliente: 'CALLE 14 15-49',
 *                                             telefono_cliente: '8236444',
 *                                             tipo_id_vendedor: 'CC ',
 *                                             idetificacion_vendedor: '94518917',
 *                                             nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',
 *                                             estado: '1',
 *                                             descripcion_estado: 'Activo',
 *                                             estado_actual_pedido: '1',
 *                                             descripcion_estado_actual_pedido: 'Separado',
 *                                             fecha_registro: '2014-01-21T17:28:50.700Z',
 *                                             responsable_id: 19,
 *                                             responsable_pedido: 'Ixon Eduardo Niño',
 *                                             fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z',
 *                                             lista_productos:[
 *                                                               {
 *                                                                  numero_pedido : 33872,
 *                                                                  codigo_producto : '1145C1131279',
 *                                                                  descripcion_producto : 'OFTAFLOX . UNGUENTO OFTALMICO | TUBO X 5GR. SCANDINAVIA',
 *                                                                  cantidad_solicitada : 10,
 *                                                                  cantidad_despachada : 0,
 *                                                                  cantidad_pendiente : 10,
 *                                                                  cantidad_facturada : 0,
 *                                                                  valor_unitario: 8450,
 *                                                                  porcentaje_iva : 0,
 *                                                                  valor_unitario_con_iva: 8450,
 *                                                                  valor_iva: 0
 *                                                               }
 *                                             ] 
 *                                         }
 *                                      ]
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/listaPedidosOperarioBodega',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
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
 *       service : '/api/PedidosClientes/insertarCotizacion',   
 *       msj : 'Asignacion de Resposables',
 *       status: '200',
 *       obj : {
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosClientes/insertarCotizacion',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosCliente.prototype.insertarCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizacion_encabezado === undefined || args.cotizacion_encabezado.empresa_id === undefined || args.cotizacion_encabezado.tipo_id_tercero === undefined || args.cotizacion_encabezado.tercero_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, tipo_tercero_id o tercero_id No Están Definidos', 404, {}));
        return;
    }
    
    if (args.cotizacion_encabezado.tipo_id_vendedor === undefined || args.cotizacion_encabezado.vendedor_id === undefined || args.cotizacion_encabezado.estado === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_vendedor, vendedor_id o estado No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_encabezado.empresa_id === '' || args.cotizacion_encabezado.tipo_id_tercero === '' || args.cotizacion_encabezado.tercero_id === '') {
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

    that.m_pedidos_clientes.insertar_cotizacion(empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones, function(err, pedido_cliente_id_tmp) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Inserción del Encabezado de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Inserción del Encabezado Cotización Exitosa', 200, {resultado_consulta: pedido_cliente_id_tmp}));

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

PedidosCliente.prototype.insertarDetalleCotizacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.cotizacion_detalle === undefined || args.cotizacion_detalle.pedido_cliente_id_tmp === undefined || args.cotizacion_detalle.codigo_producto === undefined || args.cotizacion_detalle.porc_iva === undefined) {
        res.send(G.utils.r(req.url, 'pedido_cliente_id_tmp, codigo_producto o porc_iva No Están Definidos', 404, {}));
        return;
    }
    
    if (args.cotizacion_detalle.numero_unidades === undefined || args.cotizacion_detalle.valor_unitario === undefined) {
        res.send(G.utils.r(req.url, 'numero_unidades o valor_unitario No Están Definidos', 404, {}));
        return;
    }

    if (args.cotizacion_detalle.pedido_cliente_id_tmp === '' || args.cotizacion_detalle.codigo_producto === '' || args.cotizacion_detalle.porc_iva === '') {
        res.send(G.utils.r(req.url, 'pedido_cliente_id_tmp, codigo_producto o porc_iva Están Vacios', 404, {}));
        return;
    }
    
    if (args.cotizacion_detalle.numero_unidades === '' || args.cotizacion_detalle.valor_unitario === '') {
        res.send(G.utils.r(req.url, 'numero_unidades o valor_unitario Están Vacios', 404, {}));
        return;
    }

    //Parámetros a insertar
    var pedido_cliente_id_tmp = args.cotizacion_detalle.pedido_cliente_id_tmp;
    var codigo_producto = args.cotizacion_detalle.codigo_producto;
    var porc_iva = args.cotizacion_detalle.porc_iva;
    var numero_unidades = args.cotizacion_detalle.numero_unidades;
    var valor_unitario = args.cotizacion_detalle.valor_unitario;
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_clientes.insertar_detalle_cotizacion(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, function(err, pedido_cliente_id_tmp) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Inserción del Detalle de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Inserción del Detalle Cotización Exitosa', 200, {}));

    });
 
};

PedidosCliente.prototype.listarCotizaciones = function(req, res) {

    var that = this;

    var args = req.body.data;
    
    //cotizaciones_cliente

    if (args.cotizaciones_cliente === undefined || args.cotizaciones_cliente.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id No Está Definido', 404, {}));
        return;
    }
    
    if (args.cotizaciones_cliente.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id Está Vacio', 404, {}));
        return;
    }

    //Parámetros a insertar
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

    //Parámetro a insertar
    var numero_cotizacion = args.estado_cotizacion.numero_cotizacion;

    that.m_pedidos_clientes.estado_cotizacion(numero_cotizacion, function(err, array_estado_cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta Estado de Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Estado Cotización Exitosa', 200, {resultado_consulta: array_estado_cotizacion}));

    });
 
};

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

    //Parámetro a insertar
    var numero_cotizacion = args.detalle_cotizacion.numero_cotizacion;

    that.m_pedidos_clientes.listar_detalle_cotizacion(numero_cotizacion, function(err, detalle_cotizacion) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Consulta Detalle Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta Detalle Cotización Exitosa', 200, {resultado_consulta: detalle_cotizacion}));

    });
 
};

//eliminar_registro_detalle_cotizacion

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

    //Parámetro a insertar
    var numero_cotizacion = args.eliminar_detalle_cotizacion.numero_cotizacion;
    var codigo_producto = args.eliminar_detalle_cotizacion.codigo_producto;

    that.m_pedidos_clientes.eliminar_registro_detalle_cotizacion(numero_cotizacion, codigo_producto, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en Eliminación Registro Detalle Cotización', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Eliminación Registro Detalle Cotización Exitoso', 200, {}));

    });
 
};

//cotizacionEsPedido
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

    //Parámetro a insertar
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

PedidosCliente.$inject = ["m_pedidos_clientes", "e_pedidos_clientes", "m_productos", "m_pedidos"];

module.exports = PedidosCliente;
