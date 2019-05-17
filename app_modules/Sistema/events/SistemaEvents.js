var SistemaEvents = function(socket) {
    this.io = socket;
};

SistemaEvents.prototype.onObtenerEstadisticasSistema = function(socket_id){
    var that = this;
    var response = G.utils.r('onEstadisticasSistema', 'estadisticas sistema', 200, {peticiones: G.stats.toJSON(), memoria: Math.round(G.gauge._readFn() / 1024 / 1024)});
    that.io.to(socket_id).emit('OnEstadisticaSistema', response);
};

SistemaEvents.prototype.enviarInformacion = function(datos){
    var that = this;
    var response = G.utils.r(datos.funcion, datos.msj, datos.status, datos.result);
    __enviarNotificacion(that,datos.usuario,response,datos.funcion);
};

function __enviarNotificacion(that,usuario,response,socket){
   
    G.auth.getSessionsUser(usuario, function(err, sessions) {          
         //Se recorre cada una de las sesiones abiertas por el usuario
        sessions.forEach(function(session) {
     
            //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
            that.io.to(session.socket_id).emit(socket,response);
        });
    });
}
 
SistemaEvents.$inject = ["socket"];

module.exports = SistemaEvents;
