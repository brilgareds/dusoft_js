
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
        
        Zona.prototype.setNombreBodegas = function(nombreBodega){
        	this.nombreBodegas.push(nombreBodega);
        };
        
        Zona.prototype.setNombreBodegas = function(){
        	this.nombreBodegas;
        };
        
        Zona.prototype.setNombreBodega = function(nombreBodega){
        	this.nombreBodega = nombreBodega;
        };
        
        Zona.prototype.getNombreBodega = function(){
        	return this.nombreBodega;
        };

        Zona.prototype.setEmpresa = function(empresa){
            this.empresa = empresa;
        };
        
        Zona.prototype.getEmpresa = function(){
            return this.empresa;
        };
        
        Zona.prototype.setCentroUtilidad = function(centroUtilidad){
            this.centroUtilidad = centroUtilidad;
        };
        
         Zona.prototype.getCentroUtilidad = function(){
        	return this.centroUtilidad;
        };
        
        Zona.prototype.setBodega = function(bodega){
            this.bodega = bodega;
        };
        
        Zona.prototype.getBodega = function(){
        	return this.bodega;
        };

        this.get = function() {
            return new Zona();
        };

        return this;
    }]);    
});