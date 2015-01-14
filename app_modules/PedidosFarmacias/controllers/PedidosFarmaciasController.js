
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

//Lista los Pedidos Temporales de Farmacias
PedidosFarmacias.prototype.listarPedidosTemporalesFarmacias = function(req, res) {

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
    
    var usuario = req.session.user.usuario_id;

    this.m_pedidos_farmacias.listar_pedidos_temporales_farmacias(empresa_id, termino_busqueda, pagina_actual, usuario, function(err, lista_pedidos_farmacias) {
        
        res.send(G.utils.r(req.url, 'Lista Pedidos Temporales Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });
};

PedidosFarmacias.prototype.consultarEncabezadoPedidoFinal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "") {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }


    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    
    this.m_pedidos_farmacias.consultar_encabezado_pedido_final(numero_pedido, function(err, cabecera_pedido) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta de pedido satisfactoria', 200, {encabezado_pedido: cabecera_pedido}));
        }
        
    });
    
};

PedidosFarmacias.prototype.consultarDetallePedidoFinal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "") {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }


    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    
    this.m_pedidos_farmacias.consultar_detalle_pedido_final(numero_pedido, function(err, filas_pedido) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta detalle del pedido', 500, {detalle_pedido: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta detalle del pedido satisfactoria', 200, {detalle_pedido: filas_pedido}));
        }
        
    });
    
};

PedidosFarmacias.prototype.actualizarCantidadesDetallePedidoFinal = function(req, res) {
    
    var that = this;
    
    var args = req.body.data;
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined || args.pedidos_farmacias.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o numero_detalle_pedido no están definidos', 404, {}));
        return;
    }
    
    if (args.pedidos_farmacias.cantidad_solicitada === undefined || args.pedidos_farmacias.cantidad_pendiente === undefined) {
        res.send(G.utils.r(req.url, 'cantidad_solicitada o cantidad_pendiente no están definidas', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "" || args.pedidos_farmacias.codigo_producto === "") {
        res.send(G.utils.r(req.url, 'numero_pedido o numero_detalle_pedido están vacios', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.cantidad_solicitada === "" || args.pedidos_farmacias.cantidad_pendiente === "") {
        res.send(G.utils.r(req.url, 'cantidad_solicitada o cantidad_pendiente están vacias', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    var codigo_producto = args.pedidos_farmacias.codigo_producto;
    var cantidad_solicitada = args.pedidos_farmacias.cantidad_solicitada;
    var cantidad_pendiente = args.pedidos_farmacias.cantidad_pendiente;
                
    //Se procede a modificar el archivo
    that.m_pedidos_farmacias.actualizar_cantidades_detalle_pedido_final(numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en la modificación de cantidades', 500, {error: err}));
            return;
        } else {    
            res.send(G.utils.r(req.url, 'Cantidades modificadas satisfactoriamente', 200, {}));
        }
    });
};

PedidosFarmacias.prototype.eliminarProductoDetallePedidoFinal = function(req, res) {
    
    var that = this;
    
    var args = req.body.data;
    //numero_pedido, id_detalle_pedido, cantidad_solicitada, cantidad_pendiente
    
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined || args.pedidos_farmacias.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o numero_detalle_pedido no están definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "" || args.pedidos_farmacias.codigo_producto === "") {
        res.send(G.utils.r(req.url, 'numero_pedido o numero_detalle_pedido están vacios', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    var codigo_producto = args.pedidos_farmacias.codigo_producto;

    //Se procede a eliminar el archivo
    that.m_pedidos_farmacias.eliminar_producto_detalle_pedido_final(numero_pedido, codigo_producto, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'No se pudo eliminar el producto', 500, {error: err}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Eliminación del producto exitosa', 200, {}));
        }
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


PedidosFarmacias.prototype.eliminarResponsablesPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido no esta definido.', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === '' || args.pedidos_farmacias.numero_pedido === 0) {
        res.send(G.utils.r(req.url, 'El numero_pedido no puede ser 0 o vacío', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    var estado_pedido = '0'; // 0 = No asignado

    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, pedido_cliente) {

        if (err || pedido_cliente.length === 0) {

        } else {
            var pedido = pedido_cliente[0];


            if ((pedido.estado_actual_pedido === '0' || pedido.estado_actual_pedido === '1') && pedido.estado_separacion === null) {

                that.m_pedidos_farmacias.obtener_responsables_del_pedido(numero_pedido, function(err, responsables_pedido) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 0', 500, {}));
                        return;
                    } else {

                        that.m_pedidos_farmacias.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
                                that.m_pedidos_farmacias.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function(err, rows, resultado) {

                                    if (err) {
                                        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 2', 500, {}));
                                        return;
                                    } else {

                                        // Notificando Pedidos Actualizados en Real Time
                                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                        // Notificar que al operario los pedidos  fueron reasignados o eliminados
                                        if (responsables_pedido.length > 0) {

                                            var responsable_estado_pedido = responsables_pedido[0];

                                            that.e_pedidos_farmacias.onNotificacionOperarioPedidosReasignados({numero_pedidos: [numero_pedido], responsable: responsable_estado_pedido.responsable_id});
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
        
        if(i === 0){
            res.send(G.utils.r(req.url, 'Lista de productos vacía', 200, {lista_productos: [] }));
            return;
        }

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

};

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
};

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

PedidosFarmacias.prototype.consultarPedidoFarmaciaTemporal = function(req, res) {

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

    that.m_pedidos_farmacias.consultar_pedido_farmacia_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, rows) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Consulta Exitosa!', 200, {encabezado_pedido: rows}));
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

PedidosFarmacias.prototype.eliminarDetalleTemporalCompleto = function(req, res) {

    var that = this;

    var args = req.body.data;  
    
    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined
        || args.detalle_pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.empresa_id === '' || args.detalle_pedidos_farmacias.centro_utilidad_id === '' || args.detalle_pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }
    
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;
    
    var usuario_id = req.session.user.usuario_id;  
    
    that.m_pedidos_farmacias.eliminar_detalle_temporal_completo(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, row) {
 
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
    //var en_uso = args.pedidos_farmacias.en_uso;

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

PedidosFarmacias.prototype.pedidoFarmaciaArchivoPlano = function(req, res) {

    var that = this;

    var args = req.body.data;
    var session = req.body.session;
    
    if (args.pedido_farmacia === undefined || args.pedido_farmacia.empresa_id === undefined || args.pedido_farmacia.centro_utilidad_id === undefined || args.pedido_farmacia.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }
    
    if (args.pedido_farmacia.empresa_para === undefined || args.pedido_farmacia.centro_utilidad_para === undefined || args.pedido_farmacia.bodega_para === undefined) {
        res.send(G.utils.r(req.url, 'empresa_para, centro_utilidad_para o bodega_para no estan definidos', 404, {}));
        return;
    }
    
    if (args.pedido_farmacia.empresa_id === '' || args.pedido_farmacia.centro_utilidad_id === '' || args.pedido_farmacia.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }    

    if (args.pedido_farmacia.empresa_para === '' || args.pedido_farmacia.centro_utilidad_para === '' || args.pedido_farmacia.bodega_para === '') {
        res.send(G.utils.r(req.url, 'empresa_para, centro_utilidad_para o bodega_para están vacios', 404, {}));
        return;
    }

    if (req.files === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere un archivo plano', 404, {}));
        return;
    }

    __subir_archivo_plano(req.files, function(continuar, contenido) {

        if (continuar) {
           
            var lista_productos = contenido[0].data;
           
            __validar_productos_archivo_plano(that, lista_productos, function(productos_validos, productos_invalidos) {

                if (productos_validos.length === 0) {
                    res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedido_farmacia: {productos_validos: productos_validos, productos_invalidos: productos_invalidos}}));
                    return;
                }
                
                var j = productos_validos.length;

                productos_validos.forEach(function(producto_valido) {

                    var empresa_id = args.pedido_farmacia.empresa_id;
                    var centro_utilidad_id = args.pedido_farmacia.centro_utilidad_id;
                    var bodega_id = args.pedido_farmacia.bodega_id;
                                
                    var empresa_para = args.pedido_farmacia.empresa_para;
                    var centro_utilidad_para = args.pedido_farmacia.centro_utilidad_para;
                    var bodega_para = args.pedido_farmacia.bodega_para;
                    
                    var numero_pedido = empresa_para.trim() + centro_utilidad_para.trim() + producto_valido.codigo_producto.trim();
                    
                    var usuario_id = session.usuario_id;

                    //Consultar tipo_producto_id y cantidad_pendiente
                    that.m_productos.buscar_productos(empresa_id, centro_utilidad_id, bodega_id, producto_valido.codigo_producto, 1, function(err, lista_productos) {

                        var i = lista_productos.length;

                        if(i === 0){
                            res.send(G.utils.r(req.url, 'Lista de productos vacía', 200, {lista_productos: [] }));
                            return;
                        }

                        lista_productos.forEach(function(producto) {

                            that.m_pedidos_farmacias.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_farmacias) {

                                var cantidad_total_pendiente_farmacias = (total_pendiente_farmacias.length > 0) ? total_pendiente_farmacias[0].cantidad_total_pendiente : 0;

                                that.m_pedidos_clientes.calcular_cantidad_total_pendiente_producto(empresa_id, producto.codigo_producto, function(err, total_pendiente_clientes) {

                                    var cantidad_total_pendiente_clientes = (total_pendiente_clientes.length > 0) ? total_pendiente_clientes[0].cantidad_total_pendiente : 0;

                                    var disponibilidad_bodega = producto.existencia - cantidad_total_pendiente_farmacias - cantidad_total_pendiente_clientes;

                                    producto.disponibilidad_bodega = (disponibilidad_bodega < 0)? 0 : disponibilidad_bodega;
                                    
                                    producto.cantidad_pendiente = parseInt(producto_valido.cantidad_solicitada) - producto.disponibilidad_bodega;
                                    
                                    that.m_pedidos_farmacias.insertar_detalle_pedido_farmacia_temporal(numero_pedido, empresa_para, centro_utilidad_para, bodega_para, producto_valido.codigo_producto, producto_valido.cantidad_solicitada,  producto.tipo_producto_id, producto.cantidad_pendiente, usuario_id, function(err, rows, result) {
                                        if(err) {
                                            productos_invalidos.push(producto);
                                        }
                                        if(--j === 0){  
                                            res.send(G.utils.r(req.url, 'Lista de Productos', 200, {pedido_farmacia_detalle: {productos_validos: productos_validos, productos_invalidos: productos_invalidos}}));
                                            return;
                                        }
                                        
                                    });

                                });
                            });

                        });     
                    });
                });
            });
        } else {
            // Error
            console.log('Se ha generado error subiendo el archivo Plano. Revise el formato!');   
        }
    });
};

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
};

function __validar_productos_archivo_plano(contexto, contenido_archivo_plano, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];
    var filas = [];


    contenido_archivo_plano.forEach(function(row) {
        filas.push(row);
    });


    var i = filas.length;

    filas.forEach(function(row) {
        var codigo_producto = row[0] || '';
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
};

PedidosFarmacias.prototype.actualizarEstadoActualPedido = function(req, res){
    
    var that = this;

    var args = req.body.data;
    
    if (args.pedido_farmacia === undefined || args.pedido_farmacia.numero_pedido === undefined || args.pedido_farmacia.estado === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido o estado no están definidos', 404, {}));
        return;
    }
    
    if (args.pedido_farmacia.numero_pedido === '' || args.pedido_farmacia.estado === '') {
        res.send(G.utils.r(req.url, 'numero_pedido o estado están vacios', 404, {}));
        return;
    }
    
    var numero_pedido = args.pedido_farmacia.numero_pedido;
    var estado = args.pedido_farmacia.estado;
    
    console.log(">>>>>>>>>>>>>>>>>>> Actualizando estado del pedido ... desde TABLET ...");
    console.log("Pedido: ", numero_pedido);
    console.log("Estado: ", estado);
    //return;
    
    that.m_pedidos_farmacias.actualizar_en_uso_pedido(numero_pedido, estado, function(err, rows, result){
        
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la actualización del Estado', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Estado actualizado exitosamente', 200, {}));
            return;
        }
        
    });
    
};

//Generar documento PDF - copia código Eduar
PedidosFarmacias.prototype.imprimirPedidoFarmacia = function(req, res){
    
    var that = this;

    var args = req.body.data;
    
    console.log(">>>>Antes del encabezado");

    if (args.encabezado_pedido_farmacia === undefined || args.encabezado_pedido_farmacia.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }
    
    if(args.encabezado_pedido_farmacia.empresa_origen === undefined || args.encabezado_pedido_farmacia.centro_utilidad_origen === undefined
        || args.encabezado_pedido_farmacia.bodega_origen === undefined){
    
        res.send(G.utils.r(req.url, 'empresa_origen, centro_utilidad_origen o bodega_origen no están definidos', 404, {}));
        return;        
    }
    
    if (args.encabezado_pedido_farmacia.empresa_destino === undefined || args.encabezado_pedido_farmacia.centro_utilidad_destino === undefined || args.encabezado_pedido_farmacia.bodega_destino === undefined) {
        res.send(G.utils.r(req.url, 'empresa_destino, centro_utilidad_destino o bodega_destino no están definidos', 404, {}));
        return;
    }
    
    if(args.encabezado_pedido_farmacia.fecha_registro === undefined){
        res.send(G.utils.r(req.url, 'fecha_registro no está definido', 404, {}));
        return;
    }
    
    if (args.encabezado_pedido_farmacia.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }
    
    if(args.encabezado_pedido_farmacia.empresa_origen === '' || args.encabezado_pedido_farmacia.centro_utilidad_origen === ''
        || args.encabezado_pedido_farmacia.bodega_origen === ''){
    
        res.send(G.utils.r(req.url, 'empresa_origen, centro_utilidad_origen o bodega_origen están vacios', 404, {}));
        return;        
    }
    
    if (args.encabezado_pedido_farmacia.empresa_destino === '' || args.encabezado_pedido_farmacia.centro_utilidad_destino === '' || args.encabezado_pedido_farmacia.bodega_destino === '') {
        res.send(G.utils.r(req.url, 'empresa_destino, centro_utilidad_destino o bodega_destino están vacios', 404, {}));
        return;
    }
    
    if(args.encabezado_pedido_farmacia.fecha_registro === ''){
        res.send(G.utils.r(req.url, 'fecha_registro está vacio', 404, {}));
        return;
    }    
    
    if(args.detalle_pedido_farmacia === undefined){
        res.send(G.utils.r(req.url, 'El detalle no está definido', 404, {}));
        return;        
    }
    else{
        args.detalle_pedido_farmacia.forEach(function(detalle){
            console.log(">>>>>>>>>>>>>>>Leyendo elementos detalle");
            if(detalle.codigo_producto === undefined || detalle.descripcion === undefined){
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion no están definidos', 404, {}));
                return;        
            }

            if(detalle.cantidad_solicitada === undefined || detalle.cantidad_pendiente === undefined){
                res.send(G.utils.r(req.url, 'cantidad_solicitada o cantidad_pendiente no están definidos', 404, {}));
                return;   
            }

            if(detalle.codigo_producto === '' || detalle.descripcion === ''){
                res.send(G.utils.r(req.url, 'codigo_producto o descripcion están vacios', 404, {}));
                return;        
            }

            if(detalle.cantidad_solicitada === '' || detalle.cantidad_pendiente === ''){
                res.send(G.utils.r(req.url, 'cantidad_solicitada o cantidad_pendiente están vacios', 404, {}));
                return;   
            }
            
        });
    }
        
    _generarDocumentoPedido(args, function(nombreTmp){
         res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombreTmp}}));
         return;
    });
    
};

function _generarDocumentoPedido(obj,callback){
     G.jsreport.reporter.render({
            template: { 
                content: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/pedido.html', 'utf8'),
                //helpers: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/javascripts/rotulos.js', 'utf8'),
                recipe: "phantom-pdf",
                engine:'jsrender'
            },
            data:obj
        }).then(function (response) {

            var name = response.result.path;
            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2,5)+ "_"+fecha.toFormat('DD-MM-YYYY')+".pdf";
            G.fs.copySync(name, G.dirname+"/public/reports/"+nombreTmp);

            callback(nombreTmp);
        });
};

PedidosFarmacias.$inject = ["m_pedidos_farmacias", "e_pedidos_farmacias", "m_productos", "m_pedidos_clientes"];

module.exports = PedidosFarmacias;