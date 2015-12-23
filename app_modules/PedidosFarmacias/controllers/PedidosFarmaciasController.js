
var PedidosFarmacias = function(pedidos_farmacias, eventos_pedidos_farmacias, productos, pedidos_clientes, m_pedidos, terceros, emails) {


    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;
    this.m_productos = productos;
    this.m_pedidos = m_pedidos;
    this.m_terceros = terceros;
    this.emails = emails;


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
    var permisos_kardex = false;
    var args = req.body.data;

    if (args.pedidos_farmacias && args.pedidos_farmacias.permisos_kardex) {
        permisos_kardex = true;
    }

    that.m_pedidos_farmacias.listar_farmacias_usuario('1', usuario_id, null, null, permisos_kardex, function(err, lista_farmacias) {
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

    var permisos_kardex = false;

    if (args.pedidos_farmacias.permisos_kardex) {
        permisos_kardex = true;
    }


    that.m_pedidos_farmacias.listar_farmacias_usuario('2', usuario_id, empresa_id, null, permisos_kardex, function(err, lista_centros_utilidad) {
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

    var permisos_kardex = false;

    if (args.pedidos_farmacias.permisos_kardex) {
        permisos_kardex = true;
    }


    that.m_pedidos_farmacias.listar_farmacias_usuario('3', usuario, empresa_id, centro_utilidad_id, permisos_kardex, function(err, lista_bodegas) {
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

    G.Q.nfcall(this.m_pedidos_farmacias.listar_pedidos_temporales_farmacias, empresa_id, termino_busqueda, pagina_actual, usuario).
    then(function(lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Temporales Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    }).
    fail(function(err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, "Se ha generado un error", 500, {pedidos_farmacias: []}));
    }).
    done();

};


PedidosFarmacias.prototype.eliminarProductoDetallePedido = function(req, res) {

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
    var usuario = req.session.user.usuario_id;


    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {

            if (cabecera_pedido[0].estado_actual_pedido === '0' || cabecera_pedido[0].estado_actual_pedido === null) {

                that.m_pedidos_farmacias.eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario, function(err, rows) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'No se pudo eliminar el producto', 500, {error: err}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Eliminación del producto exitosa', 200, {}));
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'El estado actual del pedido no permite modificarlo', 403, {}));
                return;
            }

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

                        if (responsables_pedido === undefined || responsables_pedido.length < 2) {
                            res.send(G.utils.r(req.url, 'El Pedido no ha registrado responsables', 500, {}));
                            return;
                        }

                        that.m_pedidos_farmacias.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {

                                // El estado del pedido es el inmediatamnte el anterior
                                estado_pedido = responsables_pedido[1].estado;

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

            console.log("Pedido ====>>>>", pedido)
            // Calcular el tiempo de separacion del pedido
            var fecha_separacion = 0;
            var tiempo_separacion = 0;

            if (pedido.fecha_separacion_pedido) {
                fecha_separacion = new Date(pedido.fecha_separacion_pedido);
                tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);
            }

            pedido.tiempo_separacion = tiempo_separacion;

            that.m_pedidos_farmacias.consultar_detalle_pedido(pedido.numero_pedido, function(err, detalle_pedido) {

                detalle_pedido = that.m_pedidos.unificarLotesDetalle(detalle_pedido);
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


PedidosFarmacias.prototype.obtenerDetallePedido = function(req, res) {
    var self = this;

    var args = req.body.data;
    var numero_pedido = args.pedidos_farmacias.numero_pedido;

    if (args.pedidos_farmacias === undefined || numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    self.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {
        detalle_pedido = self.m_pedidos.unificarLotesDetalle(detalle_pedido);

        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {lista_productos: detalle_pedido}));

    });

};


// *******************nuevo Eduar Garcia temporal farmacias  *************

/*
 * @Author: Eduar
 * +Descripcion: Permite buscar los productos en la empresa origen, ademas de verificar si estan presentes en la farmacia destino
 */
PedidosFarmacias.prototype.buscarProductos = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.productos === undefined || args.productos.filtro === undefined || args.productos.pagina_actual === undefined
            || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined
            || args.productos.empresa_destino_id === undefined || args.productos.centro_utilidad_destino_id === undefined || args.productos.bodega_destino_id === undefined
            ) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, filtro o  pagina_actual no estan definidos', 404, {}));
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

    var filtro = args.productos.filtro;


    if (filtro.tipo_producto === undefined) {
        filtro.tipo_producto = '0';
    }

    that.m_pedidos_farmacias.listarProductos(empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id,
            pagina_actual, filtro, function(err, productos) {
        if (err) {
            res.send(G.utils.r(req.url, 'Se ha generado un error', 500, {lista_productos: []}));
            return;
        }

        var i = productos.length;

        if (i === 0) {
            res.send(G.utils.r(req.url, 'Lista de productos vacía', 200, {lista_productos: []}));
            return;
        }
        /*res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: productos}));
         return;*/
        productos.forEach(function(producto) {
            __consultarStockProducto(that, empresa_destino_id, producto, function(err, _producto) {

                producto = _producto;

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta de Productos', 500, {}));
                    return;
                }

                if (--i === 0) {
                    res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: productos}));
                    return;
                }

            });
        });

    });
};

/*
 * @Author: Eduar
 * +Descripcion: Permite consultar el encabezado del pedido temporal
 */
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

/*
 * @Author: Eduar
 * +Descripcion: Permite traer los productos del temporal
 */
PedidosFarmacias.prototype.listarProductosDetalleTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.farmaciaDestino === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    var farmaciaDestino = args.pedidos_farmacias.farmaciaDestino;

    if (farmaciaDestino.codigo === '' || farmaciaDestino.centroUtilidad.codigo === '' ||
            farmaciaDestino.centroUtilidad.bodega.codigo === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }


    var empresa_id = farmaciaDestino.codigo;
    var centro_utilidad_id = farmaciaDestino.centroUtilidad.codigo;
    var bodega_id = farmaciaDestino.centroUtilidad.bodega.codigo;

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

/*
 * @Author: Eduar
 * +Descripcion: Permite guardar el encabezado del pedido temporal
 */
PedidosFarmacias.prototype.guardarPedidoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;


    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.farmaciaDestino === undefined || args.pedidos_farmacias.farmaciaOrigen === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }
    var farmaciaDestino = args.pedidos_farmacias.farmaciaDestino;
    var farmaciaOrigen = args.pedidos_farmacias.farmaciaOrigen;

    if (farmaciaDestino.codigo === undefined || farmaciaDestino.centroUtilidad.codigo === undefined ||
            farmaciaDestino.centroUtilidad.bodega.codigo === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id  destino no estan definidos', 404, {}));
        return;
    }

    if (farmaciaOrigen.codigo === undefined || farmaciaOrigen.centroUtilidad.codigo === undefined ||
            farmaciaOrigen.centroUtilidad.bodega.codigo === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id  origen no estan definidos', 404, {}));
        return;
    }

    var empresa_destino_id = farmaciaDestino.codigo;
    var centro_utilidad_destino_id = farmaciaDestino.centroUtilidad.codigo;
    var bodega_destino_id = farmaciaDestino.centroUtilidad.bodega.codigo;

    var empresa_origen_id = farmaciaOrigen.codigo;
    var centro_utilidad_origen_id = farmaciaOrigen.centroUtilidad.codigo;
    var bodega_origen_id = farmaciaOrigen.centroUtilidad.bodega.codigo;
    var observacion = args.pedidos_farmacias.observacion;
    var usuario_id = req.session.user.usuario_id;


    that.m_pedidos_farmacias.guardarEncabezadoTemporal(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id,
            empresa_origen_id, centro_utilidad_origen_id, bodega_origen_id, observacion, usuario_id, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la actualización', 500, {error: err}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'El pedido temporal fue modificado', 200, {registros: rows}));
            return;
        }

    });
};

/*
 * @Author: Eduar
 * +Descripcion: Ingresa un producto en el pedido temporal
 */

PedidosFarmacias.prototype.ingresarDetallePedidoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.farmaciaDestino === undefined || args.pedidos_farmacias.producto === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id  o producto no estan definidos', 404, {}));
        return;
    }

    var farmaciaDestino = args.pedidos_farmacias.farmaciaDestino;
    var producto = args.pedidos_farmacias.producto;

    if (farmaciaDestino.codigo === undefined || farmaciaDestino.centroUtilidad.codigo === undefined ||
            farmaciaDestino.centroUtilidad.bodega.codigo === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (farmaciaDestino.codigo === '' || farmaciaDestino.centroUtilidad.codigo === '' ||
            farmaciaDestino.centroUtilidad.bodega.codigo === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }


    if (producto.tipoProductoId === undefined || producto.cantidadPendiente === undefined) {
        res.send(G.utils.r(req.url, 'tipo_producto o cantidad_pendiente no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === undefined || args.pedidos_farmacias.numero_pedido === '') {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }

    if (producto.codigo_producto === '' || producto.cantidadSolicitada === '' || producto.tipoProductoId === '') {
        res.send(G.utils.r(req.url, 'codigo_producto, cantidad_solic o tipo_producto están vacios', 404, {}));
        return;
    }

    if (producto.cantidadPendiente === '') {
        res.send(G.utils.r(req.url, 'cantidad_pendiente está vacia', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;

    var empresa_id = farmaciaDestino.codigo;
    var centro_utilidad_id = farmaciaDestino.centroUtilidad.codigo;
    var bodega_id = farmaciaDestino.centroUtilidad.bodega.codigo;

    var codigo_producto = producto.codigo_producto;
    var cantidadSolicitada = producto.cantidadSolicitada;

    var usuario_id = req.session.user.usuario_id;

    var tipo_producto_id = producto.tipoProductoId;

    var cantidad_pendiente = producto.cantidadPendiente;


    that.m_pedidos_farmacias.insertar_detalle_pedido_farmacia_temporal(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidadSolicitada, tipo_producto_id, cantidad_pendiente, usuario_id, function(err, rows, result) {

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

/*
 * @Author: Eduar
 * +Descripcion: Permite buscar si algun usuario a guardado un producto en un temporal
 */
PedidosFarmacias.prototype.buscarUsuarioBloqueo = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.usuario_bloqueo === undefined || args.usuario_bloqueo.farmacia_id === undefined || args.usuario_bloqueo.centro_utilidad_id === undefined
            || args.usuario_bloqueo.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'farmacia_id, centro_utilidad_id o codigo_producto no están definidos', 404, {}));
        return;
    }

    if (args.usuario_bloqueo.farmacia_id === '' || args.usuario_bloqueo.centro_utilidad_id === '' || args.usuario_bloqueo.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'farmacia_id, centro_utilidad_id o codigo_producto están vacios', 404, {}));
        return;
    }

    var farmacia_id = args.usuario_bloqueo.farmacia_id;
    var centro_utilidad_id = args.usuario_bloqueo.centro_utilidad_id;
    var codigo_producto = args.usuario_bloqueo.codigo_producto;
    var codigo_temporal = farmacia_id + centro_utilidad_id + codigo_producto;

    that.m_pedidos_farmacias.buscar_usuario_bloqueo(codigo_temporal, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta del usuario', 500, {error: err}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Consulta del usuario exitosa!', 200, {datos_usuario: rows}));
            return;
        }
    });

};

/*
 * @Author: Eduar
 * +Descripcion: Gestiona la generacion del pedido, asigna el responsable y cambia el estado del pedido
 */
PedidosFarmacias.prototype.generarPedidoFarmacia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.centro_utilidad_id === undefined || args.pedidos_farmacias.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.tipo_pedido === undefined) {
        res.send(G.utils.r(req.url, 'tipo_pedido no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === '' || args.pedidos_farmacias.centro_utilidad_id === '' || args.pedidos_farmacias.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.tipo_pedido === '') {
        res.send(G.utils.r(req.url, 'tipo_pedido está vacio', 404, {}));
        return;
    }

    var empresa_id = args.pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.pedidos_farmacias.bodega_id;
    var usuario_id = req.session.user.usuario_id;
    var observacion = args.pedidos_farmacias.observacion;
    var tipo_pedido = args.pedidos_farmacias.tipo_pedido;

    that.m_pedidos_farmacias.insertarPedidoFarmacia(empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido, function(err, id_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en el almacenamiento del Encabezado', 500, {error: err}));
            return;
        } else {

            var numero_pedido = id_pedido[0].solicitud_prod_a_bod_ppal_id;

            var responsable = null;//operario_array[0].operario_id;

            that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, '0', responsable, usuario_id, function(err, rows, responsable_estado_pedido) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                    return;
                }

                /*Inicio - Actualización sw_terminado*/
                that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, ['0'], '1', function(err, rows, results) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                        return;
                    }

                    that.m_pedidos_farmacias.insertarDetallePedidoFarmacia(numero_pedido, empresa_id, centro_utilidad_id,
                            bodega_id, usuario_id, function(err, row) {

                        that.m_pedidos_farmacias.eliminar_detalle_temporal_completo(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err) {
                            if (err) {
                                res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                                return;
                            }

                            that.m_pedidos_farmacias.eliminar_registro_encabezado_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err) {
                                if (err) {
                                    res.send(G.utils.r(req.url, 'Error Finalizando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
                                    return;
                                }

                                res.send(G.utils.r(req.url, 'Encabezado del pedido almacenado exitosamente', 200, {numero_pedido: numero_pedido}));
                                return;
                            });
                        });

                    });


                });

            });

        }

    });
};


/*
 * @Author: Eduar
 * +Descripcion: Permite modificar la cantidad pendiente del ultimo producto de un pedido, para liberar la cantidad reservada
 */
PedidosFarmacias.prototype.anularPendienteProducto = function(req, res){
    var that = this;

    var args = req.body.data;

    if (!args.pedidos_farmacias || !args.pedidos_farmacias.numero_pedido || !args.pedidos_farmacias.codigo_producto) {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo de producto no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "" || args.pedidos_farmacias.codigo_producto === "") {
        res.send(G.utils.r(req.url, 'numero_pedido o codigo de producto está vacio', 404, {}));
        return;
    }
    
    var numeroPedido = args.pedidos_farmacias.numero_pedido;
    var codigoProducto = args.pedidos_farmacias.codigo_producto;
    
    G.Q.ninvoke(that.m_pedidos_farmacias,'consultar_pedido', numeroPedido).
    then(function(cabeceraPedido) {

        if (cabeceraPedido[0].estado_actual_pedido === '0' || cabeceraPedido[0].estado_actual_pedido === null) {
            return G.Q.ninvoke(that.m_pedidos_farmacias, 'consultar_detalle_pedido', numeroPedido);
        } else {
            throw {msj:"El estado actual del pedido no permite modificarlo", codigo:403};
        }
        
    }).then(function(productos){
       if(productos.length > 1){
           throw {msj:"Solo se puede cambiar la cantidad pendiente al ultimo producto", codigo:403};
       } else {
           return G.Q.ninvoke(that.m_pedidos_farmacias, 'anularCantidadPendienteProducto', {numeroPedido: numeroPedido, codigoProducto:codigoProducto});
       }
       
    }).then(function(){
         res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200,  {pedidos_farmacias: []}));
        
    }).fail(function(err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, err.msj, err.codigo, {pedidos_farmacias: []}));
    }).
    done();
    
       
    
};


PedidosFarmacias.prototype.consultarEncabezadoPedido = function(req, res) {

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

    this.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta de pedido satisfactoria', 200, {encabezado_pedido: cabecera_pedido}));
        }

    });

};

PedidosFarmacias.prototype.consultarDetallePedido = function(req, res) {

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

    this.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, filas_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta detalle del pedido', 500, {detalle_pedido: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta detalle del pedido satisfactoria', 200, {detalle_pedido: filas_pedido}));
        }

    });

};


/*
 * @Author: Eduar
 * +Descripcion: Elimina un producto del pedido temporal
 */
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
        } else {
            res.send(G.utils.r(req.url, 'Eliminación Exitosa!', 200, {}));
            return;
        }
    });

};

/*
 * @Author: Eduar
 * +Descripcion: Elimina el encabezado y el detalle del pedido
 */
PedidosFarmacias.prototype.eliminarPedidoTemporal = function(req, res) {

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
        } else {
            that.m_pedidos_farmacias.eliminar_registro_encabezado_temporal(empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, rows) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
                    return;
                } else {
                    res.send(G.utils.r(req.url, 'Eliminación Exitosa!', 200, {}));
                    return;
                }

            });
        }
    });

};

/*
 * @Author: Eduar
 * +Descripcion: Se encarga de procesar el archivo plano
 */
PedidosFarmacias.prototype.subirArchivoPlano = function(req, res) {

    var that = this;

    var args = req.body.data;

    var session = req.body.session;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_destino_id === undefined || args.pedidos_farmacias.centro_utilidad_destino_id === undefined || args.pedidos_farmacias.bodega_destino_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_origen_id === undefined || args.pedidos_farmacias.centro_utilidad_origen_id === undefined || args.pedidos_farmacias.bodega_origen_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_origen_id, centro_utilidad_origen_id o bodega_origen_id no estan definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_destino_id === '' || args.pedidos_farmacias.centro_utilidad_destino_id === '' || args.pedidos_farmacias.bodega_destino_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id están vacios', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_origen_id === '' || args.pedidos_farmacias.centro_utilidad_origen_id === '' || args.pedidos_farmacias.bodega_origen_id === '') {
        res.send(G.utils.r(req.url, 'empresa_origen_id, centro_utilidad_origen_id o bodega_origen_id están vacios', 404, {}));
        return;
    }

    if (req.files === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere un archivo plano', 404, {}));
        return;
    }

    var empresa_destino_id = args.pedidos_farmacias.empresa_destino_id;
    var centro_utilidad_destino_id = args.pedidos_farmacias.centro_utilidad_destino_id;
    var bodega_destino_id = args.pedidos_farmacias.bodega_destino_id;

    var empresa_origen_id = args.pedidos_farmacias.empresa_origen_id;
    var centro_utilidad_origen_id = args.pedidos_farmacias.centro_utilidad_origen_id;
    var bodega_origen_id = args.pedidos_farmacias.bodega_origen_id;
    var tipoProducto = args.pedidos_farmacias.tipo_producto || undefined;
    args.pedidos_farmacias.usuario_id = req.session.user.usuario_id;
    args.pedidos_farmacias.observacion = "Archivo plano";
    var extension = args.pedidos_farmacias.extension;

    G.utils.subirArchivoPlano(req.files, ['codigo', 'cantidad'], function(error, contenido) {
        if (!error) {

            __validar_productos_archivo_plano(that, contenido, function(productosValidadosArchivo, productosInvalidosArchivo) {

                if (productosValidadosArchivo.length === 0) {
                    res.send(G.utils.r(req.url, 'Lista de Productos', 200,
                            {pedido_farmacia: {productosValidos: productosValidadosArchivo, productosInvalidos: productosInvalidosArchivo}}));
                    return;
                }

                //Se agrupa por tipo los productos para garantizar que el pedido sea de un solo tipo: Normales, Insumos, Alto costo etc
                __agruparProductosPorTipo(that, productosValidadosArchivo, function(productosAgrupados) {

                    that.m_pedidos_farmacias.obtenerCantidadProductosEnTemporal(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id,
                            req.session.user.usuario_id, function(err, resultado) {
                                
                        if(err) {
                            res.send(G.utils.r(req.url, 'Error validando el archivo plano', 500, {}));
                            return;
                        }
                        var cantidad = (resultado.length > 0) ? parseInt(resultado[0].cantidad_registros) : 0;
                        //Si hay un pedido temporal existente se toma el tipo de producto, de lo contrario se toma la primera agrupacion de tipos de productos del archivo
                        var _productosAgrupados = (!tipoProducto) ? productosAgrupados[Object.keys(productosAgrupados)[0]] : productosAgrupados[tipoProducto];
                        
                        if(!_productosAgrupados){
                            res.send(G.utils.r(req.url, 'El pedido debe ser del mismo tipo', 500, {}));
                            return;
                        }
                        
                        if ((cantidad + _productosAgrupados.length) > 25) {
                            res.send(G.utils.r(req.url, 'La cantidad de productos no puede ser mayor a 25', 401, {}));

                        } else {


                            __validarProductoArchivoPlano(that, args.pedidos_farmacias, _productosAgrupados, [], [], 0, function(err, productosValidados, productosInvalidos) {

                                if (err) {
                                    res.send(G.utils.r(req.url, 'Error validando el archivo plano', 500, {}));
                                    return;
                                }

                                productosInvalidos = productosInvalidos.concat(productosInvalidosArchivo);

                                res.send(G.utils.r(req.url, 'Listado de Productos', 200,
                                        {pedido_farmacia: {productosValidos: productosValidados, productosInvalidos: productosInvalidos}}

                                ));
                                    
                                return;
                            });
                        }
                    });

                });
            });
        } else {
            res.send(G.utils.r(req.url, 'Se ha generado error subiendo el archivo Plano. Revise el formato o encabezado!', 500, {}));
            return;
        }
    });
};

/*
 * @Author: Eduar
 * +Descripcion: Llama el metodo actualizar_cantidades_detalle_pedido del modelo para actualizar las cantidades de los productos en el pedido
 */
PedidosFarmacias.prototype.actualizarCantidadesDetallePedido = function(req, res) {

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
    var usuario = req.session.user.usuario_id;



    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {

            if (cabecera_pedido[0].estado_actual_pedido === '0' || cabecera_pedido[0].estado_actual_pedido === null) {

                that.m_pedidos_farmacias.actualizar_cantidades_detalle_pedido(numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente, usuario, function(err, rows) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error en la modificación de cantidades', 500, {error: err}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Cantidades modificadas satisfactoriamente', 200, {}));
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'El estado actual del pedido no permite modificarlo', 403, {}));
                return;
            }

        }

    });

};

/*
 * @Author: Eduar
 * +Descripcion: Llama los metodos del modelo m_pedidos_farmacias, que permite actualizar la farmacia destino del encabezado y el detalle, de igual forma la observacion
 */
PedidosFarmacias.prototype.actualizarPedido = function(req, res) {

    var that = this;

    var args = req.body.data;


    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.numero_pedido === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no está definido', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_destino === undefined || args.pedidos_farmacias.centro_utilidad_destino === undefined
            || args.pedidos_farmacias.bodega_destino === undefined) {

        res.send(G.utils.r(req.url, 'empresa_destino, centro_utilidad o bodega no están definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "") {
        res.send(G.utils.r(req.url, 'numero_pedido está vacio', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_destino === "" || args.pedidos_farmacias.centro_utilidad_destino === ""
            || args.pedidos_farmacias.bodega_destino === "") {

        res.send(G.utils.r(req.url, 'empresa_destino, centro_utilidad o bodega están vacios', 404, {}));
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;
    var farmacia_id = args.pedidos_farmacias.empresa_destino;
    var centro_utilidad = args.pedidos_farmacias.centro_utilidad_destino;
    var bodega = args.pedidos_farmacias.bodega_destino;
    var observacion = args.pedidos_farmacias.observacion;


    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {
            cabecera_pedido = cabecera_pedido[0];

            if (cabecera_pedido.estado_actual_pedido === '0' || cabecera_pedido.estado_actual_pedido === null) {
                // se valida si la empresa destino del request es diferente a la almacenada en el pedido
                if (cabecera_pedido.empresa_id !== farmacia_id || cabecera_pedido.centro_utilidad !== centro_utilidad || cabecera_pedido.bodega_id !== bodega) {

                    that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle) {

                        if (err) {
                            callback(err);
                            return;
                        }

                        var i = detalle.length;
                        var productosNoEncontrados = [];

                        //Antes de realizar la modificacion especial se debe validar que cada producto este en la empresa destino
                        detalle.forEach(function(detalle) {
                            __consultarStockProducto(that, farmacia_id, detalle, function(err, producto) {
                                if (!producto.en_farmacia_seleccionada) {
                                    productosNoEncontrados.push(detalle);
                                }

                                if (--i === 0) {
                                    if (productosNoEncontrados.length > 0) {
                                        res.send(G.utils.r(req.url, 'Algunos productos no estan presentes en la farmacia seleccionada', 200, {productosNoEncontrados: productosNoEncontrados}));
                                    } else {
                                        that.m_pedidos_farmacias.actualizar_encabezado_pedido(numero_pedido, farmacia_id, centro_utilidad, bodega, observacion, function(err, rows) {

                                            if (err) {
                                                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Actualización', 500, {error: err}));
                                                return;
                                            } else {
                                                that.m_pedidos_farmacias.actualizarDestinoDeProductos(numero_pedido, farmacia_id, centro_utilidad, bodega, function(err, rows) {
                                                    if (err) {
                                                        res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Actualización', 500, {error: err}));
                                                        return;
                                                    }

                                                    res.send(G.utils.r(req.url, 'Actualización exitosa!', 200, {productosNoEncontrados: []}));
                                                    return;
                                                });

                                            }
                                        });
                                    }
                                }

                            });

                        });

                    });
                } else {
                    that.m_pedidos_farmacias.actualizar_encabezado_pedido(numero_pedido, cabecera_pedido.empresa_id, cabecera_pedido.centro_utilidad,
                            cabecera_pedido.bodega_id, observacion, function(err, rows) {

                        if (err) {
                            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Actualización', 500, {error: err}));
                            return;
                        } else {
                            res.send(G.utils.r(req.url, 'Actualización exitosa, se ha cambiado la observacion!', 200, {productosNoEncontrados: []}));
                        }
                    });
                }



            } else {
                res.send(G.utils.r(req.url, 'El estado actual del pedido no permite modificarlo', 403, {}));
                return;
            }

        }

    });
};

/*
 * @Author: Eduar
 * +Descripcion: Permite insertar un producto en un pedido, se usa para la modificacion especial de los pedidos
 */
PedidosFarmacias.prototype.insertarDetallePedidoFarmacia = function(req, res) {

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

    that.m_pedidos_farmacias.insertarDetallePedidoFarmacia(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id, function(err, row) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en el almacenamiento del Detalle', 500, {error: err}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Detalle del pedido almacenado exitosamente', 200, {}));
            return;
        }
    });

};

/*
 * @Author: Eduar
 * +Descripcion: Permite generar el pdf de un pedido
 */
PedidosFarmacias.prototype.generarPdfPedido = function(req, res) {
    var that = this;

    var args = req.body.data;

    __generarReportePedido(that, req, args, function(err, nombrePdf) {
        if (err) {
            res.send(G.utils.r(req.url, err.msj, err.status, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombrePdf}}));

    });

};


PedidosFarmacias.prototype.enviarEmailPedido = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias.mensaje === undefined || args.pedidos_farmacias.destinatarios === undefined
            || args.pedidos_farmacias.asunto === undefined) {

        res.send(G.utils.r(req.url, 'Mensaje, destinatarios, asunto o nombre de adjunto no estan definidos', 404, {}));
        return;

    }

    var mensaje = args.pedidos_farmacias.mensaje;
    var destinatarios = args.pedidos_farmacias.destinatarios;
    var asunto = args.pedidos_farmacias.asunto;

    __generarReportePedido(that, req, args, function(err, nombrePdf) {
        if (err) {
            res.send(G.utils.r(req.url, err.msj, err.status, {}));
            return;
        }
        var path = G.dirname + "/public/reports/" + nombrePdf;
        var nombreAdjunto = args.pedidos_farmacias.nombreAdjunto || nombrePdf;
        __enviarCorreoElectronico(that, destinatarios, path, nombreAdjunto, asunto, mensaje, function(err) {
            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en el envio del pdf', 500, {error: err}));
                return;
            }
            res.send(G.utils.r(req.url, 'Url reporte pedido', 200, {reporte_pedido: {nombre_reporte: nombrePdf}}));
        });

    });

};

//************** fin nuevo eduar garcia temporal farmacias ***************


PedidosFarmacias.prototype.insertarProductoDetallePedidoFarmacia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.detalle_pedidos_farmacias === undefined || args.detalle_pedidos_farmacias.numero_pedido === undefined || args.detalle_pedidos_farmacias.empresa_id === undefined
            || args.detalle_pedidos_farmacias.centro_utilidad_id === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido, empresa_id o centro_utilidad_id no están definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.bodega_id === undefined || args.detalle_pedidos_farmacias.codigo_producto === undefined || args.detalle_pedidos_farmacias.cantidad_solic === undefined) {
        res.send(G.utils.r(req.url, 'bodega_id, codigo_producto o cantidad_solic no están definidos', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.tipo_producto_id === undefined || args.detalle_pedidos_farmacias.cantidad_pendiente === undefined) {
        res.send(G.utils.r(req.url, 'tipo_producto_id o cantidad_pendiente no están definidos', 404, {}));
        return;
    }
    /*--*/

    if (args.detalle_pedidos_farmacias.numero_pedido === '' || args.detalle_pedidos_farmacias.empresa_id === ''
            || args.detalle_pedidos_farmacias.centro_utilidad_id === '') {
        res.send(G.utils.r(req.url, 'numero_pedido, empresa_id o centro_utilidad_id están vacios', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.bodega_id === '' || args.detalle_pedidos_farmacias.codigo_producto === ''
            || args.detalle_pedidos_farmacias.cantidad_solic === '') {
        res.send(G.utils.r(req.url, 'bodega_id, codigo_producto o cantidad_solic están vacios', 404, {}));
        return;
    }

    if (args.detalle_pedidos_farmacias.tipo_producto_id === '' || args.detalle_pedidos_farmacias.cantidad_pendiente === '') {
        res.send(G.utils.r(req.url, 'tipo_producto_id o cantidad_pendiente están vacios', 404, {}));
        return;
    }

    /*--*/

    var numero_pedido = args.detalle_pedidos_farmacias.numero_pedido;
    var empresa_id = args.detalle_pedidos_farmacias.empresa_id;
    var centro_utilidad_id = args.detalle_pedidos_farmacias.centro_utilidad_id;
    var bodega_id = args.detalle_pedidos_farmacias.bodega_id;
    var codigo_producto = args.detalle_pedidos_farmacias.codigo_producto;
    var cantidad_solic = args.detalle_pedidos_farmacias.cantidad_solic;
    var tipo_producto_id = args.detalle_pedidos_farmacias.tipo_producto_id;
    var cantidad_pendiente = args.detalle_pedidos_farmacias.cantidad_pendiente;

    var usuario_id = req.session.user.usuario_id;


    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de pedido', 500, {encabezado_pedido: {}}));
        } else {

            if (cabecera_pedido[0].estado_actual_pedido === '0' || cabecera_pedido[0].estado_actual_pedido === null) {

                that.m_pedidos_farmacias.insertar_producto_detalle_pedido_farmacia(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto,
                        cantidad_solic, tipo_producto_id, usuario_id, cantidad_pendiente, function(err, row) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Se ha Generado un Error en el almacenamiento del Detalle', 500, {error: err}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Detalle del pedido almacenado exitosamente', 200, {}));
                        return;
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'El estado actual del pedido no permite modificarlo', 403, {}));
                return;
            }

        }

    });

};

PedidosFarmacias.prototype.actualizarEstadoActualPedido = function(req, res) {

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

    that.m_pedidos_farmacias.actualizar_en_uso_pedido(numero_pedido, estado, function(err, rows, result) {

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

//consultarProductoEnFarmacia
PedidosFarmacias.prototype.consultarProductoEnFarmacia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.productos_farmacias === undefined || args.productos_farmacias.empresa_id === undefined || args.productos_farmacias.centro_utilidad === undefined
            || args.productos_farmacias.bodega === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad o bodega no están definidos', 404, {}));
        return;
    }

    if (args.productos_farmacias.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'codigo_producto no está definido', 404, {}));
        return;
    }

    if (args.productos_farmacias.empresa_id === "" || args.productos_farmacias.centro_utilidad === ""
            || args.productos_farmacias.bodega === "") {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad o bodega están vacios', 404, {}));
        return;
    }

    if (args.productos_farmacias.codigo_producto === "") {
        res.send(G.utils.r(req.url, 'codigo_producto está vacio', 404, {}));
        return;
    }

    var empresa_id = args.productos_farmacias.empresa_id;
    var centro_utilidad = args.productos_farmacias.centro_utilidad;
    var bodega = args.productos_farmacias.bodega;
    var codigo_producto = args.productos_farmacias.codigo_producto;

    that.m_pedidos_farmacias.consultar_producto_en_farmacia(empresa_id, centro_utilidad, bodega, codigo_producto, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta', 500, {error: err}));
            return;
        }
        else
        {
            res.send(G.utils.r(req.url, 'Consulta exitosa!', 200, {resultado_consulta: rows}));
            return;
        }
    });

};

/*
 * @Author: Eduar
 * +Descripcion: Funcion recursiva que valida cada producto filtrado del archivo plano (Valida existencia en la farmacia destino) y guarda el temporal
 */
function __validarProductoArchivoPlano(that, datos, productosAgrupados, productosValidadosArchivo, productosInvalidosArchivo, index, callback) {

    var productoAgrupado = productosAgrupados[index];

    if (!productoAgrupado) {
        callback(false, productosValidadosArchivo, productosInvalidosArchivo);
        return;
    }

    var codigo_temporal = datos.empresa_destino_id + datos.centro_utilidad_destino_id + productoAgrupado.codigo_producto;

    //Verifica que el producto no este siendo usado por otro usuario
    that.m_pedidos_farmacias.buscar_usuario_bloqueo(codigo_temporal, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error en la consulta del usuario', 500, {error: err}));
            return;
        } else {
            if (rows.length > 0) {
                productoAgrupado.mensajeError = "Bloqueado por el usuario: " + rows[0].nombre;
                productoAgrupado.bloqueado = true;
                productosInvalidosArchivo.push(productoAgrupado);
                index++;
                __validarProductoArchivoPlano(that, datos, productosAgrupados, productosValidadosArchivo, productosInvalidosArchivo, index, callback);
                return;
            }

            var filtro = {
                tipo_busqueda: 2,
                tipo_producto: productoAgrupado.tipoProductoId,
                termino_busqueda: productoAgrupado.codigo_producto
            };

            that.m_pedidos_farmacias.listarProductos(datos.empresa_origen_id, datos.centro_utilidad_origen_id, datos.bodega_origen_id,
                    datos.empresa_destino_id, datos.centro_utilidad_destino_id, datos.bodega_destino_id,
                    1, filtro, function(err, productos) {

                var _producto = (productos.length > 0) ? productos[0] : null;

                if (!_producto || _producto.estado !== '1') {
                    productoAgrupado.mensajeError = "No esta habilitado en la farmacia origen";
                    productoAgrupado.enFarmaciaOrigen = false;
                    productosInvalidosArchivo.push(productoAgrupado);
                    index++;
                    __validarProductoArchivoPlano(that, datos, productosAgrupados, productosValidadosArchivo, productosInvalidosArchivo, index, callback);
                    return;
                }

                __consultarStockProducto(that, datos.empresa_destino_id, productoAgrupado, function(err, _productoStock) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    if (!_productoStock.en_farmacia_seleccionada) {
                        productoAgrupado.mensajeError = "No esta habilitado en la farmacia destino!!!!!!!";
                        productoAgrupado.en_farmacia_seleccionada = _productoStock.en_farmacia_seleccionada;
                        productosInvalidosArchivo.push(productoAgrupado);
                        index++;
                        __validarProductoArchivoPlano(that, datos, productosAgrupados, productosValidadosArchivo, productosInvalidosArchivo, index, callback);
                        return;
                    } else {

                        //Se guarda el encabezado del pedido en caso de no existir
                        that.m_pedidos_farmacias.guardarEncabezadoTemporal(datos.empresa_destino_id, datos.centro_utilidad_destino_id, datos.bodega_destino_id,
                                datos.empresa_origen_id, datos.centro_utilidad_origen_id, datos.bodega_origen_id, datos.observacion, datos.usuario_id, function(err, rows) {

                            if (err) {
                                callback(err);
                                return;
                            } else {

                                var numeroPedido = datos.empresa_destino_id + datos.centro_utilidad_destino_id + productoAgrupado.codigo_producto;
                                var cantidadPendiente = productoAgrupado.cantidad_solicitada - _producto.disponibilidad_bodega;
                                cantidadPendiente = (cantidadPendiente > 0) ? cantidadPendiente : 0;
                                productoAgrupado.cantidadPendiente = cantidadPendiente;
                                productoAgrupado.disponible = _producto.disponibilidad_bodega;
                                //Inserta el producto validado en el detalle del pedido
                                that.m_pedidos_farmacias.guardarDetalleTemporal(
                                        numeroPedido, datos.empresa_destino_id, datos.centro_utilidad_destino_id, datos.bodega_destino_id, productoAgrupado.                                             codigo_producto,productoAgrupado.cantidad_solicitada, productoAgrupado.tipoProductoId, cantidadPendiente, datos.usuario_id,
                                function(err, rows, result) {

                                    if (err) {
                                        callback(err);
                                        return;
                                    }

                                    productosValidadosArchivo.push(productoAgrupado);
                                    index++;

                                    var porcentaje = (index * 100) / productosAgrupados.length;

                                    that.e_pedidos_farmacias.onNotificarProgresoArchivoPlanoFarmacias(datos.usuario_id, porcentaje);
                                    __validarProductoArchivoPlano(that, datos, productosAgrupados, productosValidadosArchivo, productosInvalidosArchivo, index, callback);

                                });
                            }

                        });
                    }


                });


            });
        }
    });

}

/*
 * @Author: Eduar
 * +Descripcion: Agrupa los productos por su tipo, Normales, insumos, alto costo etc
 */
function __agruparProductosPorTipo(that, productos, callback) {

    var productosAgrupados = {};

    if (productos.length === 0) {
        callback(productosAgrupados);
        return;
    }

    productos.forEach(function(row) {
        if (productosAgrupados[row.tipoProductoId]) {
            productosAgrupados[row.tipoProductoId].push(row);
        } else {
            productosAgrupados[row.tipoProductoId] = [row];
        }
    });

    callback(productosAgrupados);
};



/*
 * @Author: Eduar
 * +Descripcion: Busca que los productos que se leen del archivo plano existan en el inventario
 * +Modificacion: Buscara los productos que se leene del archivo importador y se
 *                evaluara si es de un archivo .xlsx o .xls
 * @fecha: 30/10/2015
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

};


function _generarDocumentoPedido(obj, callback) {


    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/pedido.html', 'utf8'),
            //helpers: G.fs.readFileSync('app_modules/PedidosFarmacias/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: obj
    }, function(err, response) {

        response.body(function(body) {
            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function(err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });


        });


    });
};


/*
 * @Author: Eduar
 * +Descripcion: Funcion helper que consulta el stock de un producto en la farmacia destino
 */
function __consultarStockProducto(that, empresa_destino_id, producto, callback) {
    that.m_productos.consultar_stock_producto(empresa_destino_id, producto.codigo_producto, function(err, total_existencias_farmacias) {

        producto.total_existencias_farmacias = (total_existencias_farmacias.length > 0 && total_existencias_farmacias[0].existencia !== null) ? total_existencias_farmacias[0].existencia : 0;
        producto.en_farmacia_seleccionada = (total_existencias_farmacias.length > 0 && total_existencias_farmacias[0].existencia !== null) ? true : false;

        callback(err, producto);
    });
}

function __enviarCorreoElectronico(that, to, ruta_archivo, nombre_archivo, asunto, mensaje, callback) {

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
        subject: asunto,
        html: mensaje,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function(error, response) {
        if (error) {
            callback(true);
            return;
        } else {
            callback(false);
            smtpTransport.close();
            return;
        }
    });
}
;


function __generarReportePedido(that, req, args, callback) {
    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.farmaciaDestino === undefined || args.pedidos_farmacias.farmaciaOrigen === undefined ||
            args.pedidos_farmacias.numero_pedido === undefined) {

        callback({msj: 'empresa_id, centro_utilidad_id ,bodega_id o numero de pedido no estan definidos', status: 404});
        return;
    }
    var farmaciaDestino = args.pedidos_farmacias.farmaciaDestino;
    var farmaciaOrigen = args.pedidos_farmacias.farmaciaOrigen;

    if ((farmaciaDestino.codigo === undefined || farmaciaDestino.codigo === '') ||
            (farmaciaDestino.centroUtilidad.codigo === undefined || farmaciaDestino.centroUtilidad.codigo === '') ||
            (farmaciaDestino.centroUtilidad.bodega.codigo === undefined || farmaciaDestino.centroUtilidad.bodega.codigo === '')) {

        callback({msj: 'empresa_id, centro_utilidad_id o bodega_id  destino no estan definidos o estan vacios', status: 404});
        return;
    }

    if ((farmaciaOrigen.codigo === undefined || farmaciaOrigen.codigo === '') ||
            (farmaciaOrigen.centroUtilidad.codigo === undefined || farmaciaOrigen.centroUtilidad.codigo === '') ||
            (farmaciaOrigen.centroUtilidad.bodega.codigo === undefined || farmaciaOrigen.centroUtilidad.bodega.codigo === '')) {

        callback({msj: 'empresa_id, centro_utilidad_id o bodega_id  origen no estan definidos o estan vacios', status: 404});
        return;
    }

    if (args.pedidos_farmacias.numero_pedido === "") {
        callback({msj: 'numero_pedido está vacio', status: 404});
        return;
    }

    var numero_pedido = args.pedidos_farmacias.numero_pedido;

    var descripcionPedido = {
        empresa_origen: farmaciaOrigen.codigo,
        centro_utilidad_origen: farmaciaOrigen.centroUtilidad.codigo,
        bodega_origen: farmaciaOrigen.centroUtilidad.bodega.codigo,
        empresa_destino: farmaciaDestino.codigo,
        centro_utilidad_destino: farmaciaDestino.centroUtilidad.codigo,
        bodega_destino: farmaciaDestino.centroUtilidad.bodega.codigo,
        usuario_imprime: req.session.user.nombre_usuario,
        fecha_actual: new Date().toFormat('DD-MM-YYYY HH:MM')
    };

    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, cabecera_pedido) {

        if (err || cabecera_pedido.length === 0) {
            callback({msj: 'Error en consulta de pedido', status: 500});
        } else {
            cabecera_pedido = cabecera_pedido[0];
            that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, productos) {

                if (err || productos.length === 0) {
                    callback({msj: 'Error en consulta detalle del pedido', status: 500});
                } else {


                    var obj = {
                        encabezado_pedido_farmacia: cabecera_pedido,
                        detalle_pedido_farmacia: productos,
                        serverUrl: req.protocol + '://' + req.get('host') + "/",
                        descripcionPedido: descripcionPedido
                    };

                    //console.log("pedido ", obj);
                    _generarDocumentoPedido(obj, function(nombreTmp) {
                        callback(null, nombreTmp);
                    });
                }

            });
        }

    });
}

PedidosFarmacias.$inject = ["m_pedidos_farmacias", "e_pedidos_farmacias", "m_productos", "m_pedidos_clientes", "m_pedidos", "m_terceros", "emails"];

module.exports = PedidosFarmacias;