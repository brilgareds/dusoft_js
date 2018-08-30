
var DrAriasEvents = function(socket) {
  
    this.io = socket;
};

DrAriasEvents.prototype.onNotificarEstadoDescargaReporte = function(usuario_id,estado) {

    var that = this;
    G.auth.getSessionsUser(usuario_id, function(err, sessions) {
	var usuarioId="";

         sessions.forEach(function(session) {

               that.io.to(session.socket_id).emit('onNotificarEstadoDescargaReporte', {estado: 'ok'});
	        

         });

     });
};

DrAriasEvents.prototype.onNotificarRotacion = function(usuario_id,data) {

    var that = this;
    G.auth.getSessionsUser(usuario_id,function(err, sessions) {
        
         sessions.forEach(function(session) {

            that.io.to(session.socket_id).emit('onNotificarRotacion', {data: data});	        

         });
     });
};


DrAriasEvents.$inject = ["socket", "m_drArias", "m_terceros"];

module.exports = DrAriasEvents;