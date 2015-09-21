
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
            this.empresaDestino;
            this.centroDestino;
            this.bodegaDestino;
            this.temporalId = 0;
            this.productoSeleccionado = {};
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

        PedidoAuditoria.prototype.setTemporalId = function(temporalId) {
            this.temporalId = temporalId;
            return this;
        };
        
        PedidoAuditoria.prototype.getTemporalId = function() {
            return this.temporalId;
        };
        
        
        PedidoAuditoria.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
            return this;
        };
        
        PedidoAuditoria.prototype.getTipo = function() {
            return this.tipo;
        };
        
        
        PedidoAuditoria.prototype.setProductoSeleccionado = function(productoSeleccionado) {
            this.productoSeleccionado = productoSeleccionado;
        };
        
        PedidoAuditoria.prototype.getProductoSeleccionado = function() {
            return this.productoSeleccionado;
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
        
        PedidoAuditoria.prototype.setEmpresaDestino = function(empresaDestino) {
            this.empresaDestino = empresaDestino;
            return this;
        };
        
        PedidoAuditoria.prototype.getEmpresaDestino = function() {
            return this.empresaDestino;
        };   
        
        PedidoAuditoria.prototype.setCentroDestino = function(centroDestino) {
            this.centroDestino = centroDestino;
            return this;
        };
        
        PedidoAuditoria.prototype.getCentroDestino = function() {
            return this.centroDestino;
        };
        
        PedidoAuditoria.prototype.setBodegaDestino= function(bodegaDestino) {
            this.bodegaDestino = bodegaDestino;
            return this;
        };
        
        PedidoAuditoria.prototype.getBodegaDestino = function() {
            return this.bodegaDestino;
        };
                
        PedidoAuditoria.prototype.agregarDetallePedido = function(modeloProducto, productos, temporal, modeloLote) {
            for(var i in productos){
                var _producto = productos[i];
                var producto = modeloProducto.get(_producto.codigo_producto, _producto.descripcion_producto);
                var cantidadPendiente =  Number(_producto.cantidad_pendiente);
                producto.setCantidadSolicitada(Number(_producto.cantidad_solicitada));
                producto.setCantidadPendiente(cantidadPendiente);
                if(_producto.justificacion){
                     producto.setJustificacion(_producto.justificacion);
                }
                
                if(!temporal){
                    
                    if(cantidadPendiente > 0){
                        if(_producto.valor_iva){
                            producto.setValorIva(parseFloat(_producto.valor_iva));
                            producto.setValorUnitarioConIva(parseFloat(_producto.valor_unitario_con_iva));
                            producto.setValorUnitario(parseFloat(_producto.valor_unitario));
                            producto.setPorcentajeGravament(parseFloat(_producto.porcentaje_iva));
                        }
                        this.agregarProducto(producto); 
                        
                    } 
                } else {

                    producto.setItemId(parseInt(_producto.item_id));
                    producto.setValorIva(parseFloat(_producto.valor_iva));
                    
                    if(_producto.valor_unitario){
                         producto.setValorUnitario(parseFloat(_producto.valor_unitario));
                    }
                    
                    var lote =  modeloLote.get(_producto.lote, _producto.fecha_vencimiento);
                    lote.setCantidadIngresada(parseInt(_producto.cantidad_ingresada));
                    
                    producto.agregarLote(lote);
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