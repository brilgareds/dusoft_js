
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoFarmacia', ["Pedido", function(Pedido) {
            
        function PedidoFarmacia() {
            Pedido.getClass().call(this);
            this.productos = [];
            this.farmaciaDestino;
            this.farmaciaOrigen;
            this.tieneDespacho = false;
            this.despachoEmpresaId = "";
            this.despachoPrefijo = "";
            this.despachoNumero = 0;
            
        };

        PedidoFarmacia.prototype = Object.create(Pedido.getClass().prototype);

        PedidoFarmacia.prototype.setFarmaciaDestino = function(farmaciaDestino) {
            this.farmaciaDestino = farmaciaDestino;
        };
        
        PedidoFarmacia.prototype.getFarmaciaDestino = function() {
            return this.farmaciaDestino;
        };
        
        PedidoFarmacia.prototype.setFarmaciaOrigen = function(farmaciaOrigen) {
            this.farmaciaOrigen = farmaciaOrigen;
        };
        
        PedidoFarmacia.prototype.getFarmaciaOrigen = function() {
            return this.farmaciaOrigen;
        };

        PedidoFarmacia.prototype.agregarProducto = function(producto) {
            this.productos.unshift(producto);
        };

        PedidoFarmacia.prototype.obtenerProductos = function() {
            return this.productos;
        };
        
        PedidoFarmacia.prototype.eliminarProducto = function(index) {
            return this.productos.splice(index,1);
        };
        
        PedidoFarmacia.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        
        PedidoFarmacia.prototype.setTieneDespacho = function(tieneDespacho) {
            this.tieneDespacho = tieneDespacho;
            return this;
        };
        
        PedidoFarmacia.prototype.getTieneDespacho = function() {
            return this.tieneDespacho;
        };
        
        PedidoFarmacia.prototype.setDespachoEmpresaId = function(despachoEmpresaId) {
            this.despachoEmpresaId = despachoEmpresaId;
            return this;
        };
        
        PedidoFarmacia.prototype.getDespachoEmpresaId = function() {
            return this.despachoEmpresaId;
        };
        /**/
        PedidoFarmacia.prototype.setDespachoPrefijo = function(despachoPrefijo) {
            this.despachoPrefijo = despachoPrefijo;
            return this;
        };
        
        PedidoFarmacia.prototype.getDespachoPrefijo = function() {
            return this.despachoPrefijo;
        };
        /**/
        PedidoFarmacia.prototype.setDespachoNumero = function(despachoNumero) {
            this.despachoNumero = despachoNumero;
            return this;
        };
        
        PedidoFarmacia.prototype.getDespachoNumero = function() {
            return this.despachoNumero;
        };
        
        this.get = function() {
            return new PedidoFarmacia();
        };
                
        return this;
    }]);
});