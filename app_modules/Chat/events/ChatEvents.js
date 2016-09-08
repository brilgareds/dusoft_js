
var ChatEvents = function(socket) {

    console.log("Eventos Chat cargado ");

    this.io = socket;
};


ChatEvents.prototype.onNotificarMensaje = function(mensaje, usuarios, usuarioEmite) {    
    /*console.log('== SocletConectado == ' + socket_id);
    this.io.sockets.socket(socket_id).emit('onConnected', {socket_id: socket_id});*/
    var that = this;
    
    G.Q.nfcall(G.auth.getAllSessions).then(function(sessiones){
        //console.log("sessiones de los usuarios ", sessiones);
       // console.log("usurios de la conversacion ", usuarios);
        
        for(var i in sessiones){
            var _session = sessiones[i];
            
            for(var ii in usuarios){
                var _usuario = usuarios[ii];
                
                if(_session.usuario_id === _usuario.usuario_id /*&& _session.usuario_id !== usuarioEmite*/){
                    that.io.sockets.socket(_session.socket_id).emit('onNotificarMensaje', {mensaje: mensaje});
                    console.log("enviando notificacion ", _session);
                }
                
            }
            
        }
        
        
    });
};


ChatEvents.$inject = ["socket", "m_pedidos_farmacias"];

module.exports = ChatEvents;