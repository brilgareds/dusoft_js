
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
            this.productoSeleccionado;
            this.productosSeleccionados = [];
            this.esTemporal = false;
            this.valido = false;
            this.tipoPedido;
            
            //0 = ver , 1 = modificacion y 2 = modificacion especial
            this.tipoModificacion = '0';
            
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

        PedidoFarmacia.prototype.obtenerProductos = function() {
            return this.productos;
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
        
        PedidoFarmacia.prototype.setProductoSeleccionado = function(productoSeleccionado) {
            this.productoSeleccionado = productoSeleccionado;
            return this;
        };
        
        PedidoFarmacia.prototype.getProductoSeleccionado = function() {
            return this.productoSeleccionado;
        };
        
        PedidoFarmacia.prototype.setProductosSeleccionados = function(productosSeleccionados) {
            this.productosSeleccionados = productosSeleccionados;
            return this;
        };
        
        PedidoFarmacia.prototype.getProductosSeleccionados = function() {
            return this.productosSeleccionados;
        };
        
        PedidoFarmacia.prototype.setEsTemporal = function(esTemporal) {
            this.esTemporal = esTemporal;
            return this;
        };
        
        PedidoFarmacia.prototype.getEsTemporal = function() {
            return this.esTemporal;
        };
        
        PedidoFarmacia.prototype.setTipoPedido = function(tipoPedido) {
            this.tipoPedido = tipoPedido;
            return this;
        };
        
        PedidoFarmacia.prototype.getTipoPedido = function() {
            return this.tipoPedido;
        };
        
        
        PedidoFarmacia.prototype.setTipoModificacion = function(tipoModificacion) {
            this.tipoModificacion = tipoModificacion;
            return this;
        };
        
        PedidoFarmacia.prototype.getTipoModificacion = function() {
            return this.tipoModificacion;
        };
        
        
        PedidoFarmacia.prototype.eliminarProducto = function(index) {
            this.productos.splice(index,1);
        };
        
        PedidoFarmacia.prototype.eliminarProductoSeleccionado = function(index) {
            this.productosSeleccionados.splice(index,1);
        };
        
        PedidoFarmacia.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        PedidoFarmacia.prototype.agregarProducto = function(producto) {
            this.productos.unshift(producto);
        };
        
        PedidoFarmacia.prototype.agregarProductoSeleccionado = function(producto) {
            
            if(!this.esProductoSeleccionado(producto)){
                this.productosSeleccionados.unshift(producto);
            }
            
        };
        
        PedidoFarmacia.prototype.esProductoSeleccionado = function(producto) {
            for(var i in this.productosSeleccionados){
                var _producto = this.productosSeleccionados[i];
                
                if(_producto.getCodigoProducto() === producto.getCodigoProducto()){
                    _producto.setCantidadPendiente(_producto.getCantidadPendiente() + producto.getCantidadPendiente());
                    return true;
                }
            }

            return false;
        };
        
        PedidoFarmacia.prototype.validarTipoProductoAIngresar = function(producto) {
            for(var i in this.productosSeleccionados){
                var _producto = this.productosSeleccionados[i];
                
                if(_producto.getTipoProductoId() !== producto.getTipoProductoId()){
                    return false;
                }
            }

            return true;
        };
        
        PedidoFarmacia.prototype.vaciarProductosSeleccionados = function() {
            this.productosSeleccionados = [];
        };
        
       PedidoFarmacia.prototype.setValido = function(valido) {
            this.valido = valido;
            return this;
        };
        
        PedidoFarmacia.prototype.getValido = function() {
            return this.valido;
        };
        
        this.get = function() {
            return new PedidoFarmacia();
        };
                
        return this;
    }]);
});