
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPlanillaFarmacia', ["Empresa", function(Empresa) {
            
       
       function EmpresaPlanillaFarmacia(nombre, codigo) {
            Empresa.getClass().call(this, nombre, codigo);
            
        };

         EmpresaPlanillaFarmacia.prototype =  Object.create(Empresa.getClass().prototype);
         
       
        this.get = function(nombre, codigo) {
            return new EmpresaPlanillaFarmacia(nombre, codigo);
        };

        return this;

    }]);

});