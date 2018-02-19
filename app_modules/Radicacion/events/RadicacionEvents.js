
var RadicacionEvents = function(socket) {

    this.io = socket;
};


RadicacionEvents.prototype.onNotificarProgresoArchivo = function(usuario_id, porcentaje) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {

         //Se recorre cada una de las sesiones abiertas por el usuario
         sessions.forEach(function(session) {
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
             that.io.to(session.socket_id).emit('onNotificarProgresoArchivo', {porcentaje: porcentaje});
         });

     });
};


RadicacionEvents.$inject = ["socket"];

module.exports = RadicacionEvents;