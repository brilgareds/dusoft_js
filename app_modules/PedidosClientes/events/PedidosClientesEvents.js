
var PedidosClienteEvents = function(socket, pedidos_clientes) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.io = socket;

};

// Notificacion en Real Time de los Pedidos Actualizados
PedidosClienteEvents.prototype.onNotificarPedidosActualizados = function(datos) {

    var that = this;

    this.m_pedidos_clientes.seleccionar_pedido_by_numero_pedido(datos.numero_pedido, function(err, lista_pedidos_actualizados) {
        var response = G.utils.r('onNotificarPedidosActualizados', 'Lista Pedidos Clientes Actualizados', 200, {tipo_cliente: 'cliente', pedidos_clientes: lista_pedidos_actualizados});
        that.io.sockets.emit('onNotificarPedidosActualizados', response); 
    });
};

// Notificacion a los Operarios de los Pedidos Asigandos
PedidosClienteEvents.prototype.onNotificacionOperarioPedidosAsignados = function(datos) {

    var that = this;
    
    this.m_pedidos_clientes.listar_pedidos_del_operario(datos.empresa_id, datos.responsable, function(err, rows){
        console.log(rows);
    });
};

PedidosClienteEvents.$inject = ["socket", "m_pedidos_clientes"];

module.exports = PedidosClienteEvents;