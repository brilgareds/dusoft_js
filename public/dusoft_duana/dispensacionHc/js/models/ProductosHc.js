
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosHc', ["Producto", function (Producto) {


            function ProductosHc(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
                this.perioricidadEntrega;
                this.tiempoTotal;
                this.principioActivo;
                this.cantidadEntrega;
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
            
            ProductosHc.prototype.setPrincipioActivo = function(principioActivo){   
                this.principioActivo = principioActivo;              
            };
            
            ProductosHc.prototype.getPrincipioActivo = function(){             
               return this.principioActivo;              
            };
            
            ProductosHc.prototype.setCantidadEntrega = function(cantidadEntrega){   
                this.cantidadEntrega = cantidadEntrega;              
            };
            
            ProductosHc.prototype.getCantidadEntrega = function(){   
                this.cantidadEntrega;              
            };
            
            
            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductosHc(codigo_producto, descripcion, existencia);
            };

            return this;

        }]);

});