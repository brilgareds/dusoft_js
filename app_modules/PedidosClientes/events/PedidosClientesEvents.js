
var PedidosClientesEvents = function(socket, pedidos_clientes, terceros) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_terceros = terceros;
};

// Notificacion en Real Time de los Pedidos Actualizados
PedidosClientesEvents.prototype.onNotificarPedidosActualizados = function(datos) {

    var that = this;

    this.m_pedidos_clientes.seleccionar_pedido_by_numero_pedido(datos.numero_pedido, function(err, lista_pedidos_actualizados) {
        var response = G.utils.r('onListarPedidosClientes', 'Lista Pedidos Clientes Actualizados', 200, {pedidos_clientes: lista_pedidos_actualizados});
        that.io.sockets.emit('onListarPedidosClientes', response);
    });
};

// Notificacion a los Operarios de los Pedidos Asigandos
PedidosClientesEvents.prototype.onNotificacionOperarioPedidosAsignados = function(datos) {

    // ---- Parametros Requeridos ------//
    // * numero_pedido 
    // * responsable
    // ---------------------------------//
    
    var that = this;
    // Seleccionar el Socket del Operario, si esta conectado en la Tablet    
    this.m_terceros.seleccionar_operario_bodega(datos.responsable, function(err, operarios_bodega) {
        operarios_bodega.forEach(function(operario) {            
            G.auth.getSessionsUser(operario.usuario_id, function(err, sessions) {
                sessions.forEach(function(session) {
                    that.m_pedidos_clientes.seleccionar_pedido_by_numero_pedido(datos.numero_pedido, function(err, lista_pedidos_asignados) {
                        that.io.sockets.socket(session.socket_id).emit('onPedidosClientesAsignados', { pedidos_clientes : lista_pedidos_asignados });
                    });
                });
            });
        });
    });

};

PedidosClientesEvents.$inject = ["socket", "m_pedidos_clientes", "m_terceros"];

module.exports = PedidosClientesEvents;