define(["angular", "js/models","includes/classes/Cliente"], function(angular, models) {

    models.factory('TerceroOrdenCompra', ["Cliente", "$filter", function(Cliente, $filter) {

        function TerceroOrdenCompra(nombre, direccion, tipo_id, id, telefono) {
                Cliente.getClass().call(this, nombre, direccion, tipo_id, id, telefono);               
                
            }

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
                return new TerceroOrdenCompra(nombre, direccion, tipo_id, id, telefono);
            };

        TerceroOrdenCompra.prototype = Object.create(Cliente.getClass().prototype);
        
        this.getClass = function(){
            return TerceroOrdenCompra;
        };

        return this;

    }]);
});