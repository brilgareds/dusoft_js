
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPedidoFarmacia', ["Empresa", function(Empresa) {

        var EmpresaPedidoFarmacia =  Object.create(Empresa.getClass().prototype);
        
        EmpresaPedidoFarmacia.farmacias = [];
        EmpresaPedidoFarmacia.pedidos = [];

        //Agregar farmacia
        EmpresaPedidoFarmacia.agregarFarmacias = function(farmacia){
            this.farmacias.push(farmacia);
        };
        
        EmpresaPedidoFarmacia.obtenerFarmacias = function(){
            return this.farmacias;
        };
        
        EmpresaPedidoFarmacia.vaciarFarmacias = function() {
            this.farmacias = [];
        };
        
        EmpresaPedidoFarmacia.obtenerPedidos = function() {
            return this.pedidos;
        };

        EmpresaPedidoFarmacia.agregarPedidoFarmacia = function(pedido) {
            this.pedidos.push(pedido);
        };
             
        EmpresaPedidoFarmacia.vaciarPedidos = function() {
            this.pedidos = [];
        };
        
        return EmpresaPedidoFarmacia;

    }]);
});