
define(["angular", "js/models", "../../../includes/classes/ClienteBase"], function(angular, models) {

    models.factory('Cliente', ["ClienteBase", function(ClienteBase) {

        function Cliente(nombre, direccion, tipo_id, id, telefono) {
            ClienteBase.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
        }

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new Cliente(nombre, direccion, tipo_id, id, telefono);
        }

        Cliente.prototype = Object.create(ClienteBase.getClass().prototype)
        
        return this;

    }]);
});