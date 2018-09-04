
define(["angular", "js/models"], function(angular, models) {

    models.factory('Zona',["$filter", function($filter) {

        function Zona() {
            this.nombreBodegas=[];
        };

        Zona.prototype.setNombreZona = function(nombreZona){
        	this.nombreZona = nombreZona;
        };
        
        Zona.prototype.getNombreZona= function(){
        	return this.nombreZona;
        };
        
        Zona.prototype.setNombreBodegas = function(bodegas){
           
            this.nombreBodegas.push(bodegas);
        };
        
        Zona.prototype.getNombreBodegas = function(){
        	this.nombreBodegas;
        };
        
        this.get = function() {
            return new Zona();
        };

        return this;
    }]);    
});