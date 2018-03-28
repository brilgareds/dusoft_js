define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoFactura', ["Producto", function (Producto) {

            function ProductoFactura(codigo, nombre, tipoProducto, lote, torre, fecha_vencmiento, cantidad, item_id, iva, valorU, cantidad_ingresada) {

                Producto.getClass().call(this, codigo, nombre);

                this.tipoProducto = tipoProducto;
                this.torre = torre;
                this.cantidad = cantidad;
                this.cantidad_ingresada = cantidad_ingresada || 0;
                this.item_id = item_id;
                this.iva = iva || 0;
                this.valorU = valorU;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
            }

            ProductoFactura.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, tipoProducto, lote, torre, fecha_vencmiento, cantidad, item_id, iva, valorU, cantidad_ingresada) {
                return new ProductoFactura(codigo, nombre, tipoProducto, lote, torre, fecha_vencmiento, cantidad, item_id, iva, valorU, cantidad_ingresada);
            };

            ProductoFactura.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoFactura.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };

            ProductoFactura.prototype.getCantidadIngresada = function () {
                return this.cantidad_ingresada;
            };

            ProductoFactura.prototype.setCantidadIngresada = function (cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
            };
            
            ProductoFactura.prototype.getCantidadResta = function () {
                return this.cantidad_resta;
            };

            ProductoFactura.prototype.setCantidadResta = function (cantidad_resta) {
                this.cantidad_resta = cantidad_resta;
            };

            ProductoFactura.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoFactura.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };

            ProductoFactura.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoFactura.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoFactura.prototype.setIva = function (iva) {
                this.iva = iva;
            };

            ProductoFactura.prototype.getIva = function () {
                return this.iva;
            };

            ProductoFactura.prototype.setValorU = function (valorU) {
                this.valorU = valorU;
            };

            ProductoFactura.prototype.getValorU = function () {
                return this.valorU;
            };

            ProductoFactura.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoFactura.prototype.get_lote = function () {
                return this.lote;
            };
            
            ProductoFactura.prototype.setTorre = function (torre) {
                this.torre = torre;
            };

            ProductoFactura.prototype.getTorre = function () {
                return this.torre;
            };
            
            ProductoFactura.prototype.setCostoTotal = function (costoTotal) {
                this.costoTotal = costoTotal;
            };

            ProductoFactura.prototype.getCostoTotal = function () {
                return this.costoTotal;
            };

            return this;
        }]);
});