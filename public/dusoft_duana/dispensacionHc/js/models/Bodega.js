
define(["angular", "js/models", "includes/classes/Bodega"], function (angular, models) {

    models.factory('BodegaHc', ["Bodega", function (Bodega) {


            function BodegaHc(nombre, codigo) {                           
                Bodega.getClass().call(this,nombre, codigo); 
                this.formulas = [];
            }
            
            BodegaHc.prototype = Object.create(Bodega.getClass().prototype);
            
            
            BodegaHc.prototype.agregarFormula = function(producto){
                this.formulas.push(producto);
             };
             
             BodegaHc.prototype.mostrarFormula = function(){
                return this.formulas;
             };
             
             BodegaHc.prototype.vaciarFormula = function () {
                this.formulas = [];
             };
             
            
            this.get = function (nombre, codigo) {
                return new BodegaHc(nombre, codigo);
            };

            return this;

        }]);

});