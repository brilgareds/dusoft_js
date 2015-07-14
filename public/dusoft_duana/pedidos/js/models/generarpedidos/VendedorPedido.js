
define(["angular", "js/models", "includes/classes/Vendedor"], function(angular, models) {

    models.factory('VendedorPedido', ["Vendedor", function(Vendedor) {

        function VendedorPedido(nombre, tipo_id, id, telefono) {
            Vendedor.getClass().call(this,nombre, tipo_id, id, telefono);

        };

        this.get = function(nombre, tipo_id, id, telefono) {
            return new VendedorPedido(nombre, tipo_id, id, telefono);
        };

        VendedorPedido.prototype = Object.create(Vendedor.getClass().prototype);
        
        return this;

    }]);
});