
var OrdenesCompraEvents = function(socket, ordenes_compras) {

    console.log("Eventos OrdenesCompra  Cargado ");

    this.io = socket;
    this.m_ordenes_compras = ordenes_compras;
};


OrdenesCompraEvents.prototype.onNotificarOrdenesComprasActualizados = function(datos) {

    var that = this;

    that.m_ordenes_compras.consultar_orden_compra(datos.numero_orden, function(err, lista_ordenes_compras) {
        var response = G.utils.r('onListarOrdenesCompras', 'Lista Ordenes Compras Actualizados', 200, {ordenes_compras: lista_ordenes_compras});
        that.io.sockets.emit('onListarOrdenesCompras', response);
    });
};


OrdenesCompraEvents.$inject = ["socket", "m_ordenes_compra"];

module.exports = OrdenesCompraEvents;