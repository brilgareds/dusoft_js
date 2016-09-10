
define(["angular", "js/models", "includes/classes/Entrega"], function (angular, models) {

    models.factory('EntregaHc', ["Entrega", function (Entrega) {


            function EntregaHc(numeroEntrega) {                           
                Entrega.getClass().call(numeroEntrega); 
                this.productos = [];
            }
            
            EntregaHc.prototype = Object.create(Entrega.getClass().prototype);
            
            
            this.get = function (numeroEntrega) {
                return new EntregaHc(numeroEntrega);
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