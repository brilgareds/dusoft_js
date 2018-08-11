define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoFacturas', ["Producto", function (Producto) {

            function ProductoFacturas(codigo, nombre, lote, cantidad, item_id, valor_unitario) {

                Producto.getClass().call(this, codigo, nombre);

                this.codigo = codigo;
                this.nombre = nombre;
                this.cantidad = cantidad;
                this.item_id = item_id;
                this.valor_unitario = valor_unitario;
                this.seleccionado = false;
               // this.cantidad_ingresada = 0;
                this.lote = lote || "";
            }

            ProductoFacturas.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, lote, cantidad, item_id, valor_unitario) {
                return new ProductoFacturas(codigo, nombre, lote, cantidad, item_id, valor_unitario);
            };

            ProductoFacturas.prototype.getCantidadIngresada = function () {
                return this.cantidad_ingresada;
            };

            ProductoFacturas.prototype.setCantidadIngresada = function (cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
            };

            ProductoFacturas.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoFacturas.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };

            ProductoFacturas.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoFacturas.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoFacturas.prototype.setObservacion = function (observacion) {
                this.observacion = observacion;
            };

            ProductoFacturas.prototype.getObservacion = function () {
                return this.observacion;
            };

            ProductoFacturas.prototype.setValorUnitario = function (valor_unitario) {
                this.valor_unitario = valor_unitario;
            };

            ProductoFacturas.prototype.getValorUnitario = function () {
                return this.valor_unitario;
            };

            ProductoFacturas.prototype.setTotalNota = function (total_nota) {
                this.total_nota = total_nota;
            };

            ProductoFacturas.prototype.getTotalNota = function () {
                return this.total_nota;
            };

            ProductoFacturas.prototype.setSeleccion = function (seleccion) {
                this.seleccionado = seleccion;
            };

            ProductoFacturas.prototype.getSeleccion = function () {
                return this.seleccionado;
            };

            ProductoFacturas.prototype.setPorcentajeIva = function (porc_iva) {
                this.porc_iva = porc_iva;
            };

            ProductoFacturas.prototype.getPorcentajeIva = function () {
                return this.porc_iva;
            };

            ProductoFacturas.prototype.getLote = function () {
                return this.lote;
            };
            
            ProductoFacturas.prototype.getCodigo = function () {
                return this.codigo;
            };

            ProductoFacturas.prototype.getNombre = function () {
                return this.nombre;
            };

            return this;
        }]);
});