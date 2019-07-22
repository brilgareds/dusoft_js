
var AutenticacionEvents = function(socket, m_mensajes) {



    this.io = socket;
    this.m_mensajes = m_mensajes;
};

// Notificacion al Clientes que esta conectado al socket
AutenticacionEvents.prototype.onConnected1 = function(socket_id) {    

    this.io.to(socket_id).emit('onConnected1', {socket_id: socket_id});
};
//
//
//AutenticacionEvents.prototype.guardarTokenPush = function(datos) {    
//    var that = this;
//
//    G.Q.ninvoke(that.m_auth,'guardarTokenPush', datos).then(function() {
//      
//    }).fail(function(err) {
//        console.log("ocurrio un error ", err);
//    }).done();
//};
//
//// Actualizar La sesion del usuario con el socket asignado
//AutenticacionEvents.prototype.onActualizarSesion = function(datos) { 
//   
//    var that = this;
//    G.auth.update(datos, function(){
//        that.io.to(datos.socket_id).emit('onSesionActualizada', datos);
//    });
//};
//
//// Notificacion en Real Time Que algunas sesiones inactivas se cerraron automaicamente
//AutenticacionEvents.prototype.onCerrarSesion = function(sesion_usuario) {
//
//    var that = this;
//
//    if (sesion_usuario.socket_id)
//        that.io.to(sesion_usuario.socket_id).emit('onCerrarSesion', {msj: 'Sesion Cerrada'});
//};

AutenticacionEvents.prototype.ConsultarMensajes = function (datos) {
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


AutenticacionEvents.$inject = ["socket", "m_mensajes"];

module.exports = AutenticacionEvents;