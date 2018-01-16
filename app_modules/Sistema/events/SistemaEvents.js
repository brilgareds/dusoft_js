var SistemaEvents = function(socket) {
    this.io = socket;
};

SistemaEvents.prototype.onObtenerEstadisticasSistema = function(socket_id){
    var that = this;
    var response = G.utils.r('onEstadisticasSistema', 'estadisticas sistema', 200, {peticiones: G.stats.toJSON(), memoria: Math.round(G.gauge._readFn() / 1024 / 1024)});
    that.io.to(socket_id).emit('OnEstadisticaSistema', response);
};
 
SistemaEvents.$inject = ["socket"];

module.exports = SistemaEvents;