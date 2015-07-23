
define(["angular", "js/models", "includes/classes/Bodega"], function(angular, models) {

    models.factory('BodegasInduccion', ["Bodega", function(Bodega) {
            
       
       function BodegasInduccion(nombre, codigo) {
            Bodega.getClass().call(this, nombre, codigo);
            this.productosInduccion = [];
        };

         BodegasInduccion.prototype =  Object.create(Bodega.getClass().prototype);
        
       
         BodegasInduccion.prototype.agregarProducto = function(centro){
              this.productosInduccion.push(centro);
         };
         
         
         BodegasInduccion.prototype.getProductos = function(){
             return this.productosInduccion;
         };
         
        this.get = function(nombre, codigo) {
            return new BodegasInduccion(nombre, codigo);
        };

        return this;

    }]);
});