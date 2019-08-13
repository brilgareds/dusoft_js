
var MensajeriaEvents = function(socket, m_mensajes) {



    this.io = socket;
    this.m_mensajes = m_mensajes;
};

// Notificacion al Clientes que esta conectado al socket
MensajeriaEvents.prototype.onConnected1 = function(socket_id) {    

    this.io.to(socket_id).emit('onConnected1', {socket_id: socket_id});
};

MensajeriaEvents.prototype.ConsultarMensajes = function (datos) {
    var that = this;
    var args = datos;

    var parametros = {
        usuario_id: args.usuario_id
    };

    G.Q.ninvoke(that.m_mensajes, 'ConsultarMensajesUsuario', parametros).then(function (resultado) {
        console.log("resultado",resultado);
//        that.io.to(datos.socket_id).emit('onCerrarSesion', {msj: 'Error al Consultar los mensajes del usuario'});
//        res.send(G.utils.r(req.url, 'Consultar mensajes del usuario ok!!!!', 200, {mensajes: resultado}));
    }).fail(function (err) {
//        res.send(G.utils.r(req.url, 'Error al Consultar los mensajes del usuario', 500, {mensajes: {}}));
        that.io.to(datos.socket_id).emit('onCerrarSesion', {msj: 'Error al Consultar los mensajes del usuario'});
    }).done();

};


MensajeriaEvents.prototype.onNotificarMensajeria = function(obj, callback) {    

    var that = this;
    
//    var usuariosANotificar = [];
    
    G.Q.nfcall(G.auth.getAllSessions).then(function(sessiones){
        
        for(var i in sessiones){    
            var _session = sessiones[i];
            
//            for(var ii in usuarios){
//                var _usuario = usuarios[ii];
                
//                if(_session.usuario_id === _usuario.usuario_id){
                    
                    that.io.to(_session.socket_id).emit('onNotificarMensajeria', {obj});

                    //Se valida que la notificacion no se envie de forma repetida ni al usuario que la emitio
//                    if(usuariosANotificar.indexOf(_usuario.usuario_id) === -1 && parseInt(_usuario.usuario_id) !== parseInt(usuarioEmite)){
//                        usuariosANotificar.push(_usuario.usuario_id);
//                    }
                    
//                }
                
//            }
                
        }
        
//        that.enviarNotificacionPush({usuarios:usuariosANotificar, mensaje:mensaje});
        
        callback(false);
        
    }).fail(function(err){
        callback(err);
    });
};


MensajeriaEvents.$inject = ["socket", "m_mensajes"];

module.exports = MensajeriaEvents;