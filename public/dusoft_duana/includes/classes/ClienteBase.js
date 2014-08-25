
define(["angular", "js/models","includes/classes/Tercero"], function(angular, models) {

    models.factory('ClienteBase', function(Tercero) {

        function ClienteBase(nombre, direccion, tipo_id, id, telefono) {
            Tercero.getClass().call(this,nombre, tipo_id, id);
            this.direccion_cliente = direccion || null;
            this.telefono_cliente = telefono || null;
            
        };

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new ClienteBase(nombre, direccion, tipo_id, id, telefono);
        };


        ClienteBase.prototype = Object.create(Tercero.getClass().prototype)

        this.getClass = function(){
            return ClienteBase;
        };

        return this;

    });
});