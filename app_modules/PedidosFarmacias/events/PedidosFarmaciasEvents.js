
var PedidosFarmaciasEvents = function(socket, pedidos_farmacias, terceros) {

    console.log("Eventos Pedidos Farmacias  Cargado ");

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
    
    // ---- Parametros Requeridos ------//
    // * numero_pedido 
    // * responsable
    // ---------------------------------//

    var that = this;
    // Seleccionar el Socket del Operario, si esta conectado en la Tablet    
    this.m_terceros.seleccionar_operario_bodega(datos.responsable, function(err, operario_bodega) {
        operario_bodega.forEach(function(operario) {
            G.auth.getSessionsUser(operario.usuario_id, function(err, sessions) {
                sessions.forEach(function(session) {
                    that.m_pedidos_farmacias.consultar_pedido(datos.numero_pedido, function(err, lista_pedidos_asignados) {
                        that.io.sockets.socket(session.socket_id).emit('onPedidosFarmaciasAsignados', {pedidos_farmacias : lista_pedidos_asignados});
                    });
                });
            });
        });
    });

};

PedidosFarmaciasEvents.$inject = ["socket", "m_pedidos_farmacias", "m_terceros"];

module.exports = PedidosFarmaciasEvents;