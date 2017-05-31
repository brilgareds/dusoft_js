
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models, Producto) {

    models.factory('ProductoMovimiento', ["Producto", function(Producto) {

            function ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva, descuadre) {
                //constructor padre
                Producto.getClass().call(this, codigo, nombre, existencia);

                this.movimientos = [];
                this.pendientesFarmacia = [];
                this.pendientesClientes = [];
                this.pendientesOrdenes = [];
                this.precio = precio;
                this.existencia_total = existencia_total;
                this.costo = costo;
                this.costo_ultima_compra = costo_ultima_compra;
                this.porc_iva = porc_iva;
                this.descuadre = descuadre;
                this.tipoProducto;
                this.precioContratacion;
                this.codigoCum;
                this.precioRegulado = 0;
                this.descripcionMolecula = "";
                this.codigoInvima = "";
                this.existenciaMinima = 0;
                this.existenciaMaxima = 0;
                
                this.codigoMedipol = "";
                this.descripcionCodigoMedipol = "";
            }

            //herencia
            ProductoMovimiento.prototype = Object.create(Producto.getClass().prototype);

            ProductoMovimiento.prototype.agregarMovimiento = function(movimiento) {
                this.movimientos.push(movimiento);
            };

            ProductoMovimiento.prototype.getMovimientos = function() {
                return this.movimientos;
            };


            ProductoMovimiento.prototype.agregarPendienteFarmacia = function(pendiente) {
                this.pendientesFarmacia.push(pendiente);
            };

            ProductoMovimiento.prototype.getPendientesFarmacia = function(pendiente) {
                return this.pendientesFarmacia;
            };

            ProductoMovimiento.prototype.setDescuadre = function(descuadre) {
                this.descuadre = descuadre;
            };
            
            ProductoMovimiento.prototype.setCodigoCum = function(codigoCum) {
                return this.codigoCum = codigoCum;
            };
            
            ProductoMovimiento.prototype.setCodigoInvima = function(codigoInvima) {
                return this.codigoInvima = codigoInvima;
            };
            
            
            ProductoMovimiento.prototype.setExistenciaMinima = function(existenciaMinima) {
                this.existenciaMinima = existenciaMinima;
            };
            
            ProductoMovimiento.prototype.getExistenciaMinima = function(existenciaMinima) {
                return this.existenciaMinima;
            };
            
            
            ProductoMovimiento.prototype.setExistenciaMaxima = function(existenciaMaxima) {
                this.existenciaMaxima = existenciaMaxima;
            };
            
            ProductoMovimiento.prototype.getExistenciaMaxima = function(existenciaMaxima) {
                return this.existenciaMaxima = existenciaMaxima;
            };
 
            ProductoMovimiento.prototype.setCodigoInvima = function(codigoInvima) {
                return this.codigoInvima = codigoInvima;
            };
            
            ProductoMovimiento.prototype.agregarPendienteCliente = function(pendiente) {
                this.pendientesClientes.push(pendiente);
            };

            ProductoMovimiento.prototype.getPendientesClientes = function() {
                return this.pendientesClientes;
            };

            ProductoMovimiento.prototype.agregarPendienteOrden = function(pendiente) {
                this.pendientesOrdenes.push(pendiente);
            };

            ProductoMovimiento.prototype.getPendientesOrdenes = function() {
                return this.pendientesOrdenes;
            };


            ProductoMovimiento.prototype.setTipoProductoId = function(tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoMovimiento.prototype.getTipoProductoId = function() {
                return this.tipoProducto;
            };

            ProductoMovimiento.prototype.setPrecioContratacion = function(precioContratacion) {
                this.precioContratacion = precioContratacion;
            };

            ProductoMovimiento.prototype.getPrecioContratacion = function() {
                return this.precioContratacion;
            };
            
            ProductoMovimiento.prototype.getCodigoCum = function() {
                return this.codigoCum;
            };
            
            ProductoMovimiento.prototype.setPrecioRegulado = function(precioRegulado) {
                return this.precioRegulado = precioRegulado;
            };
            
            
            ProductoMovimiento.prototype.getDescripcionMolecula = function() {
                return this.descripcionMolecula;
            };
            
            ProductoMovimiento.prototype.setDescripcionMolecula = function(descripcionMolecula) {
                return this.descripcionMolecula = descripcionMolecula;
            };
               
            ProductoMovimiento.prototype.getCodigoMedipol = function() {
                return this.codigoMedipol;
            };
            
            ProductoMovimiento.prototype.setCodigoMedipol = function(codigoMedipol) {
                this.codigoMedipol = codigoMedipol;
                return this;
            };   
            
            ProductoMovimiento.prototype.getDescripcionCodigoMedipol = function() {
                return this.descripcionCodigoMedipol;
            };
            
            ProductoMovimiento.prototype.setDescripcionCodigoMedipol = function(descripcionCodigoMedipol) {
                this.descripcionCodigoMedipol = descripcionCodigoMedipol;
                return this;
            };  
            
            this.get = function(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva) {
                return new ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva);
            };

            return this;
        }]);
});