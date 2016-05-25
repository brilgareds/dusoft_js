
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosHc', ["Producto", function (Producto) {


            function ProductosHc(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
                this.perioricidadEntrega;
                this.tiempoTotal;
            }
            
            ProductosHc.prototype = Object.create(Producto.getClass().prototype);
            
            ProductosHc.prototype.setTiempoTotal = function(tiempoTotal){   
                this.tiempoTotal = tiempoTotal;              
            };
            
            ProductosHc.prototype.getTiempoTotal = function(){             
               return this.tiempoTotal;              
            };
            
            ProductosHc.prototype.setPerioricidadEntrega = function(perioricidadEntrega){   
                this.perioricidadEntrega = perioricidadEntrega;              
            };
            
            ProductosHc.prototype.getPerioricidadEntrega = function(){             
               return this.perioricidadEntrega;              
            };
            
            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductosHc(codigo_producto, descripcion, existencia);
            };

            return this;

        }]);

});