define(["angular", "js/models","includes/classes/Bodega"], function(angular, models) {

    models.factory('BodegaOrdenCompra', ["Bodega", function(Bodega) {

        function BodegaOrdenCompra(nombre, codigo) {
            
            Bodega.getClass().call(this,nombre, codigo);
            this.ubicacion = "";
            this.empresaId = "";
            this.centroUtilidad = "";
           
        };

        this.get = function(nombre, codigo) {

            return new BodegaOrdenCompra(nombre, codigo);
        };

        BodegaOrdenCompra.prototype = Object.create(Bodega.getClass().prototype);
        
        BodegaOrdenCompra.prototype.setUbicacion = function(ubicacion) {
            this.ubicacion = ubicacion;
            return this;
        };
            
        BodegaOrdenCompra.prototype.getUbicacion = function() {
            return this.ubicacion;
        };

        BodegaOrdenCompra.prototype.setEmpresaId = function(empresaId) {
            this.empresaId = empresaId;
            return this;
        };

        BodegaOrdenCompra.prototype.getEmpresaId = function() {
            this.empresaId;
        };

        BodegaOrdenCompra.prototype.setCentroUtilidad = function(centroUtilidad) {
            this.centroUtilidad = centroUtilidad;
            return this;
        };

        BodegaOrdenCompra.prototype.getCentroUtilidad = function() {
            return this.centroUtilidad;
        };

        this.getClass = function(){
            return BodegaOrdenCompra;
        };

        return this;

    }]);
});