
define(["angular", "js/models"], function(angular, models) {

    models.factory('Pendiente',["$filter", function($filter) {

        function Pendiente(fecha_registro) {
            this.fecha_registro = $filter('date')(fecha_registro,'yyyy-MM-dd');
            this.pedido;
        };

        Pendiente.prototype.setPedido = function(pedido){
        	this.pedido = pedido;
        };

        Pendiente.prototype.setOrden = function(orden){
            this.orden = orden;
        };

        this.get = function(fecha_registro) {
            return new Pendiente(fecha_registro);
        };

        return this;

    }]);

    
});