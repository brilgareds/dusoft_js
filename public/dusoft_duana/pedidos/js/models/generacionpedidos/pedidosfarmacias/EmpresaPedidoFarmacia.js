
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPedidoFarmacia', ["Empresa", function(Empresa) {
            
        function EmpresaPedidoFarmacia(nombre, codigo){
            Empresa.getClass().call(this, nombre, codigo);
            this.farmacias = [];
            this.pedidos = [];
        }

        EmpresaPedidoFarmacia.prototype =  Object.create(Empresa.getClass().prototype);
        

        //Agregar farmacia
        EmpresaPedidoFarmacia.prototype.agregarFarmacias = function(farmacia){
            this.farmacias.push(farmacia);
        };
        
        EmpresaPedidoFarmacia.prototype.obtenerFarmacias = function(){
            return this.farmacias;
        };
        
        EmpresaPedidoFarmacia.prototype.vaciarFarmacias = function() {
            this.farmacias = [];
        };
        
        EmpresaPedidoFarmacia.prototype.obtenerPedidos = function() {
            return this.pedidos;
        };

        EmpresaPedidoFarmacia.prototype.agregarPedido = function(pedido) {
            this.pedidos.push(pedido);
        };
             
        EmpresaPedidoFarmacia.prototype.vaciarPedidos = function() {
            this.pedidos = [];
        };
        
        EmpresaPedidoFarmacia.prototype.eliminarPedido = function(index) {
            return this.pedidos.splice(index,1);
        };
        
        this.get = function(nombre, codigo) {
            return new EmpresaPedidoFarmacia(nombre, codigo);
        };
               
        
        return this;

    }]);
});