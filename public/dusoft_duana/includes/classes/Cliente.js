
define(["angular", "js/models","includes/classes/Tercero"], function(angular, models) {

    models.factory('Cliente', function(Tercero) {

        function Cliente(nombre, direccion, tipo_id, id, telefono) {
            Tercero.getClass().call(this,nombre, tipo_id, id);
            this.direccion_cliente = direccion || null;
            this.telefono_cliente = telefono || null;
        };

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new Cliente(nombre, direccion, tipo_id, id, telefono);
        };


        Cliente.prototype = Object.create(Tercero.getClass().prototype)

        this.getClass = function(){
            return Cliente;
        };

        return this;

    });
});