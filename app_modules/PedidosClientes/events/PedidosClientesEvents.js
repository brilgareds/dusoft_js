
var PedidosClientesEvents = function(socket, pedidos_clientes, terceros) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_terceros = terceros;
};

/**
 * @api {event} onNotificarPedidosActualizados Notificación Pedidos Actualizados 
 * @apiName Notificación Pedidos Actualizados
 * @apiGroup PedidosClientes (evt)
 * @apiDescription Notifica a todos los usuarios en tiempo real que pedidos han sido actualizados.
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
 *          numero_pedido: 15
 *          
 *     }
 * @apiSuccessExample Emite o Notifica al evento onListarPedidosClientes
 *     HTTP/1.1 200 OK
 *     {
 *        pedidos_clientes : [ 
 *                              {   
 *                                   numero_pedido: 33872,
 *                                   tipo_id_cliente: 'CE',
 *                                   identificacion_cliente: '10365',
 *                                   nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL
 *                                   direccion_cliente: 'CALLE 14 15-49',
 *                                   telefono_cliente: '8236444',
 *                                   tipo_id_vendedor: 'CC ',
 *                                   idetificacion_vendedor: '94518917',
 *                                   nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',
 *                                   estado: '1',
 *                                   descripcion_estado: 'Activo',
 *                                   estado_actual_pedido: '1',
 *                                   descripcion_estado_actual_pedido: 'Separado',
 *                                   fecha_registro: '2014-01-21T17:28:50.700Z',
 *                                   responsable_id: 19,
 *                                   responsable_pedido: 'Ixon Eduardo Niño',
 *                                   fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z'                                   
 *                                 }
 *                            ] 
 *     }
 */

PedidosClientesEvents.prototype.onNotificarPedidosActualizados = function(datos) {

    var that = this;

    this.m_pedidos_clientes.consultar_pedido(datos.numero_pedido, function(err, lista_pedidos_actualizados) {
        var response = G.utils.r('onListarPedidosClientes', 'Lista Pedidos Clientes Actualizados', 200, {pedidos_clientes: lista_pedidos_actualizados});
        that.io.sockets.emit('onListarPedidosClientes', response);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de refrescar en tiempo real la lista de
 *               cotizaciones
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del eventp : 
 *  --PedidosClienteController.prototype.modificarEstadoCotizacion
 *  --PedidosCliente.prototype.observacionCarteraCotizacion
 *  --PedidosCliente.prototype.generarPedido
 *  --PedidosCliente.prototype.solicitarAutorizacion
 *  --PedidosClienteController.prototype.modificarEstadoCotizacion
 */
PedidosClientesEvents.prototype.onNotificarEstadoCotizacion = function(numeroCotizacion) {

    var that = this;
  
    this.m_pedidos_clientes.consultarEstadoCotizacion(numeroCotizacion, function(err, rows) {
     
        if (!err) {
            
            var response = G.utils.r('onListarEstadoCotizacion', 'nuevo estado de cotizacion Actualizado', 200,
                    {
                        numeroCotizacion: numeroCotizacion,
                        estado: rows
                    });

            that.io.sockets.emit('onListarEstadoCotizacion', response);
        }
    });

};

// Notificacion al Clientes que esta conectado al socket
PedidosClientesEvents.prototype.onConnected = function(socket_id) {    
    console.log('== SocletConectado == ' + socket_id);
    this.io.sockets.socket(socket_id).emit('onConnected', {socket_id: socket_id});
};
PedidosClientesEvents.prototype.onActualizarSesion = function(datos) { 
    console.log('== Evento Actualizando Sesion == ' + JSON.stringify(datos));
    G.auth.update(datos, function(){
        
    });
};
PedidosClientesEvents.prototype.onNotificarEstadoPedido = function(numero_pedido,estadoPedido) {
    
      
  
    var that = this;
    this.m_pedidos_clientes.consultarEstadoPedidoEstado(numero_pedido, function(estado, rows) {
   
     if (estado) {
        
        var response = G.utils.r('onListarEstadoPedido', 'Estado del pedido', 200, 
                    {
                        pedidos_clientes: rows,
                        numero_pedido: numero_pedido,
                        estado: estadoPedido
                    });
          
        that.io.sockets.emit('onListarEstadoPedido', response);
        
         }
    });
};


/**
 * @api {event} onNotificacionOperarioPedidosAsignados Notificación Pedidos Asignados 
 * @apiName Notificación Pedidos Asignados
 * @apiGroup PedidosClientes (evt)
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
 *                                   numero_pedido: 33872,
 *                                   tipo_id_cliente: 'CE',
 *                                   identificacion_cliente: '10365',
 *                                   nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL
 *                                   direccion_cliente: 'CALLE 14 15-49',
 *                                   telefono_cliente: '8236444',
 *                                   tipo_id_vendedor: 'CC ',
 *                                   idetificacion_vendedor: '94518917',
 *                                   nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',
 *                                   estado: '1',
 *                                   descripcion_estado: 'Activo',
 *                                   estado_actual_pedido: '1',
 *                                   descripcion_estado_actual_pedido: 'Separado',
 *                                   fecha_registro: '2014-01-21T17:28:50.700Z',
 *                                   responsable_id: 19,
 *                                   responsable_pedido: 'Ixon Eduardo Niño',
 *                                   fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z'     
 *                                   lista_productos:[
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
 *                                 }
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
};


// Notificar a los clientes conectado a la aplicacion los pedidos que fueron reasignados
PedidosClientesEvents.prototype.onNotificacionOperarioPedidosReasignados = function(datos) {

    var that = this;

    // Seleccionar el Socket del Operario, si esta conectado en la Tablet.    
    this.m_terceros.seleccionar_operario_bodega(datos.responsable, function(err, operarios_bodega) {

        operarios_bodega.forEach(function(operario) {


            // Selecciona la sesion del usuario para obtener conexion a los sockets.
            G.auth.getSessionsUser(operario.usuario_id, function(err, sessions) {

                //Se recorre cada una de las sesiones abiertas por el usuario
                sessions.forEach(function(session) {

                    //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
                    that.io.sockets.socket(session.socket_id).emit('onPedidosClientesReasignados', {pedidos_clientes: datos.numero_pedidos});
                });

            });
        });
    });
};


PedidosClientesEvents.prototype.onNotificarProgresoArchivoPlanoClientes = function(usuario, porcentaje, callback) {

    var that = this;
    G.auth.getSessionsUser(usuario.usuario_id, function(err, sessions) {

        //Se recorre cada una de las sesiones abiertas por el usuario
        for (var i in sessions) {
            //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
            var session = sessions[i];
            if (session.token === usuario.auth_token) {
                that.io.sockets.socket(session.socket_id).emit('onNotificarProgresoArchivoPlanoClientes', {porcentaje: porcentaje});
                callback();
                break;
            }
        }


    });
};

PedidosClientesEvents.$inject = ["socket", "m_pedidos_clientes", "m_terceros"];

module.exports = PedidosClientesEvents;