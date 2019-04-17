
var PedidosFarmaciasEvents = function(socket, pedidos_farmacias, terceros) {

    this.io = socket;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_terceros = terceros;
};

// Notificacion en Real Time de los Pedidos Actualizados
PedidosFarmaciasEvents.prototype.onNotificarPedidosActualizados = function(datos) {

    var that = this;

    this.m_pedidos_farmacias.consultar_pedido(datos.numero_pedido, function(err, lista_pedidos_actualizados) {
        var response = G.utils.r('onListarPedidosFarmacias', 'Lista Pedidos Farmacias Actualizados', 200, {pedidos_farmacias: lista_pedidos_actualizados});
        that.io.sockets.emit('onListarPedidosFarmacias', response);
    });
};

// Notificacion a los Operarios de los Pedidos Asigandos
PedidosFarmaciasEvents.prototype.onNotificacionOperarioPedidosAsignados = function(datos) {

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
                    that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, datos_pedido) {

                        datos_pedido.forEach(function(pedido) {

                            // Se consulta el detalle del pedido.
                            that.m_pedidos_farmacias.consultar_detalle_pedido(pedido.numero_pedido, function(err, detalle_pedido) {

                                pedido.lista_productos = detalle_pedido;

                                lista_pedidos.push(pedido);

                                if (++i === datos.numero_pedidos.length) {

                                    //Se recorre cada una de las sesiones abiertas por el usuario
                                    sessions.forEach(function(session) {

                                        //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
                                        that.io.to(session.socket_id).emit('onPedidosFarmaciasAsignados', {pedidos_farmacias: lista_pedidos});
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
PedidosFarmaciasEvents.prototype.onNotificacionOperarioPedidosReasignados = function(datos) {

    var that = this;
   
    // Seleccionar el Socket del Operario, si esta conectado en la Tablet.    
    this.m_terceros.seleccionar_operario_bodega(datos.responsable, function(err, operarios_bodega) {
        if(operarios_bodega !== undefined){
        operarios_bodega.forEach(function(operario) {

            // Selecciona la sesion del usuario para obtener conexion a los sockets.
            G.auth.getSessionsUser(operario.usuario_id, function(err, sessions) {

                //Se recorre cada una de las sesiones abiertas por el usuario
                sessions.forEach(function(session) {

                    //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
                    that.io.to(session.socket_id).emit('onPedidosFarmaciasReasignados', {pedidos_farmacias: datos.numero_pedidos});
                });

            });
        });
       }
    });
};

PedidosFarmaciasEvents.prototype.onNotificarProgresoArchivoPlanoFarmacias = function(usuario_id, porcentaje) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {

         //Se recorre cada una de las sesiones abiertas por el usuario
         sessions.forEach(function(session) {
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
             that.io.to(session.socket_id).emit('onNotificarProgresoArchivoPlanoFarmacias', {porcentaje: porcentaje});
         });

     });
};


PedidosFarmaciasEvents.$inject = ["socket", "m_pedidos_farmacias", "m_terceros"];

module.exports = PedidosFarmaciasEvents;