
define(["angular", "js/models"], function(angular, models) {

    models.factory('Paciente', function() {

        function Paciente(tipoIdPaciente,
                        pacienteId,apellidos,nombres
                        ) {
            
            this.tipoIdPaciente = tipoIdPaciente || "";
            this.pacienteId = pacienteId || "";
            this.apellidos = apellidos || "";
            this.nombres = nombres || "";
           
           
           
        };
        
        
       
        
      
        
       
        
        
        
        Paciente.prototype.getTipoIdPaciente = function(){
            return this.tipoIdPaciente;
        };
        
        Paciente.prototype.getPacienteId = function(){
            return this.pacienteId;
        };
        
        Paciente.prototype.getNombres = function(){
            return this.nombres;
        };
        
        Paciente.prototype.getApellidos = function(){
            return this.apellidos;
        };
        
        
       
        this.get = function(tipoIdPaciente,
                        pacienteId,apellidos,nombres) {
            return new Paciente(tipoIdPaciente,
                        pacienteId,apellidos,nombres);
        };

        this.getClass = function() {
            return Paciente;
        };

        return this;

    });
});