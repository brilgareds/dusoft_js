
define(["angular", "js/models","includes/classes/Tercero"], function(angular, models) {

    models.factory('Vendedor', ["Tercero", function(Tercero) {

        function Vendedor(nombre, tipo_id, id, telefono) {
            
            var direccion = ''; //la dirección es requerida para crear el tercero pero no es importante para el modelo del vendedor
            
            Tercero.getClass().call(this,nombre, tipo_id, id, direccion, telefono);

        };

        this.get = function(nombre, tipo_id, id, telefono) {

            return new Vendedor(nombre, tipo_id, id, telefono);
        };


        Vendedor.prototype = Object.create(Tercero.getClass().prototype)

        this.getClass = function(){
            return Vendedor;
        };

        return this;

    }]);
});