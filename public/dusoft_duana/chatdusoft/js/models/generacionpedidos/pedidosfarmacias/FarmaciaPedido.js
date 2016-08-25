
define(["angular", "js/models", "includes/classes/Farmacia"], function(angular, models) {

    models.factory('FarmaciaPedido', ["Farmacia", function(Farmacia) {
            
        function FarmaciaPedido(farmacia_id, bodega, nombre_farmacia) {
            Farmacia.getClass().call(this, farmacia_id, bodega, nombre_farmacia);
            this.centrosUtilidad = [];
            this.centroUtilidadSeleccionado;            
        };

        FarmaciaPedido.prototype = Object.create(Farmacia.getClass().prototype);

        FarmaciaPedido.prototype.setCentroUtilidadSeleccionado = function(centro) {
            this.centroUtilidadSeleccionado = centro;
            return this;
        };

        FarmaciaPedido.prototype.getCentroUtilidadSeleccionado = function() {
            return this.centroUtilidadSeleccionado;
        };
        
        FarmaciaPedido.prototype.obtenerCentrosUtilidad = function() {
            return this.centrosUtilidad;
        };

        FarmaciaPedido.prototype.agregarCentroUtilidad = function(centro) {
            this.centrosUtilidad.push(centro);
        };
             
        FarmaciaPedido.prototype.vaciarCentrosUtilidad = function() {
            this.centrosUtilidad = [];
        };
        
        this.get = function(farmacia_id, bodega, nombre_farmacia) {
            return new FarmaciaPedido(farmacia_id, bodega, nombre_farmacia);
        };
                
        return this;
    }]);
});