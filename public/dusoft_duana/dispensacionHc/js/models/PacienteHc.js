
define(["angular", "js/models", "includes/classes/Paciente"], function (angular, models) {

    models.factory('PacienteHc', ["Paciente", function (Paciente) {


            function PacienteHc(tipoIdPaciente,pacienteId,apellidos,nombres) {
                            
                Paciente.getClass().call(this,tipoIdPaciente,pacienteId,apellidos,nombres);
                
                this.formulasHc = [];
                this.planAtencion = [];
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
                return this.formulasHc;
             };
             
             PacienteHc.prototype.vaciarFormulasHc = function () {
                this.formulasHc = [];
             };
             
             
             
             PacienteHc.prototype.agregarPlanAtencion = function(planAtencion){
                this.planAtencion.push(planAtencion);
             };
             
             PacienteHc.prototype.mostrarPlanAtencion = function(){
                return this.planAtencion;
             };
             
             PacienteHc.prototype.vaciarPlanAtencion = function () {
                this.planAtencion = [];
             };
             
             
            
            this.get = function (tipoIdPaciente,
                        pacienteId,apellidos,nombres) {
                return new PacienteHc(tipoIdPaciente,
                        pacienteId,apellidos,nombres);
            };

            return this;

        }]);

});