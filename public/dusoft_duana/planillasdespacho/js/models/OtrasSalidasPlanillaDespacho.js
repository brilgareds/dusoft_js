define(["angular", "js/models"], function(angular, models) {

    models.factory('OtrasSalidasPlanillaDespacho', ["ClientePlanillaDespacho",function(ClientePlanillaDespacho) {

        function OtrasSalidasPlanillaDespacho(nombre){
            this.nombre = nombre;
        }
        
        OtrasSalidasPlanillaDespacho.prototype = Object.create(ClientePlanillaDespacho.getClass().prototype);
        
        OtrasSalidasPlanillaDespacho.prototype.setNombre = function(nombre){
            this.nombre = nombre;
        };
        
        OtrasSalidasPlanillaDespacho.prototype.getNombre = function(){
            return this.nombre;
        };
        
        this.get = function(nombre){
            return new OtrasSalidasPlanillaDespacho(nombre);
        };
        
        return this;
    }]);
});