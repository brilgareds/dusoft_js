define(["angular", "js/models"], function(angular, models) {

    models.factory('OtrasSalidasPlanillaDespacho', [function() {

        function OtrasSalidasPlanillaDespacho(nombre){
            this.nombre = nombre;
        }
        
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