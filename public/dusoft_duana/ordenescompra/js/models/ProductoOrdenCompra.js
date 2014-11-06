define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoOrdenCompra', ["Producto", function(Producto) {

            function ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado ) {
                
                Producto.getClass().call(this, codigo, nombre, existencia);
                
                this.iva = iva;
                this.costo_ultima_compra = costo_ultima_compra;
                this.tiene_valor_pactado = tiene_valor_pactado;
            }

            ProductoOrdenCompra.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado) {
                return new ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado);
            };

            return this;
        }]);
});