
var OrdenesCompraEvents = function(socket, ordenes_compras) {

    this.io = socket;
    this.m_ordenes_compras = ordenes_compras;
};


// Notificaciones en Tiempo real, usandos Sockets.io
OrdenesCompraEvents.prototype.onNotificarOrdenesComprasActualizados = function(datos) {

    var that = this;

    that.m_ordenes_compras.consultar_orden_compra(datos.numero_orden, function(err, lista_ordenes_compras) {
        var response = G.utils.r('onListarOrdenesCompras', 'Lista Ordenes Compras Actualizados', 200, {ordenes_compras: lista_ordenes_compras});
        that.io.sockets.emit('onListarOrdenesCompras', response);
    });
};


OrdenesCompraEvents.prototype.onNotificarProgresoArchivoPlanoOrdenes = function(usuario_id, porcentaje) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {

         //Se recorre cada una de las sesiones abiertas por el usuario
         sessions.forEach(function(session) {
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
             that.io.to(session.socket_id).emit('onNotificarProgresoArchivoPlanoOrdenes', {porcentaje: porcentaje});
         });

     });
};

OrdenesCompraEvents.prototype.onNotificarGenerarI002 = function(usuario_id, parametros) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {

         //Se recorre cada una de las sesiones abiertas por el usuario
         sessions.forEach(function(session) {
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
             that.io.to(session.socket_id).emit('onNotificarGenerarI002', {parametros: parametros});
         });

     });
};


OrdenesCompraEvents.$inject = ["socket", "m_ordenes_compra"];

module.exports = OrdenesCompraEvents;