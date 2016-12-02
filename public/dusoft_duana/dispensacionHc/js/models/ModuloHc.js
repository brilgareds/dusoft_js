
define(["angular", "js/models", "includes/classes/Modulo"], function (angular, models) {

    models.factory('ModuloHc', ["Modulo", function (Modulo) {


            function ModuloHc(id, parent, text, url, prefijo, alias) {                           
                Modulo.getClass().call(this,id, parent, text, url, prefijo, alias); 
                
            }
            
            ModuloHc.prototype = Object.create(Modulo.getClass().prototype);
            
            
            this.get = function (id, parent, text, url, prefijo, alias) {
                return new ModuloHc(id, parent, text, url, prefijo, alias);
            };

            return this;

        }]);

});