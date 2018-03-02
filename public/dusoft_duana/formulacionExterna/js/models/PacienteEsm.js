define(["angular", "js/models", "includes/classes/Paciente"], function(angular, models) {

    models.factory('PacienteEsm',["Paciente", function(Paciente) {
        
        function PacienteEsm(tipoIdPaciente,pacienteId,apellidos,nombres) {
            Paciente.getClass().call(this,tipoIdPaciente,pacienteId,apellidos,nombres);
            this.formulasHc = [];
        }
        
        PacienteEsm.prototype = Object.create(Paciente.getClass().prototype);

        PacienteEsm.prototype.setPlan = function(plan){
           return this.plan = plan;
        };

        PacienteEsm.prototype.getPlan = function () {
            return this.plan;
        };
        
        this.get = function (tipoIdPaciente, pacienteId, apellidos, nombres) {
            return new PacienteEsm(tipoIdPaciente, pacienteId, apellidos, nombres);
        };

        return this;

    }]);    
});