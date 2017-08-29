
var FacturacionClientesEvents = function(socket, m_facturacion_clientes) {

    this.io = socket;
    this.m_facturacion_clientes = m_facturacion_clientes;
};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice el proceso de facturas
 *              en estado de espera
 * @fecha 2017-02-08
 */
FacturacionClientesEvents.prototype.onNotificarFacturacionTerminada = function(result,msj, status,usuario) {
    
    var that = this;
    var response = G.utils.r('onNotificarFacturacionTerminada', msj, status, result);   
    __enviarNotificacion(that,usuario,response,"onNotificarFacturacionTerminada");
     
};

/**
 * @author Cristian Ardila
 * +Descripcion Evento invocado en el momento en que se realice el proceso de facturas
 *              en estado de espera
 * @fecha 2017-02-08
 */
FacturacionClientesEvents.prototype.onNotificarFacturacionXConsumoTerminada = function(result,msj, status,usuario) {
    
    var that = this;
    var response = G.utils.r('onNotificarFacturacionXConsumoTerminada', msj, status, result);   
    __enviarNotificacion(that,usuario,response,"onNotificarFacturacionXConsumoTerminada");
     
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
            console.log("emitir evento Factura en proceso generada ___________________________________________________");
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
            that.io.to(session.socket_id).emit(socket,response);
        });

    });
    
}

FacturacionClientesEvents.$inject = ["socket", "m_facturacion_clientes"];

module.exports = FacturacionClientesEvents;