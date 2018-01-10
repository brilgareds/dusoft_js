
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
DispensacionHcEvents.prototype.onNotificarEntregaFormula = function(result,msj, status,usuario) {
  
    var that = this;
    var response = G.utils.r('onNotificarEntregaFormula', msj, status, result);  
     __enviarNotificacion(that,usuario,response,"onNotificarEntregaFormula"); 

};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice la entrega de los
 *              medicamentos pendientes
 * @fecha 2017-02-08
 */
DispensacionHcEvents.prototype.onNotificarCabeceraFormula = function(result,msj, status,usuario) {
  
    var that = this;
    var response = G.utils.r('onNotificarCabeceraFormula', msj, status, result);   
    __enviarNotificacion(that,usuario,response,"onNotificarCabeceraFormula"); 

};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice el proceso que permite
 *              dejar la formula en estado Todo pendiente
 * @fecha 2017-02-08
 */
DispensacionHcEvents.prototype.onNotificarTodoPendienteFormula = function(result,msj, status,usuario) {
    
    var that = this;
    var response = G.utils.r('onNotificarTodoPendienteFormula', msj, status, result);   
    __enviarNotificacion(that,usuario,response,"onNotificarTodoPendienteFormula");
     

};

/**
 * @author Cristian Ardian
 * +Descripcion Metodo encargado de validar el usuario actual de la session
 *              para que solo a ese usuario se le envie la session
 * @fecha 2017/01/03
 */
function __enviarNotificacion(that,usuario,response,socket){
   
    G.auth.getSessionsUser(usuario, function(err, sessions) {          
         //Se recorre cada una de las sesiones abiertas por el usuario
        sessions.forEach(function(session) {
     
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
            that.io.to(session.socket_id).emit(socket,response);
        });

    });
    
}

DispensacionHcEvents.$inject = ["socket", "m_dispensacion_hc"];

module.exports = DispensacionHcEvents;