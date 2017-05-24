
var TutorialesEvents = function(socket, dispensacion) {

    this.io = socket;
    this.m_tutoriales = dispensacion;
};

 
TutorialesEvents.$inject = ["socket", "m_tutoriales"];

module.exports = TutorialesEvents;