define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoIngreso', ["Producto", function(Producto) {

            function ProductoIngreso(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento) {

                Producto.getClass().call(this, codigo, nombre);

                this.iva = iva;
                this.valor_unitario = valor_unitario || 0;
                this.lote = lote || "";
                this.fecha_vencmiento = fecha_vencmiento || "";
                this.autorizado = true;
            }

            ProductoIngreso.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento) {
                return new ProductoIngreso(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento);
            };

            // IVA
            ProductoIngreso.prototype.get_iva = function() {
                return parseFloat(this.iva).toFixed(2);
            };

            // Valor Unitario
            ProductoIngreso.prototype.get_valor_unitario = function() {
                return this.valor_unitario;
            };

            // Lote
            ProductoIngreso.prototype.get_lote = function() {
                return this.lote;
            };

            // Fecha vencimiento
            ProductoIngreso.prototype.get_fecha_vencmiento = function() {
                return this.fecha_vencmiento;
            };

            // Cantidad Solicitada (Cantidad que se solicito en la orden de compra
            ProductoIngreso.prototype.set_cantidad_solicitada = function(cantidad_solicitada) {
                this.cantidad_solicitada = cantidad_solicitada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_solicitada = function() {
                return this.cantidad_solicitada;
            };

            // Cantidad Ingresada (Cantidad que se va a ingresar a la bodega )
            ProductoIngreso.prototype.set_cantidad_ingresada = function(cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_ingresada = function() {
                return this.cantidad_ingresada;
            };

            // Cantidad Seleccionada (Cantidad que solicitada que necesita ser autoriazada )
            ProductoIngreso.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.autorizado = false;
                this.cantidad_seleccionada = cantidad_seleccionada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_seleccionada = function() {
                return this.cantidad_seleccionada;
            };

            // Justificacion (Cantidad que solicitada que necesita ser autoriazada y justificada)
            ProductoIngreso.prototype.set_justificacion = function(justificacion) {
                this.justificacion = justificacion;
                return this;
            };

            ProductoIngreso.prototype.get_justificacion = function() {
                return this.justificacion;
            };

            // Validar si tiene autorizacion
            ProductoIngreso.prototype.get_autorizacion = function() {
                return this.autorizado;
            };

            // Total 
            ProductoIngreso.prototype.set_total = function(total) {
                this.total = total;
                return this;
            };

            ProductoIngreso.prototype.get_total = function() {
                return this.total;
            };

            return this;
        }]);
});