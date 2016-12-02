
var AutenticacionEvents = function(socket, pedidos_farmacias) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
    this.m_pedidos_farmacias = pedidos_farmacias;
};

// Notificacion al Clientes que esta conectado al socket
AutenticacionEvents.prototype.onConnected = function(socket_id) {    
    console.log('== SocletConectado == ' + socket_id);
    this.io.to(socket_id).emit('onConnected', {socket_id: socket_id});
};


// Actualizar La sesion del usuario con el socket asignado
AutenticacionEvents.prototype.onActualizarSesion = function(datos) { 
    console.log('== Evento Actualizando Sesion == ' + JSON.stringify(datos));
    G.auth.update(datos, function(){
        
    });
};

// Notificacion en Real Time Que algunas sesiones inactivas se cerraron automaicamente
AutenticacionEvents.prototype.onCerrarSesion = function(sesion_usuario) {

    var that = this;

    if (sesion_usuario.socket_id)
        that.io.to(sesion_usuario.socket_id).emit('onCerrarSesion', {msj: 'Sesion Cerrada'});
};

AutenticacionEvents.$inject = ["socket", "m_pedidos_farmacias"];

module.exports = AutenticacionEvents;