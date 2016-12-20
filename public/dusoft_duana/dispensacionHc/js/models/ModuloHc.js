
define(["angular", "js/models", "includes/classes/Modulo"], function (angular, models) {

    models.factory('ModuloHc', ["Modulo", function (Modulo) {


            function ModuloHc(id, parent, text, url, prefijo, alias) {                           
                Modulo.getClass().call(this,id, parent, text, url, prefijo, alias); 
                this.entregas = [];
            }
            
            ModuloHc.prototype = Object.create(Modulo.getClass().prototype);
            
            ModuloHc.prototype.agregarEntregas = function(entrega){
                this.entregas.push(entrega);
             };
             
             ModuloHc.prototype.mostrarEntregas = function(){
                return this.entregas;
             };
             
             ModuloHc.prototype.vaciarEntregas = function () {
                this.entregas = [];
             };
            
            this.get = function (id, parent, text, url, prefijo, alias) {
                return new ModuloHc(id, parent, text, url, prefijo, alias);
            };

            return this;

        }]);

});