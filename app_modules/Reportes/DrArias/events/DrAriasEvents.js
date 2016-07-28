
var DrAriasEvents = function(socket) {
    console.log("Eventos Estado Descarga Reporte ");
    this.io = socket;
};

DrAriasEvents.prototype.onNotificarEstadoDescargaReporte = function(usuario_id,estado) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {
            
         //Se recorre cada una de las sesiones abiertas por el usuario
         sessions.forEach(function(session) {
             console.log("emitir evento reportes ___________________________________________________");
             //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
             that.io.sockets.socket(session.socket_id).emit('onNotificarEstadoDescargaReporte', {estado: 'ok'});
         });

     });
};


DrAriasEvents.$inject = ["socket", "m_drArias", "m_terceros"];

module.exports = DrAriasEvents;