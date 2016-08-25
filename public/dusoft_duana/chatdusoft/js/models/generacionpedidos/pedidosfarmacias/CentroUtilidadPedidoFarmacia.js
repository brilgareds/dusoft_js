
define(["angular", "js/models", "includes/classes/Farmacia"], function(angular, models) {

    models.factory('CentroUtilidadPedidoFarmacia', ["CentroUtilidad", function(CentroUtilidad) {
            
        function CentroUtilidadPedidoFarmacia(nombre, codigo) {
            CentroUtilidad.getClass().call(this, nombre, codigo);
            this.bodegas = [];
        };

        CentroUtilidadPedidoFarmacia.prototype = Object.create(CentroUtilidad.getClass().prototype);

        
        CentroUtilidadPedidoFarmacia.prototype.obtenerBodegas = function() {
            return this.bodegas;
        };

        CentroUtilidadPedidoFarmacia.prototype.agregarBodega = function(bodega) {
            this.bodegas.push(bodega);
        };
             
        CentroUtilidadPedidoFarmacia.prototype.vaciarBodegas = function() {
            this.bodegas = [];
        };
        
        this.get = function(nombre, codigo) {
            return new CentroUtilidadPedidoFarmacia(nombre,codigo);
        };
                
        return this;
    }]);
});