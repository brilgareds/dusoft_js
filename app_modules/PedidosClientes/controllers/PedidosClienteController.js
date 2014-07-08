
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

};

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

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, pagina_actual, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));
    });
};

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

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            // Notificacion al operario de los pedidos que le fueron asigandos
            that.e_pedidos_clientes.onNotificacionOperarioPedidosAsignados({numero_pedido: numero_pedido, responsable: responsable});

            if (--i === 0) {
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
            }
        });
    });
};


/**
 * @api {post} /api/PedidosClientes/listaPedidosOperarioBodega Pedidos Clientes Asignados a Operario de Bodega
 * @apiName listaPedidosOperarioBodega
 * @apiGroup PedidosClientes
 * @apiDescription Proporciona una lista con todos los pedidos de clientes asignados a un operario de bodega
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
 *              lista_pedidos : { 
 *                                  operario_id:  19
 *                              }
 *          }
 *     }
 * @apiSuccessExample Respuesta-Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       service : '/api/PedidosClientes/listaPedidosOperarioBodega',   
 *       msj : 'Listado Pedidos Clientes',
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
 *                                             fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z' 
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

    if (args.lista_pedidos === undefined || args.lista_pedidos.operario_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.lista_pedidos.operario_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id de un operario de bodega', 404, {}));
        return;
    }

    var operario_bodega = args.lista_pedidos.operario_id;

    this.m_pedidos_clientes.listar_pedidos_del_operario(operario_bodega, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));
    });

};


PedidosCliente.$inject = ["m_pedidos_clientes", "e_pedidos_clientes"];

module.exports = PedidosCliente;