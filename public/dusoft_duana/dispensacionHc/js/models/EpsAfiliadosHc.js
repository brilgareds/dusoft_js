
define(["angular", "js/models", "includes/classes/EpsAfiliados"], function (angular, models) {

    models.factory('EpsAfiliadosHc', ["EpsAfiliados", function (EpsAfiliados) {


            function EpsAfiliadosHc(afiliadoTipoId,afiliadoId,planAtencion) {                          
                EpsAfiliados.getClass().call(this,afiliadoTipoId,afiliadoId,planAtencion); 
                this.pacientes = [];
                
            }
            
            EpsAfiliadosHc.prototype = Object.create(EpsAfiliados.getClass().prototype);
            
            
             EpsAfiliadosHc.prototype.agregarPacientes = function(paciente){
                this.pacientes.push(paciente);
             };
             
             EpsAfiliadosHc.prototype.mostrarPacientes = function(){
                return this.pacientes;
             };
             
             EpsAfiliadosHc.prototype.vaciarPacientes = function () {
                this.pacientes = [];
             };
             
             
             
           
            
            
            this.get = function (afiliadoTipoId,afiliadoId,planAtencion) {
                return new EpsAfiliadosHc(afiliadoTipoId,afiliadoId,planAtencion);
            };

            return this;

        }]);

});