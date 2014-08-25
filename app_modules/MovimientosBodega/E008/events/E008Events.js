
var E008Events = function(socket, m_e008) {
    console.log("Eventos E008 Cargado ");
    this.io = socket;
    this.m_e008 = m_e008;
};


E008Events.$inject = ["socket", "m_e008"];

module.exports = E008Events;