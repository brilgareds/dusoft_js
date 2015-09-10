
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('PedidoAuditoria', ["Pedido", function(Pedido) {


        //declare usermodel class
        function PedidoAuditoria() {
            /*this.cliente;
            this.farmacia;*/
            this.productos = [];
            this.tipo = 1;
            this.TIPO_CLIENTE  = 1;
            this.TIPO_FARMACIA = 2;
            this.tiempoSeparacion = 0;
            this.cantidadProductos = 0;
            this.farmaciaId;
        }

         PedidoAuditoria.prototype = Object.create(Pedido.getClass().prototype);

        // Pedidos
        
        PedidoAuditoria.prototype.agregarProducto = function(producto, validar_existencia) {
            
            if(validar_existencia){ 
                for(var i in this.productos){
                    var _producto = this.productos[i];
                    
                    if(_producto.codigo_producto === producto.codigo_producto){
                        return false;
                    }
                }                
            }
            
            this.productos.push(producto);
        };

        PedidoAuditoria.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        PedidoAuditoria.prototype.getProductos = function() {
            return this.productos;
        };
        
        
        PedidoAuditoria.prototype.setProductos = function(productos) {
            this.productos = productos;
        };
        
        PedidoAuditoria.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        PedidoAuditoria.prototype.setTiempoSeparacion = function(tiempoSeparacion) {
            this.tiempoSeparacion = tiempoSeparacion;
        };
        
        PedidoAuditoria.prototype.getTiempoSeparacion = function() {
            return this.tiempoSeparacion;
        };
        
        
        PedidoAuditoria.prototype.setFarmaciaId = function(farmaciaId) {
            this.farmaciaId = farmaciaId;
            return this;
        };
        
        PedidoAuditoria.prototype.getFarmaciaId = function() {
            return this.farmaciaId;
        };
        
        
        PedidoAuditoria.prototype.setProductos = function(productos) {
            this.productos = productos;
            return this;
        };
        
        PedidoAuditoria.prototype.getProductos = function() {
            return this.productos;
        };
        
        PedidoAuditoria.prototype.setCantidadProductos = function(cantidadProductos) {
            this.cantidadProductos = cantidadProductos;
            return this;
        };
        
        PedidoAuditoria.prototype.getCantidadProductos = function() {
            return this.cantidadProductos;
        };
        
        PedidoAuditoria.prototype.agregarDetallePedido = function(modeloProducto, productos) {
            for(var i in productos){
                var _producto = productos[i];
                var producto = modeloProducto.get(_producto.codigo_producto, _producto.descripcion_producto);
                var cantidadPendiente =  Number(_producto.cantidad_pendiente);
                			
                if(cantidadPendiente > 0){
                    producto.setCantidadSolicitada(Number(_producto.cantidad_solicitada));
                    producto.setCantidadPendiente(cantidadPendiente);
                    producto.setJustificacion(_producto.justificacion);

                    if(_producto.valor_iva){
                        producto.setValorIva(parseFloat(_producto.valor_iva));
                        producto.setValorUnitarioConIva(parseFloat(_producto.valor_unitario_con_iva));
                        producto.setValorUnitario(parseFloat(_producto.valor_unitario));
                        producto.setPorcentajeGravament(parseFloat(_producto.porcentaje_iva));
                    }

                    this.agregarProducto(producto); 
                } 
            }
        };
        
        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new PedidoAuditoria();
        };

        //just return the factory wrapper
        return this;

    }]);
});