
define(["angular", "js/models"], function(angular, models) {

    models.factory('Paciente', function() {

        function Paciente(tipoIdPaciente,
                        pacienteId,apellidos,nombres
                        ) {
            
            this.tipoIdPaciente = tipoIdPaciente || "";
            this.pacienteId = pacienteId || "";
            this.apellidos = apellidos || "";
            this.nombres = nombres || "";
            this.edad;
            this.residenciaDireccion;
            this.residenciaTelefono;
            this.sexo;
           
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
        
        Paciente.prototype.setEdad = function(edad){
            return this.edad=edad;
        };
       
        Paciente.prototype.getEdad = function(){
            return this.edad;
        };
        
        Paciente.prototype.setResidenciaDireccion = function(residenciaDireccion){
            return this.residenciaDireccion=residenciaDireccion;
        };
       
        Paciente.prototype.getResidenciaDireccion = function(){
            return this.residenciaDireccion;
        };
        
        Paciente.prototype.setResidenciaTelefono = function(residenciaTelefono){
            return this.residenciaTelefono=residenciaTelefono;
        };
       
        Paciente.prototype.getResidenciaTelefono = function(){
            return this.residenciaTelefono;
        };
        
        Paciente.prototype.setSexo = function(sexo){
            return this.sexo=sexo;
        };
       
        Paciente.prototype.getSexo = function(){
            return this.sexo;
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