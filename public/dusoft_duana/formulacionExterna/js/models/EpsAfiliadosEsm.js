
define(["angular", "js/models", "includes/classes/EpsAfiliados"], function (angular, models) {

    models.factory('EpsAfiliadosEsm', ["EpsAfiliados", function (EpsAfiliados) {


            function EpsAfiliadosEsm(afiliadoTipoId,afiliadoId,planAtencion) {                          
                EpsAfiliados.getClass().call(this,afiliadoTipoId,afiliadoId,planAtencion); 
                this.pacientes = [];
                this.planAtencion = [];
                
            }
            
            EpsAfiliadosEsm.prototype = Object.create(EpsAfiliados.getClass().prototype);
            
            
             EpsAfiliadosEsm.prototype.agregarPacientes = function(paciente){
                this.pacientes.push(paciente);
             };
             
             EpsAfiliadosEsm.prototype.mostrarPacientes = function(){
                return this.pacientes;
             };
             
             EpsAfiliadosEsm.prototype.vaciarPacientes = function () {
                this.pacientes = [];
             };
             
             
                
             EpsAfiliadosEsm.prototype.agregarPlanAtencion = function(planAtencion){
                this.planAtencion.push(planAtencion);
             };
             
             EpsAfiliadosEsm.prototype.mostrarPlanAtencion = function(){
                return this.planAtencion;
             };
             
             EpsAfiliadosEsm.prototype.vaciarPlanAtencion = function () {
                this.planAtencion = [];
             };
             
            
            this.get = function (afiliadoTipoId,afiliadoId,planAtencion) {
                return new EpsAfiliadosEsm(afiliadoTipoId,afiliadoId,planAtencion);
            };

            return this;

        }]);

});