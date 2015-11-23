define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoOrdenCompra', ["Producto", function(Producto) {

            function ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.iva = iva;
                this.costo_ultima_compra = costo_ultima_compra || "";
                this.tiene_valor_pactado = tiene_valor_pactado || "";
                this.presentacion = presentacion || "";
                this.cantidad_presentacion = cantidad_presentacion || "";
                this.cantidad_recibida = 0;
                this.novedad = null;
            }

            ProductoOrdenCompra.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion) {
                return new ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, presentacion, cantidad_presentacion);
            };
            
            ProductoOrdenCompra.prototype.setTieneValorPactado = function(tieneValorPactado){
                this.tiene_valor_pactado = tieneValorPactado;
            };
            
            ProductoOrdenCompra.prototype.getTieneValorPactado = function(tieneValorPactado){
                return this.tiene_valor_pactado;
            };

            // IVA
            ProductoOrdenCompra.prototype.get_iva = function() {
                return parseFloat(this.iva).toFixed(2);
            };

            // Presentacion
            ProductoOrdenCompra.prototype.set_presentacion = function(presentacion) {
                this.presentacion = presentacion;
            };
            ProductoOrdenCompra.prototype.get_presentacion = function() {

                return this.presentacion;
            };
            
            // Producto Regulado
            ProductoOrdenCompra.prototype.set_regulado = function(regulado) {
                this.regulado = regulado;
            };
            
            ProductoOrdenCompra.prototype.get_regulado = function() {
                return this.regulado;
            };

            // Cantidad Presentacion
            ProductoOrdenCompra.prototype.get_cantidad_presentacion = function() {

                return this.cantidad_presentacion;
            };

            // Costo
            ProductoOrdenCompra.prototype.set_costo = function(costo) {
                this.costo_ultima_compra = costo;
            };
            ProductoOrdenCompra.prototype.get_costo = function() {

                return this.costo_ultima_compra;
            };

            //Cantdad Seleccionada            
            ProductoOrdenCompra.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.cantidad_seleccionada = cantidad_seleccionada;
            };

            ProductoOrdenCompra.prototype.get_cantidad_seleccionada = function() {

                return this.cantidad_seleccionada;
            };
            
            //Set Item id -> Identificador en el detalle de la Orden de Compra          
            ProductoOrdenCompra.prototype.set_id = function(id) {
                this.id = id;
            };

            ProductoOrdenCompra.prototype.get_id = function() {
                return this.id;
            };
            
            //Novedad Producto           
            ProductoOrdenCompra.prototype.set_novedad = function(novedad) {
                this.novedad = novedad;
            };

            ProductoOrdenCompra.prototype.get_novedad = function() {
                return this.novedad;
            };
            
            //politicas Producto           
            ProductoOrdenCompra.prototype.set_politicas = function(politicas) {
                this.politicas = politicas;
            };

            ProductoOrdenCompra.prototype.get_politicas = function() {
                return this.politicas;
            };
            
            //Cantidad Recibida            
            ProductoOrdenCompra.prototype.set_cantidad_recibida = function(cantidad_recibida) {
                this.cantidad_recibida = cantidad_recibida;
            };

            ProductoOrdenCompra.prototype.get_cantidad_recibida = function() {
                return this.cantidad_recibida;
            };
            
            //Novedades recepcion
            ProductoOrdenCompra.prototype.set_novedad_recepcion = function(novedad_recepcion) {
                this.novedad_recepcion = novedad_recepcion;
            };

            ProductoOrdenCompra.prototype.get_novedad_recepcion = function() {
                return this.novedad_recepcion;
            };

            return this;
        }]);
});