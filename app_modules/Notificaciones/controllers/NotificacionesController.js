var NotificacionesController = function(socket){
    this.io = socket;
    this.init();
};

/*
 * @Author: Eduar
 * +Descripcion: Se registran los listener del controlador
 */
NotificacionesController.prototype.init = function(){
    var that = this;
    
    //Evento para notificaciones web, proviene de los controladores del servidor
    G.eventEmitter.on("onRealizarNotificacionWeb",function(parametros){
        that.onRealizarNotificacionWeb(parametros);
    });
};

/*
 * @Author: Eduar
 * @params{object} {String titulo, String mensaje, String moduloAlias, String moduloOpcion}
 * +Descripcion: Realiza un emit del evento a las aplicaciones cliente
 */
NotificacionesController.prototype.onRealizarNotificacionWeb = function(parametros){

    this.io.sockets.emit('onRealizarNotificacionWeb', parametros);
};

NotificacionesController.$inject = ["socket"];

module.exports = NotificacionesController;  