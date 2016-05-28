
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductosHc', ["Producto", function (Producto) {


            function ProductosHc(codigo_producto, descripcion, existencia) {                           
                Producto.getClass().call(this,codigo_producto, descripcion, existencia); 
                this.lotes = [];
            }
            
            ProductosHc.prototype = Object.create(Producto.getClass().prototype);
            
       
            
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