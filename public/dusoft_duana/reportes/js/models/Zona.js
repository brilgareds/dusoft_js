
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
        
        Zona.prototype.setNombreBodegas = function(nombreBodega,empresa,centroUtilidad,bodega){
//            var bodegas={
//                nombreBodega:nombreBodega,
//                empresa:empresa,
//                centroUtilidad:centroUtilidad,
//                bodega:bodega
//            };
            this.nombreBodegas.push({
                nombreBodega:nombreBodega,
                empresa:empresa,
                centroUtilidad:centroUtilidad,
                bodega:bodega
            });
        };
        
        Zona.prototype.setNombreBodegas = function(){
        	this.nombreBodegas;
        };
        
        this.get = function() {
            return new Zona();
        };

        return this;
    }]);    
});