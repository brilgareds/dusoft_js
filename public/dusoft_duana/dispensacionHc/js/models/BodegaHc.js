
define(["angular", "js/models", "includes/classes/Bodega"], function (angular, models) {

    models.factory('BodegaHc', ["Bodega", function (Bodega) {


            function BodegaHc(nombre, codigo) {                           
                Bodega.getClass().call(this,nombre, codigo); 
                this.usuarios = [];
            }
            
            BodegaHc.prototype = Object.create(Bodega.getClass().prototype);
            
            
            BodegaHc.prototype.agregarUsuarios = function(producto){
                this.usuarios.push(producto);
             };
             
             BodegaHc.prototype.mostrarUsuarios = function(){
                return this.usuarios;
             };
             
             BodegaHc.prototype.vaciarUsuarios = function () {
                this.usuarios = [];
             };
             
            
            this.get = function (nombre, codigo) {
                return new BodegaHc(nombre, codigo);
            };

            return this;

        }]);

});