
define(["angular", "js/models", "includes/classes/Paciente"], function (angular, models) {

    models.factory('PacienteHc', ["Paciente", function (Paciente) {


            function PacienteHc(tipoIdPaciente,
                        pacienteId,apellidos,nombres) {
                            
                Paciente.getClass().call(this,tipoIdPaciente,
                        pacienteId,apellidos,nombres);
                
                this.formulasHc = [];
            }
            
            PacienteHc.prototype = Object.create(Paciente.getClass().prototype);
            
             PacienteHc.prototype.setMedico = function(medico){
                return this.medico = medico;
             };

             PacienteHc.prototype.setTipoBloqueoId = function(tipoBloqueoId){
                return this.tipoBloqueoId = tipoBloqueoId;
             };

             PacienteHc.prototype.setBloqueo = function(bloqueo){
                return this.bloqueo = bloqueo;
             };
             
             
             PacienteHc.prototype.getMedico = function(){
                 return this.medico;
             };
        
             PacienteHc.prototype.getTipoBloqueoId = function(){
                 return this.tipoBloqueoId;
             };
        
             PacienteHc.prototype.getBloqueo = function(){
                return this.bloqueo;
             };
        
             PacienteHc.prototype.agregarFormulas = function(formula){
                this.formulasHc.push(formula);
             };
             
             PacienteHc.prototype.mostrarFormulas = function(){
                this.formulasHc;
             };
             
             PacienteHc.prototype.vaciarFormulasHc = function () {
                this.formulasHc = [];
             };
            
            this.get = function (tipoIdPaciente,
                        pacienteId,apellidos,nombres) {
                return new PacienteHc(tipoIdPaciente,
                        pacienteId,apellidos,nombres);
            };

            return this;

        }]);

});