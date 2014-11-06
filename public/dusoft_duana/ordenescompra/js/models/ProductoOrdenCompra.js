define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoOrdenCompra', ["Producto", function(Producto) {

            function ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado,cantidad_seleccionada, costo_compra ) {
                
                Producto.getClass().call(this, codigo, nombre, existencia);
                
                this.iva = iva;
                this.costo_ultima_compra = costo_ultima_compra || "";
                this.tiene_valor_pactado = tiene_valor_pactado || "";
                
                this.cantidad_seleccionada = cantidad_seleccionada || '' ;
                this.costo_compra = costo_compra || '';
            }

            ProductoOrdenCompra.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado, cantidad_seleccionada, costo_compra) {
                return new ProductoOrdenCompra(codigo, nombre, existencia, iva, costo_ultima_compra, tiene_valor_pactado,cantidad_seleccionada, costo_compra);
            };
            
            ProductoOrdenCompra.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.cantidad_seleccionada = cantidad_seleccionada;
            };

            return this;
        }]);
});