
var ChatEvents = function(socket, m_chat) {

    console.log("Eventos Chat cargado ");

    this.io = socket;
    this.m_chat = m_chat;
};


ChatEvents.prototype.onNotificarMensaje = function(mensaje, usuarios, usuarioEmite, callback) {    

    var that = this;
    
    var usuariosANotificar = [];
    
    G.Q.nfcall(G.auth.getAllSessions).then(function(sessiones){
        
        for(var i in sessiones){    
            var _session = sessiones[i];
            
            for(var ii in usuarios){
                var _usuario = usuarios[ii];
                
                if(_session.usuario_id === _usuario.usuario_id /*&& _session.usuario_id !== usuarioEmite*/){
                    mensaje.socket_id = _session.socket_id;
                    mensaje.usuarioEmite = usuarioEmite;
                    that.io.to(_session.socket_id).emit('onNotificarMensaje', {mensaje: mensaje});
                    that.io.to(_session.socket_id).emit('onNotificacionChat', {mensaje: mensaje});

                    //Se valida que la notificacion no se envie de forma repetida ni al usuario que la emitio
                    if(usuariosANotificar.indexOf(_usuario.usuario_id) === -1 && parseInt(_usuario.usuario_id) !== parseInt(usuarioEmite)){
                        usuariosANotificar.push(_usuario.usuario_id);
                    }
                    
                    //console.log("enviando notificacion ", _session);
                }
                
            }
                
        }
        
        that.enviarNotificacionPush({usuarios:usuariosANotificar, mensaje:mensaje});
        
        callback(false);
        
    }).fail(function(err){
        callback(err);
    });
};


ChatEvents.prototype.enviarNotificacionPush = function(parametros) {    
    var that = this;
    var usuario = parametros.usuarios[0];
    
    if(!usuario){
        return;
    
    }
    var def = G.Q.defer();
    
    G.Q.ninvoke(that.m_chat, "obtenerIdDispositivoPorUsuario", {usuario_id:usuario, token:G.constants.APPS().DUSOFT_CHAT}).
    then(function(resultado){
        
        var fcm = new G.fcmPush(G.constants.PUSH().SERVER.KEY);
        
        if(resultado.length === 0){
            def.resolve();
            console.log("no se pudo obtener el device id para el usuario ", usuario);
            
        } else {        
            console.log("enviar notificacion a ", usuario, " con token ", resultado[0].device_id);
            var mensaje = {
                to: resultado[0].device_id,
                collapse_key: parametros.mensaje.id_conversacion+"", 
                data: {
                    mensaje: parametros.mensaje
                }
               /* notification: {
                    title: 'Nuevo mensaje',
                    body: parametros.mensaje.mensaje,
                    sound: 'default'
                }*/
            };

            return fcm.send(mensaje);
        }
        
    }).then(function(resultado){
        
        setTimeout(function(){
            parametros.usuarios.splice(0,1);
            that.enviarNotificacionPush(parametros);
        },0);
        
    }).fail(function(err){
        console.log("error al obtener token usuario", err);
    }).done();
    
    
};

ChatEvents.$inject = ["socket", "m_chat"];

module.exports = ChatEvents;