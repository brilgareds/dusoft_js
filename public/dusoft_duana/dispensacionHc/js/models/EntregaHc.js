
define(["angular", "js/models", "includes/classes/Entrega"], function (angular, models) {

    models.factory('EntregaHc', ["Entrega", function (Entrega) {


            function EntregaHc() {                           
                Entrega.getClass().call(); 
                this.productos = [];
                this.formulas = [];
                this.fechaEntrega;
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
            
            
            
            
            
            EntregaHc.prototype.setFechaEntrega = function(fechaEntrega) {
                this.fechaEntrega = fechaEntrega;
            };

            EntregaHc.prototype.getFechaEntrega = function() {
                return this.fechaEntrega;
            };

            EntregaHc.prototype.agregarFormulas = function(formula){
                this.formulas.push(formula);
            };

            EntregaHc.prototype.mostrarFormulas = function(){
               return this.formulas;
            };

            EntregaHc.prototype.vaciarFormulas = function () {
               this.formulas = [];
            };

            
            
            return this;

        }]);

});