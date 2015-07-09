define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoOrdenCompraIngreso', ["Producto", function(Producto) {

            function ProductoOrdenCompraIngreso(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.iva = iva;
                this.costo_ultima_compra = costo_ultima_compra || "";
                this.tiene_valor_pactado = tiene_valor_pactado || "";
                this.presentacion = presentacion || "";
                this.cantidad_presentacion = cantidad_presentacion || "";
                this.cantidad_recibida = 0;
            }

            ProductoOrdenCompraIngreso.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion) {
                return new ProductoOrdenCompraIngreso(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion);
            };
            
            

            // IVA
            ProductoOrdenCompraIngreso.prototype.get_iva = function() {
                return parseFloat(this.iva).toFixed(2);
            };

            // Presentacion
            ProductoOrdenCompraIngreso.prototype.set_presentacion = function(presentacion) {
                this.presentacion = presentacion;
            };
            ProductoOrdenCompraIngreso.prototype.get_presentacion = function() {

                return this.presentacion;
            };
            
            // Producto Regulado
            ProductoOrdenCompraIngreso.prototype.set_regulado = function(regulado) {
                this.regulado = regulado;
            };
            
            ProductoOrdenCompraIngreso.prototype.get_regulado = function() {
                return this.regulado;
            };

            // Cantidad Presentacion
            ProductoOrdenCompraIngreso.prototype.get_cantidad_presentacion = function() {

                return this.cantidad_presentacion;
            };

            // Costo
            ProductoOrdenCompraIngreso.prototype.set_costo = function(costo) {
                this.costo_ultima_compra = costo;
            };
            ProductoOrdenCompraIngreso.prototype.get_costo = function() {

                return this.costo_ultima_compra;
            };

            //Cantdad Seleccionada            
            ProductoOrdenCompraIngreso.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.cantidad_seleccionada = cantidad_seleccionada;
            };

            ProductoOrdenCompraIngreso.prototype.get_cantidad_seleccionada = function() {

                return this.cantidad_seleccionada;
            };
            
            //Set Item id -> Identificador en el detalle de la Orden de Compra          
            ProductoOrdenCompraIngreso.prototype.set_id = function(id) {
                this.id = id;
            };

            ProductoOrdenCompraIngreso.prototype.get_id = function() {
                return this.id;
            };
            
            //Novedad Producto           
            ProductoOrdenCompraIngreso.prototype.set_novedad = function(novedad) {
                this.novedad = novedad;
            };

            ProductoOrdenCompraIngreso.prototype.get_novedad = function() {
                return this.novedad;
            };
            
            //politicas Producto           
            ProductoOrdenCompraIngreso.prototype.set_politicas = function(politicas) {
                this.politicas = politicas;
            };

            ProductoOrdenCompraIngreso.prototype.get_politicas = function() {
                return this.politicas;
            };
            
            //Cantidad Recibida            
            ProductoOrdenCompraIngreso.prototype.set_cantidad_recibida = function(cantidad_recibida) {
                this.cantidad_recibida = cantidad_recibida;
            };

            ProductoOrdenCompraIngreso.prototype.get_cantidad_recibida = function() {
                return this.cantidad_recibida;
            };
            
            //Novedades recepcion
            ProductoOrdenCompraIngreso.prototype.set_novedad_recepcion = function(novedad_recepcion) {
                this.novedad_recepcion = novedad_recepcion;
            };

            ProductoOrdenCompraIngreso.prototype.get_novedad_recepcion = function() {
                return this.novedad_recepcion;
            };

            return this;
        }]);
});