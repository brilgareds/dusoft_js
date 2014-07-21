
var PedidosFarmacias = function(pedidos_farmacias, eventos_pedidos_farmacias) {

    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

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

    this.m_pedidos_farmacias.listar_pedidos_farmacias(empresa_id, termino_busqueda, pagina_actual, function(err, lista_pedidos_farmacias) {
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

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            // Notificar al operario, los pedidos Asignados en Real Time
            that.e_pedidos_farmacias.onNotificacionOperarioPedidosAsignados({numero_pedido: numero_pedido, responsable: responsable});

            if (--i === 0) {
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
 * @apiSuccessExample Ejemplo Válido del Request.
 *     HTTP/1.1 200 OK
 *     {  
 *          session: {              
 *              usuario_id: 'jhon.doe',
 *              auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'
 *          },
 *          data : {
 *              pedidos_farmacias : { 
 *                                  operario_id:  19
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

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.operario_id === undefined || args.pedidos_farmacias.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos_farmacias.operario_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id de un operario de bodega', 404, {}));
        return;
    }
    if (args.pedidos_farmacias.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la pagina para traer registros', 404, {}));
        return;
    }


    var operario_bodega = args.pedidos_farmacias.operario_id;
    var pagina_actual = args.pedidos_farmacias.pagina_actual;
    var limite = args.pedidos_farmacias.limite;

    this.m_pedidos_farmacias.listar_pedidos_del_operario(operario_bodega, pagina_actual, limite,  function(err, lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });

};

PedidosFarmacias.$inject = ["m_pedidos_farmacias", "e_pedidos_farmacias"];

module.exports = PedidosFarmacias;