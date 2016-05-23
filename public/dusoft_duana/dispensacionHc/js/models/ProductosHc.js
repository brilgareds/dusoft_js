
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosHc', ["Producto", function (Producto) {


            function ProductosHc(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
            }
            
            ProductosHc.prototype = Object.create(Producto.getClass().prototype);
            
            
            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductosHc(codigo_producto, descripcion, existencia);
            };

            return this;

        }]);

});