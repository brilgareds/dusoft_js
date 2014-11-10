
var PedidosFarmacias = function(pedidos_farmacias, eventos_pedidos_farmacias, productos, pedidos_clientes) {

    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;
    this.m_productos = productos;

};

/**
 * @api {post} /api/PedidosFarmacias/obtenerEmpresas Obtener Empresas 
 * @apiName Obtener Empresas
 * @apiGroup Pedidos Farmacias
 * @apiDescription Listas las empresas a las que el usuario autenticado tiene permiso para ver pedidos de farmacias
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiSuccessExample Ejemplo Válido del Request.
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 123456,
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : { }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosFarmacias/obtenerEmpresas',   
 *       msj : 'Lista de Empresas',
 *       status: '200',
 *       obj : {
 *                  empresas : [
 *                                  {
 *                                      empresa_id: '03',
 *                                      tipo_identificacion: 'NIT',
 *                                      identificacion: '830080649',
 *                                      razon_social: 'DUANA & CIA LTDA'.
 *                                  }
 *                  ]
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosFarmacias/obtenerEmpresas',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosFarmacias.prototype.obtenerEmpresas = function(req, res) {

    var that = this;

    var usuario = req.session.user.usuario_id;

    this.m_pedidos_farmacias.listar_empresas(usuario, function(err, lista_empresas) {
        res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
    });
};

PedidosFarmacias.prototype.listarFarmaciasUsuarios = function(req, res) {

    var that = this;

    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_farmacias.listar_farmacias_usuario('1', usuario_id, null, null, function(err, lista_farmacias) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado las farmacias', 500, {lista_farmacias: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Farmacias', 200, {lista_farmacias: lista_farmacias}));
        }
    });
};

PedidosFarmacias.prototype.listarCentrosUtilidadUsuarios = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'el empresa_id no esta definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '') {
        res.send(G.utils.r(req.url, 'el empresa_id esta vacio', 404, {}));
        return;
    }

    var usuario_id = req.session.user.usuario_id;
    var empresa_id = args.pedidos_farmacias.empresa_id;

    that.m_pedidos_farmacias.listar_farmacias_usuario('2', usuario_id, empresa_id, null, function(err, lista_centros_utilidad) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado las farmacias', 500, {lista_centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Farmacias', 200, {lista_centros_utilidad: lista_centros_utilidad}));
        }
    });
};

PedidosFarmacias.prototype.listarBodegasUsuarios = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined) {
        res.send(G.utils.r(req.url, 'el empresa_id o centro_utilidad_id no esta definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '') {
        res.send(G.utils.r(req.url, 'el empresa_id o centro_utilidad_id esta vacio', 404, {}));
        return;
    }

    var usuario = req.session.user.usuario_id;
    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;

    that.m_pedidos_farmacias.listar_farmacias_usuario('3', usuario, empresa_id, centro_utilidad_id, function(err, lista_bodegas) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado las farmacias', 500, {lista_bodegas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Farmacias', 200, {lista_bodegas: lista_bodegas}));
        }
    });
};

/**
 * @api {post} /api/PedidosFarmacias/listarPedidos Listar Pedidos
 * @apiName listaPedidos
 * @apiGroup Pedidos Farmacias
 * @apiDescription Proporciona un listado de Pedidos de Farmacia, permitiendo filtrar por los campos,
 * numero de pedido, empresa, bodega, usuario que realizo el pedido.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} usuario_id  Identificador del Usuario.
 * @apiParam {String} auth_token  Token de Autenticación, este define si el usuario esta autenticado o no.
 * @apiParam {Number} empresa_id ID de la empresa.
 * @apiParam {String} termino_busqueda Termino por el cual se desea filtrar los pedidos.
 * @apiParam {Number} pagina_actual Pagina Actual, Para la paginación de los datos.
 * @apiSuccessExample Ejemplo Válido del Request.
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 'jhon.doe',
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : {
 *              pedidos_farmacias : { 
 *                                  empresa_id:  '',
 *                                  termino_busqueda:  '',
 *                                  pagina_actual:  ''
 *                              }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosFarmacias/listarPedidos',   
 *       msj : 'Lista Pedidos Farmacias',
 *       status: '200',
 *       obj : {
 *                  pedidos_farmacias : [ 
 *                                           {  
 *                                              numero_pedido: 65774,
 *                                              farmacia_id: 'FD',
 *                                              empresa_id: 'FD',
 *                                              centro_utilidad: '18',
 *                                              bodega_id: '18',
 *                                              nombre_farmacia: 'FARMACIAS DUANA',
 *                                              nombre_bodega: 'POPAYAN',
 *                                              usuario_id: 1350,
 *                                              nombre_usuario: 'MAURICIO BARRIOS',
 *                                              estado_actual_pedido: '1',
 *                                              descripcion_estado_actual_pedido: 'Separado',
 *                                              fecha_registro: '2014-05-28T00:00:00.000Z'                                               
 *                                           }                                       
 *                                      ]
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosFarmacias/listarPedidos',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosFarmacias.prototype.listarPedidosFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.termino_busqueda === undefined || args.pedidos_farmacias.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === "" || args.pedidos_farmacias.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }


    var empresa_id = args.pedidos_farmacias.empresa_id;
    var termino_busqueda = args.pedidos_farmacias.termino_busqueda;
    var pagina_actual = args.pedidos_farmacias.pagina_actual;
    var filtro = args.pedidos_farmacias.filtro;

    this.m_pedidos_farmacias.listar_pedidos_farmacias(empresa_id, termino_busqueda, filtro, pagina_actual, function(err, lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });
};

/**
 * @api {post} /api/PedidosFarmacias/listaPedidosOperarioBodega Asignar Responsables 
 * @apiName Asignar Responsables.
 * @apiGroup Pedidos Farmacias
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
 *       service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   
 *       msj : 'Asignacion de Resposables',
 *       status: '200',
 *       obj : {
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosFarmacias.prototype.asignarResponsablesPedido = function(req, res) {

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

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows, responsable_estado_pedido) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

            if (--i === 0) {

                // Notificar que al operario los pedidos  fueron reasignados
                if (responsable_estado_pedido.length > 0) {

                    responsable_estado_pedido = responsable_estado_pedido[0];

                    if (responsable !== responsable_estado_pedido.responsable_id) {
                        that.e_pedidos_farmacias.onNotificacionOperarioPedidosReasignados({numero_pedidos: pedidos, responsable: responsable_estado_pedido.responsable_id});
                    }
                }
                // Notificar al operario, los pedidos Asignados en Real Time
                that.e_pedidos_farmacias.onNotificacionOperarioPedidosAsignados({numero_pedidos: pedidos, responsable: responsable});
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
            }
        });
    });
};

/**
 * @api {post} /api/PedidosFarmacias/listaPedidosOperarioBodega Listar Pedidos Operarios
 * @apiName listaPedidosOperarioBodega
 * @apiGroup Pedidos Farmacias
 * @apiDescription Proporciona una lista con todos los pedidos de farmacias asignados a un operario de bodega
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
 *              pedidos_farmacias : { 
 *                                  operario_id:  19,
 *                                  pagina_actual : 1,
 *                                  limite : 40
 *                              }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   
 *       msj : 'Lista Pedidos Farmacias',
 *       status: '200',
 *       obj : {
 *                  pedidos_farmacias : [ 
 *                                           {  
 *                                              numero_pedido: 65774,
 *                                              farmacia_id: 'FD',
 *                                              empresa_id: 'FD',
 *                                              centro_utilidad: '18',
 *                                              bodega_id: '18',
 *                                              nombre_farmacia: 'FARMACIAS DUANA',
 *                                              nombre_bodega: 'POPAYAN',
 *                                              usuario_id: 1350,
 *                                              nombre_usuario: 'MAURICIO BARRIOS',
 *                                              estado_actual: '1',
 *                                              descripcion_estado_actual_pedido: 'Separado',
 *                                              fecha_registro: '2014-05-28T00:00:00.000Z',
 *                                              responsable_id: 19,
 *                                              responsable_pedido: 'Ixon Eduardo Niño',
 *                                              fecha_asignacion_pedido: '2014-07-08T14:11:16.901Z' 
 *                                           }                                       
 *                                      ]
 *             }
 *     }
 * @apiErrorExample Respuesta-Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   
 *       msj : 'Mensaje Error',
 *       status: 404,
 *       obj : {},
 *     }  
 */

PedidosFarmacias.prototype.listaPedidosOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.operario_id === undefined || args.pedidos_farmacias.pagina_actual === undefined || args.pedidos_farmacias.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos_farmacias.operario_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id de un operario de bodega', 404, {}));
        return;
    }
    if (args.pedidos_farmacias.pagina_actual === '' || parseInt(args.pedidos_farmacias.pagina_actual) <= 0) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la pagina para traer registros', 404, {}));
        return;
    }


    var termino_busqueda = args.pedidos_farmacias.termino_busqueda;
    //var operario_bodega = args.pedidos_farmacias.operario_id;
    var operario_bodega = req.session.user.usuario_id;
    var pagina_actual = args.pedidos_farmacias.pagina_actual;
    var limite = args.pedidos_farmacias.limite;
    var filtro = args.pedidos_farmacias.filtro;
    var fecha_actual = new Date();

    this.m_pedidos_farmacias.listar_pedidos_del_operario(operario_bodega, termino_busqueda, filtro, pagina_actual, limite, function(err, lista_pedidos_farmacias, total_registros) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
            return;
        }

        var i = lista_pedidos_farmacias.length;

        lista_pedidos_farmacias.forEach(function(pedido) {

            // Calcular el tiempo de separacion del pedido
            var fecha_separacion = 0;
            var tiempo_separacion = 0;

            if (pedido.fecha_separacion_pedido) {
                fecha_separacion = new Date(pedido.fecha_separacion_pedido);
                tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);
            }

            pedido.tiempo_separacion = tiempo_separacion;

            that.m_pedidos_farmacias.consultar_detalle_pedido(pedido.numero_pedido, function(err, detalle_pedido) {
                pedido.lista_productos = detalle_pedido;

                if (--i === 0) {
                    res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias, total_registros: total_registros}));
                }

            });
        });

        if (lista_pedidos_farmacias.length === 0)
            res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias, total_registros: total_registros}));
    });

};

PedidosFarmacias.prototype.listar_productos = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.pagina_actual === undefined
        || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined
        || args.productos.empresa_destino_id === undefined || args.productos.centro_utilidad_destino_id === undefined || args.productos.bodega_destino_id === undefined
        ) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, termino_busqueda o  pagina_actual no estan definidos', 404, {}));
        return;
    }
     
    if (args.productos.empresa_id === '' || args.productos.centro_utilidad_id === '' || args.productos.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }
    
    if (args.productos.empresa_destino_id === '' || args.productos.centro_utilidad_destino_id === '' || args.productos.bodega_destino_id === '') {
        res.send(G.utils.r(req.url, 'empresa_destino_id, centro_utilidad_destino_id o bodega_destino_id estan vacíos', 404, {}));
        return;
    }
     
     if (args.productos.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var termino_busqueda = args.productos.termino_busqueda;
    var pagina_actual = args.productos.pagina_actual;
    
    var empresa_id = args.productos.empresa_id;
    var centro_utilidad_id = args.productos.centro_utilidad_id;
    var bodega_id = args.productos.bodega_id;

    var empresa_destino_id = args.productos.empresa_destino_id;
    var centro_utilidad_destino_id = args.productos.centro_utilidad_destino_id;
    var bodega_destino_id = args.productos.bodega_destino_id;


    that.m_productos.buscar_productos(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina_actual, function(err, lista_productos) {

        var i = lista_productos.length;

        lista_productos.forEach(function(producto) {

            that.m_productos.consultar_stock_producto(empresa_destino_id, producto.codigo_producto, function(err, total_existencias_farmacias) {

                producto.total_existencias_farmacias = (total_existencias_farmacias.length > 0 && total_existencias_farmacias[0].existencia != null) ? total_existencias_farmacias[0].existencia : 0;

                that.m_productos.buscar_productos(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, producto.codigo_producto, pagina_actual, function(err, existencias_farmacia) {


                    producto.existencias_farmacia = (existencias_farmacia.length > 0) ? existencias_farmacia[0].existencia : 0;


                    that.m_pedidos_farmacias.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_farmacias) {


                        var cantidad_total_pendiente_farmacias = (total_pendiente_farmacias.length > 0) ? total_pendiente_farmacias[0].cantidad_total_pendiente : 0;

                        that.m_pedidos_clientes.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_clientes) {

                            var cantidad_total_pendiente_clientes = (total_pendiente_clientes.length > 0) ? total_pendiente_clientes[0].cantidad_total_pendiente : 0;

                            var disponibilidad_bodega = producto.existencia - cantidad_total_pendiente_farmacias - cantidad_total_pendiente_clientes;

                            producto.disponibilidad_bodega = (disponibilidad_bodega < 0)? 0 : disponibilidad_bodega;


                            if (--i === 0) {
                                
                                if (err) {
                                    res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta de Productos', 500, {}));
                                    return;
                                }
                                else
                                {
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

PedidosFarmacias.prototype.listarProductosDetalleTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;  
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined
        || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === ''
        || args.pedidos_farmacias.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;

    var usuario_id = req.session.user.usuario_id;  
    
    that.m_pedidos_farmacias.listar_detalle_pedido_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, productos_temporales) {
 
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Consulta Exitosa!', 200, {listado_productos: productos_temporales}));
            return;
        }
    });    

}

PedidosFarmacias.prototype.existeRegistroEncabezadoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;    
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;
   
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_farmacias.existe_registro_encabezado_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, cantidad_registros) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Consulta Exitosa!', 200, {numero_registros: cantidad_registros}));
            return;
        }
        
    });    
}

PedidosFarmacias.prototype.existeRegistroDetalleTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;  
    
    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined
        || args.detalle_pedidos_farmacias.bodega_id === undefined || args.detalle_pedidos_farmacias.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto no estan definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.empresa_id === '' || args.detalle_pedidos_farmacias.centro_utilidad_id === '' || args.detalle_pedidos_farmacias.bodega_id === ''
        || args.detalle_pedidos_farmacias.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto están vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;
    
    var codigo_producto = args.detalle_pedidos_farmacias.codigo_producto;
    
    var usuario_id = req.session.user.usuario_id;  
    
    that.m_pedidos_farmacias.existe_registro_detalle_temporal(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, function(err, cantidad_registros) {
 
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Consulta Exitosa!', 200, {numero_registros: cantidad_registros}));
            return;
        }
    });    

}

PedidosFarmacias.prototype.crearPedidoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;
    

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_destino_id === undefined || args.pedidos_farmacias.centro_utilidad_destino_id === undefined || args.pedidos_farmacias.bodega_destino_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_destino_id, centro_utilidad_destino_id o  bodega_destino_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan vacios', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_destino_id === '' || args.pedidos_farmacias.centro_utilidad_destino_id === '' || args.pedidos_farmacias.bodega_destino_id === '') {
        res.send(G.utils.r(req.url, 'empresa_destino_id, centro_utilidad_destino_id o  bodega_destino_id no estan vacios', 404, {}));
        return;
    }

    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;
    var empresa_destino_id = args.pedidos_farmacias.empresa_destino_id;
    var centro_utilidad_destino_id = args.pedidos_farmacias.centro_utilidad_destino_id;
    var bodega_destino_id = args.pedidos_farmacias.bodega_destino_id;
    var observacion = args.pedidos_farmacias.observacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_farmacias.insertar_pedido_farmacia_temporal(empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, observacion, usuario_id, function(err, rows, result) {
        /*console.log(err);
        console.log(rows);
        console.log(result);*/
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Inserción del encabezado del pedido', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Inserción de encabezado del pedido Exitosa!', 200, {}));
            return;
        }
        
    });
};

PedidosFarmacias.prototype.ingresarDetallePedidoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;
    
    
    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined
        || args.detalle_pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.numero_pedido === undefined || args.detalle_pedidos_farmacias.codigo_producto === undefined
        || args.detalle_pedidos_farmacias.cantidad_solic === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido,  codigo_producto o cantidad_solic no estan definidos', 404, {}));
        return;
    }
    
    if (args.detalle_pedidos_farmacias.tipo_producto_id === undefined || args.detalle_pedidos_farmacias.cantidad_pendiente === undefined) {
        res.send(G.utils.r(req.url, 'tipo_producto o cantidad_pendiente no estan definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }
    
    if (args.detalle_pedidos_farmacias.empresa_id === '' || args.detalle_pedidos_farmacias.centro_utilidad_id === '' || args.detalle_pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o  bodega_id están vacios', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.codigo_producto === '' || args.detalle_pedidos_farmacias.cantidad_solic === '' || args.detalle_pedidos_farmacias.tipo_producto_id === '') {
        res.send(G.utils.r(req.url, 'codigo_producto, cantidad_solic o tipo_producto están vacios', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.cantidad_pendiente === '') {
        res.send(G.utils.r(req.url, 'cantidad_pendiente está vacia', 404, {}));
        return;
    }

    var numero_pedido = args.detalle_pedidos_farmacias.numero_pedido;
    
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;
    
    var codigo_producto = args.detalle_pedidos_farmacias.codigo_producto;
    var cantidad_solic = args.detalle_pedidos_farmacias.cantidad_solic;
    
    var usuario_id = req.session.user.usuario_id;  
    
    var tipo_producto_id = args.detalle_pedidos_farmacias.tipo_producto_id;

    var cantidad_pendiente = args.detalle_pedidos_farmacias.cantidad_pendiente;
    
    
    that.m_pedidos_farmacias.insertar_detalle_pedido_farmacia_temporal(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solic, tipo_producto_id, cantidad_pendiente, usuario_id, function(err, rows, result) {
       /* console.log(err);
        console.log(rows);
        console.log(result);*/
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Inserción del detalle del pedido', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Inserción de detalle del pedido Exitosa!', 200, {}));
            return;
        }
    });    

};

PedidosFarmacias.prototype.eliminarRegistroEncabezadoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;    
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;
   
    var usuario_id = req.session.user.usuario_id;

    that.m_pedidos_farmacias.eliminar_registro_encabezado_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, rows) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Eliminación Exitosa!', 200, {}));
            return;
        }
        
    });    
};

PedidosFarmacias.prototype.eliminarRegistroDetalleTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;  
    
    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined
        || args.detalle_pedidos_farmacias.bodega_id === undefined || args.detalle_pedidos_farmacias.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto no estan definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.empresa_id === '' || args.detalle_pedidos_farmacias.centro_utilidad_id === '' || args.detalle_pedidos_farmacias.bodega_id === ''
        || args.detalle_pedidos_farmacias.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto están vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;
    
    var codigo_producto = args.detalle_pedidos_farmacias.codigo_producto;
    
    var usuario_id = req.session.user.usuario_id;  
    
    that.m_pedidos_farmacias.eliminar_registro_detalle_temporal(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, function(err, row) {
 
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Eliminación Exitosa!', 200, {}));
            return;
        }
    });    

};

PedidosFarmacias.prototype.insertarPedidoFarmaciaDefinitivo = function(req, res) {

    var that = this;
    
    var args = req.body.data;    
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }
    
    if (args.pedidos_farmacias.tipo_pedido === undefined){
        res.send(G.utils.r(req.url, 'tipo_pedido no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }
    
    if (args.pedidos_farmacias.tipo_pedido === ''){
        res.send(G.utils.r(req.url, 'tipo_pedido está vacio', 404, {}));
        return;
    }
    
    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;
   
    var usuario_id = req.session.user.usuario_id;
    
    var observacion = args.pedidos_farmacias.observacion;
            
    var tipo_pedido = args.pedidos_farmacias.tipo_pedido;

    that.m_pedidos_farmacias.insertar_pedido_farmacia_definitivo(empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido, function(err, id_pedido) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en el almacenamiento del Encabezado', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Encabezado del pedido almacenado exitosamente', 200, {numero_pedido: id_pedido}));
            return;
        }
        
    });    
};

PedidosFarmacias.prototype.insertarDetallePedidoFarmaciaDefinitivo = function(req, res) {

    var that = this;
    
    //numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id

    var args = req.body.data;
    
    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined
        || args.detalle_pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto no están definidos', 404, {}));
        return;
    }
    
    if (args.detalle_pedidos_farmacias.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.empresa_id === '' || args.detalle_pedidos_farmacias.centro_utilidad_id === '' || args.detalle_pedidos_farmacias.bodega_id === ''
        || args.detalle_pedidos_farmacias.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id o codigo_producto están vacios', 404, {}));
        return;
    }
    
    if (args.detalle_pedidos_farmacias.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }
    
    var numero_pedido = args.detalle_pedidos_farmacias.numero_pedido;
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;

    var usuario_id = req.session.user.usuario_id;
    
    that.m_pedidos_farmacias.insertar_detalle_pedido_farmacia_definitivo(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, row) {
 
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en el almacenamiento del Detalle', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Detalle del pedido almacenado exitosamente', 200, {}));
            return;
        }
    });    

};

PedidosFarmacias.$inject = ["m_pedidos_farmacias", "e_pedidos_farmacias", "m_productos", "m_pedidos_clientes"];

module.exports = PedidosFarmacias;