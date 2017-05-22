
var SincronizacionEvents = function(socket, m_sincronizacion) {

    this.io = socket;
    this.m_sincronizacion = m_sincronizacion;
};



SincronizacionEvents.$inject = ["socket", "m_sincronizacion"];

module.exports = SincronizacionEvents;