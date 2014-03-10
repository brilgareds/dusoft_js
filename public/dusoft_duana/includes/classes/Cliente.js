
define(["angular", "js/models"], function(angular, models) {

    models.factory('Cliente', function() {

        function Cliente(nombre, direccion, tipo_id, id, telefono) {
            this.nombre_cliente = nombre;
            this.direccion_cliente = direccion;
            this.tipo_id_cliente = tipo_id;
            this.identificacion_cliente = id;
            this.telefono_cliente = telefono;
        }

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new Cliente(nombre, direccion, tipo_id, id, telefono);
        }

        return this;

    });
});