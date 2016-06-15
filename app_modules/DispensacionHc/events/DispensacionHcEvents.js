
var DispensacionHcEvents = function(socket, dispensacion) {

    this.io = socket;
    this.m_dispensacion = dispensacion;
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
DispensacionHcEvents.prototype.onNotificarEntregaFormula = function() {
  
  console.log("*******************NOTIFICAR ENTREGA FORMULA ************");
    var that = this;
    var response = G.utils.r('onActualizarGridTemporal', 'nuevo estado de cotizacion Actualizado', 200,
                    {
                        numeroCotizacion: '',
                        estado: ''
                    });
    that.io.sockets.emit('onActualizarGridTemporal', response);
    /*this.m_pedidos_clientes.consultarEstadoCotizacion(numeroCotizacion, function(err, rows) {
      
        if (!err) {
          
            var response = G.utils.r('onListarEstadoCotizacion', 'nuevo estado de cotizacion Actualizado', 200,
                    {
                        numeroCotizacion: numeroCotizacion,
                        estado: rows
                    });
                    
            that.io.sockets.emit('onListarEstadoCotizacion', response);
        }
    });*/

};



DispensacionHcEvents.$inject = ["socket", "m_dispensacion_hc"];

module.exports = DispensacionHcEvents;