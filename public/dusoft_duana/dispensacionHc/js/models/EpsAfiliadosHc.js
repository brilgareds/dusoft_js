
define(["angular", "js/models", "includes/classes/EpsAfiliados"], function (angular, models) {

    models.factory('EpsAfiliadosHc', ["EpsAfiliados", function (EpsAfiliados) {


            function EpsAfiliadosHc(afiliadoTipoId,afiliadoId,planAtencion) {                          
                EpsAfiliados.getClass().call(this,afiliadoTipoId,afiliadoId,planAtencion); 
                this.pacientes = [];
                this.planAtencion = [];
                
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
             
             
                
             EpsAfiliadosHc.prototype.agregarPlanAtencion = function(planAtencion){
                this.planAtencion.push(planAtencion);
             };
             
             EpsAfiliadosHc.prototype.mostrarPlanAtencion = function(){
                return this.planAtencion;
             };
             
             EpsAfiliadosHc.prototype.vaciarPlanAtencion = function () {
                this.planAtencion = [];
             };
             
            
            this.get = function (afiliadoTipoId,afiliadoId,planAtencion) {
                return new EpsAfiliadosHc(afiliadoTipoId,afiliadoId,planAtencion);
            };

            return this;

        }]);

});