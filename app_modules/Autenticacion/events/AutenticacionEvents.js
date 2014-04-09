
var AutenticacionEvents = function(socket) {

    console.log("Eventos Pedidos Cliente  Cargado ");

    this.io = socket;
};

// Notificacion al Clientes que esta conectado al socket
AutenticacionEvents.prototype.onConnected = function(socket_id) {    
    console.log('== SocletConectado == ' + socket_id);
    this.io.sockets.socket(socket_id).emit('onConnected', {socket_id: socket_id});
};


// Actualizar La sesion del usuario con el socket asignado
AutenticacionEvents.prototype.onActualizarSesion = function(datos) { 
    console.log('== Evento Actualizando Sesion == ' + JSON.stringify(datos));
    G.auth.update(datos);
};

// Notificacion en Real Time Que algunas sesiones inactivas se cerraron automaicamente
AutenticacionEvents.prototype.onCerrarSesion = function(sesion_usuario) {

    var that = this;

    if (sesion_usuario.socket_id)
        that.io.sockets.socket(sesion_usuario.socket_id).emit('onCerrarSesion', {msj: 'Sesion Cerrada'});
};

AutenticacionEvents.$inject = ["socket"];

module.exports = AutenticacionEvents;