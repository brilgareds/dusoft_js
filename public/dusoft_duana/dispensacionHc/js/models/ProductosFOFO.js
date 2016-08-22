
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosFOFO', ["Producto", function (Producto) {


            function ProductosFOFO(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
                this.perioricidadEntrega;
                this.tiempoTotal;
                this.principioActivo;
                this.cantidadEntrega;
                this.productosHc = [];
                this.codigoFormaFarmacologica;
                
            }
            
            ProductosFOFO.prototype = Object.create(Producto.getClass().prototype);
            
            ProductosFOFO.prototype.setTiempoTotal = function(tiempoTotal){   
                this.tiempoTotal = tiempoTotal;              
            };
            
            ProductosFOFO.prototype.getTiempoTotal = function(){             
               return this.tiempoTotal;              
            };
            
            ProductosFOFO.prototype.setPerioricidadEntrega = function(perioricidadEntrega){   
                this.perioricidadEntrega = perioricidadEntrega;              
            };
            
            ProductosFOFO.prototype.getPerioricidadEntrega = function(){             
               return this.perioricidadEntrega;              
            };
            
            ProductosFOFO.prototype.setPrincipioActivo = function(principioActivo){   
                this.principioActivo = principioActivo;              
            };
            
            ProductosFOFO.prototype.getPrincipioActivo = function(){             
               return this.principioActivo;              
            };
            
            ProductosFOFO.prototype.setCantidadEntrega = function(cantidadEntrega){   
                this.cantidadEntrega = cantidadEntrega;              
            };
            
            ProductosFOFO.prototype.getCantidadEntrega = function(){   
                return this.cantidadEntrega;              
            };
            
            
            ProductosFOFO.prototype.setCodigoFormaFarmacologica = function(codigoFormaFarmacologica){   
                this.codigoFormaFarmacologica = codigoFormaFarmacologica;              
            };
            
            ProductosFOFO.prototype.getCodigoFormaFarmacologica = function(){   
                return this.codigoFormaFarmacologica;              
            };
            
            
            
            
            
            ProductosFOFO.prototype.agregarProductosHc = function(productoHc){
                this.productosHc.push(productoHc);
            };
             
            ProductosFOFO.prototype.mostrarProductosHc = function(){
                return this.productosHc;
             };
             
            ProductosFOFO.prototype.vaciarProductosHc = function () {
                this.productosHc = [];
             };
            
            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductosFOFO(codigo_producto, descripcion, existencia);
            };

            return this;

        }]);

});