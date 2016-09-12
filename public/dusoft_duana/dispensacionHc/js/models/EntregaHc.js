
define(["angular", "js/models", "includes/classes/Entrega"], function (angular, models) {

    models.factory('EntregaHc', ["Entrega", function (Entrega) {


            function EntregaHc() {                           
                Entrega.getClass().call(); 
                this.productos = [];
            }
            
            EntregaHc.prototype = Object.create(Entrega.getClass().prototype);
            
            
            this.get = function () {
                return new EntregaHc();
            };
            
            
            EntregaHc.prototype.agregarProductos = function(producto){
                this.productos.push(producto);
            };
             
            EntregaHc.prototype.mostrarProductos = function(){
                return this.productos;
             };
             
            EntregaHc.prototype.vaciarProductos = function () {
                this.productos = [];
             };
             
            return this;

        }]);

});