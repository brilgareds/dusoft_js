define(["angular", "js/models","includes/classes/Tercero"], function(angular, models) {

    models.factory('Proveedor', function(Tercero) {

        function Proveedor(nombre, tipo_id, id) {
            Tercero.getClass().call(nombre, tipo_id, id);
        };

        this.get = function(nombre, tipo_id, id) {
            return new Proveedor(nombre, tipo_id, id);
        };


        Proveedor.prototype = Object.create(Tercero.getClass().prototype)
        
        this.getClass = function(){
            return Proveedor;
        };

        return this;

    });
});