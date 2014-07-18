
var PedidosClientesEvents = function(socket, pedidos_clientes, terceros) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_terceros = terceros;
};

// Notificacion en Real Time de los Pedidos Actualizados
// Callbacks :  *   Modulo: PedidosClientes 
//                          Controller - asignarResponsablesPedido();
PedidosClientesEvents.prototype.onNotificarPedidosActualizados = function(datos) {

    var that = this;

    this.m_pedidos_clientes.consultar_pedido(datos.numero_pedido, function(err, lista_pedidos_actualizados) {
        var response = G.utils.r('onListarPedidosClientes', 'Lista Pedidos Clientes Actualizados', 200, {pedidos_clientes: lista_pedidos_actualizados});
        that.io.sockets.emit('onListarPedidosClientes', response);
    });
};


/**
 * @api {event} onNotificacionOperarioPedidosAsignados Notificación Pedidos Asignados 
 * @apiName Notificación Pedidos Asignados
 * @apiGroup Pedidos Clientes Eventos
 * @apiDescription Emite un evento o notificacion en tiempo real, a las plataformas conectados al API Dusoft Server, de los pedidos de clientes que le fueron asignado a un operario de bodega que se encuentre autenticado en el sistema.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Object} numero_pedidos  Lista de pedidos que le fueron asignados al operario de bodega.
 * @apiParam {Number} responsable Operario de Bodega al que se le asigna el pedido.
 * @apiSuccessExample Este Evento se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - asignarResponsablesPedido();
 * @apiSuccessExample Ejemplo Válido del Request.
 *     HTTP/1.1 200 OK
 *     {  
 *          numero_pedidos : [ 3865, 10265, 69, 12],
 *          responsable : 19
 *          
 *     }
 * @apiSuccessExample Emite o Notifica al evento onPedidosClientesAsignados
 *     HTTP/1.1 200 OK
 *     {
 *        pedidos_clientes : [ 
 *                              {
 *                              } 
 *                            ] 
 *     }
 */

PedidosClientesEvents.prototype.onNotificacionOperarioPedidosAsignados = function(datos) {
    
    var that = this;
    var lista_pedidos = [];
    var i = 0;

    // Seleccionar el Socket del Operario, si esta conectado en la Tablet.    
    this.m_terceros.seleccionar_operario_bodega(datos.responsable, function(err, operarios_bodega) {

        operarios_bodega.forEach(function(operario) {
            
            // Selecciona la sesion del usuario para obtener conexion a los sockets.
            G.auth.getSessionsUser(operario.usuario_id, function(err, sessions) {
                
                // Recorrer la lista de pedidos.
                datos.numero_pedidos.forEach(function(numero_pedido) {

                    // Se obtiene la informacion de la cabecera del pedido.
                    that.m_pedidos_clientes.consultar_pedido(numero_pedido, function(err, datos_pedido) {

                        datos_pedido.forEach(function(pedido) {
                            
                            // Se consulta el detalle del pedido.
                            that.m_pedidos_clientes.consultar_detalle_pedido(pedido.numero_pedido, function(err, detalle_pedido) {

                                pedido.lista_productos = detalle_pedido;

                                lista_pedidos.push(pedido);

                                if (++i === datos.numero_pedidos.length) {
                                    
                                    //Se recorre cada una de las sesiones abiertas por el usuario
                                    sessions.forEach(function(session) {
                                        
                                        //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
                                        that.io.sockets.socket(session.socket_id).emit('onPedidosClientesAsignados', {pedidos_clientes: lista_pedidos});
                                    });
                                }

                            });
                        });

                    });
                });


            });
        });
    });

    // 2. Consultar el tercero * 
    // 3. Obtener la sesion de usuario
    // 1. Consultar los pedidos asignados
    // 4. enviar por sockets

};

PedidosClientesEvents.$inject = ["socket", "m_pedidos_clientes", "m_terceros"];

module.exports = PedidosClientesEvents;