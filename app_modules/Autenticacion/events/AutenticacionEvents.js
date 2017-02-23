
var AutenticacionEvents = function(socket, pedidos_farmacias, m_auth) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
    this.m_auth = m_auth;
    this.m_pedidos_farmacias = pedidos_farmacias;
};

// Notificacion al Clientes que esta conectado al socket
AutenticacionEvents.prototype.onConnected = function(socket_id) {    
    console.log('== SocletConectado == ' + socket_id);
    this.io.to(socket_id).emit('onConnected', {socket_id: socket_id});
};


AutenticacionEvents.prototype.guardarTokenPush = function(datos) {    
    var that = this;
    console.log("datos >>>>>>>>>>>>>>>>>>>> ", datos);
    G.Q.ninvoke(that.m_auth,'guardarTokenPush', datos).then(function() {
      
    }).fail(function(err) {
        console.log("ocurrio un error ", err);
    }).done();
};

// Actualizar La sesion del usuario con el socket asignado
AutenticacionEvents.prototype.onActualizarSesion = function(datos) { 
    console.log('== Evento Actualizando Sesion == ' + JSON.stringify(datos));
    var that = this;
    G.auth.update(datos, function(){
        that.io.to(datos.socket_id).emit('onSesionActualizada', datos);
    });
};

// Notificacion en Real Time Que algunas sesiones inactivas se cerraron automaicamente
AutenticacionEvents.prototype.onCerrarSesion = function(sesion_usuario) {

    var that = this;

    if (sesion_usuario.socket_id)
        that.io.to(sesion_usuario.socket_id).emit('onCerrarSesion', {msj: 'Sesion Cerrada'});
};

AutenticacionEvents.$inject = ["socket", "m_pedidos_farmacias", "m_auth"];

module.exports = AutenticacionEvents;