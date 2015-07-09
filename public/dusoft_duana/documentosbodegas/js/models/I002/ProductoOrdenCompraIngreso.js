define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoOrdenCompraIngreso', ["Producto", function(Producto) {

            function ProductoOrdenCompraIngreso(codigo, nombre, valor_unitario, lote, fecha_vencmiento) {

                Producto.getClass().call(this, codigo, nombre);

                this.iva = iva;
                this.valor_unitario = valor_unitario || 0;
                this.lote = lote || "";
                this.fecha_vencmiento = fecha_vencmiento || "";
                this.autorizado = true;
            }

            ProductoOrdenCompraIngreso.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, valor_unitario, lote, fecha_vencmiento) {
                return new ProductoOrdenCompraIngreso(codigo, nombre, valor_unitario, lote, fecha_vencmiento);
            };

            // IVA
            ProductoOrdenCompraIngreso.prototype.get_iva = function() {
                return parseFloat(this.iva).toFixed(2);
            };

            // Valor Unitario
            ProductoOrdenCompraIngreso.prototype.get_valor_unitario = function() {
                return this.valor_unitario;
            };

            // Lote
            ProductoOrdenCompraIngreso.prototype.get_lote = function() {
                return this.lote;
            };

            // Fecha vencimiento
            ProductoOrdenCompraIngreso.prototype.get_fecha_vencmiento = function() {
                return this.fecha_vencmiento;
            };

            // Cantidad Solicitada (Cantidad que se solicito en la orden de compra
            ProductoOrdenCompraIngreso.prototype.set_cantidad_solicitada = function(cantidad_solicitada) {
                this.cantidad_solicitada = cantidad_solicitada;
                return this;
            };

            ProductoOrdenCompraIngreso.prototype.get_cantidad_solicitada = function() {
                return this.cantidad_solicitada;
            };

            // Cantidad Ingresada (Cantidad que se va a ingresar a la bodega )
            ProductoOrdenCompraIngreso.prototype.set_cantidad_ingresada = function(cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
                return this;
            };

            ProductoOrdenCompraIngreso.prototype.get_cantidad_ingresada = function() {
                return this.cantidad_ingresada;
            };

            // Cantidad Seleccionada (Cantidad que solicitada que necesita ser autoriazada )
            ProductoOrdenCompraIngreso.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.autorizado = false;
                this.cantidad_seleccionada = cantidad_seleccionada;
                return this;
            };

            ProductoOrdenCompraIngreso.prototype.get_cantidad_seleccionada = function() {
                return this.cantidad_seleccionada;
            };

            // Justificacion (Cantidad que solicitada que necesita ser autoriazada y justificada)
            ProductoOrdenCompraIngreso.prototype.set_justificacion = function(justificacion) {
                this.justificacion = justificacion;
                return this;
            };

            ProductoOrdenCompraIngreso.prototype.get_justificacion = function() {
                return this.justificacion;
            };

            // Validar si tiene autorizacion
            ProductoOrdenCompraIngreso.prototype.get_autorizacion = function() {
                return this.autorizado;
            };

            // Total 
            ProductoOrdenCompraIngreso.prototype.set_total = function(total) {
                this.total = total;
                return this;
            };

            ProductoOrdenCompraIngreso.prototype.get_total = function() {
                return this.total;
            };

            return this;
        }]);
});