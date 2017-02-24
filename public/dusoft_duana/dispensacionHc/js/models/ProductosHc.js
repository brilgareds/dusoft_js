
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosHc', ["Producto", function (Producto) {
 
            function ProductosHc(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
                this.lotes = [];
                this.principioActivo = "";
                this.serialId = 0;
                this.estadoProductoVencimiento = 0; 
                this.loteSeleccionado = false;
                this.descripcion = descripcion;
            }
            
            ProductosHc.prototype = Object.create(Producto.getClass().prototype);
             
            ProductosHc.prototype.getDescripcionProducto = function(){               
                return this.descripcion;
            };
             
            ProductosHc.prototype.setLoteSeleccionado = function(loteSeleccionado){   
                this.loteSeleccionado = loteSeleccionado;              
            };
            
            ProductosHc.prototype.getLoteSeleccionado = function(){             
               return this.loteSeleccionado;              
            };
           
            ProductosHc.prototype.setSerialId = function(serialId){
                this.serialId = serialId;
            };
       
            ProductosHc.prototype.getSerialId = function(){
                return this.serialId;
            };
            
            ProductosHc.prototype.setPrincipioActivo = function(principioActivo){
                this.principioActivo = principioActivo;
            };
       
            ProductosHc.prototype.getPrincipioActivo = function(){
                return this.principioActivo;
            };
            
            ProductosHc.prototype.getEstadoProductoVencimiento = function(){
                return this.estadoProductoVencimiento;
            };
            
            ProductosHc.prototype.setEstadoProductoVencimiento = function(estadoProductoVencimiento){
                return this.estadoProductoVencimiento = estadoProductoVencimiento;
            };
            
            ProductosHc.prototype.agregarLotes = function(lote){
                this.lotes.push(lote);
            };
             
            ProductosHc.prototype.mostrarLotes = function(){
                return this.lotes;
            };
             
            ProductosHc.prototype.vaciarLotes = function () {
                this.lotes = [];
            };
              
            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductosHc(codigo_producto, descripcion, existencia);
            };

            return this;

        }]);

});