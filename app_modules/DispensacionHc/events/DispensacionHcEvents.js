
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
DispensacionHcEvents.prototype.onNotificarEntregaFormula = function(result,msj, status) {
  
    console.log("*******************NOTIFICAR ENTREGA FORMULA ************");
    var that = this;
    var response = G.utils.r('onNotificarEntregaFormula', msj, status, result);
    console.log("response ", response);
    that.io.sockets.emit('onNotificarEntregaFormula', response);
     

};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice la entrega de los
 *              medicamentos pendientes
 * @fecha 2017-02-08
 */
DispensacionHcEvents.prototype.onNotificarCabeceraFormula = function(result,msj, status) {
  
    console.log("*******************NOTIFICAR CABECERA FORMULA ************");
    var that = this;
    var response = G.utils.r('onNotificarCabeceraFormula', msj, status, result);
    console.log("response ", response);
    that.io.sockets.emit('onNotificarCabeceraFormula', response);
     

};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice el proceso que permite
 *              dejar la formula en estado Todo pendiente
 * @fecha 2017-02-08
 */
DispensacionHcEvents.prototype.onNotificarTodoPendienteFormula = function(result,msj, status) {
  
    console.log("*******************NOTIFICAR TODO PENDIENTES FORMULA ************");
    var that = this;
    var response = G.utils.r('onNotificarTodoPendienteFormula', msj, status, result);
    console.log("response ", response);
    that.io.sockets.emit('onNotificarTodoPendienteFormula', response);
     

};



DispensacionHcEvents.$inject = ["socket", "m_dispensacion_hc"];

module.exports = DispensacionHcEvents;