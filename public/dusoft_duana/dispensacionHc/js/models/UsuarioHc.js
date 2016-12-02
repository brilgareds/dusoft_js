
define(["angular", "js/models", "includes/classes/Usuario"], function (angular, models) {

    models.factory('UsuarioHc', ["Usuario", function (Usuario) {


            function UsuarioHc(id, usuario, nombre) {                           
                Usuario.getClass().call(this,id, usuario, nombre); 
                this.modulos = [];
                
            }
            
            UsuarioHc.prototype = Object.create(Usuario.getClass().prototype);
            
            UsuarioHc.prototype.agregarModulosHc = function(modulo){
                this.modulos.push(modulo);
            };
             
            UsuarioHc.prototype.mostrarModulosHc = function(){
                return this.modulos;
             };
             
            UsuarioHc.prototype.vaciarModulosHc = function () {
                this.modulos = [];
             };
            this.get = function (id, usuario, nombre) {
                return new UsuarioHc(id, usuario, nombre);
            };

            return this;

        }]);

});