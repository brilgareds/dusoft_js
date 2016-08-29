
define(["angular", "js/models", "includes/classes/Bodega"], function(angular, models) {

    models.factory('BodegaPedidoFarmacia', ["Bodega", function(Bodega) {
            
        function BodegaPedidoFarmacia(nombre, codigo) {
            Bodega.getClass().call(this, nombre, codigo);
        };

        BodegaPedidoFarmacia.prototype = Object.create(Bodega.getClass().prototype);

        
        this.get = function(nombre, codigo) {
            return new BodegaPedidoFarmacia(nombre,codigo);
        };
                
        return this;
    }]);
});