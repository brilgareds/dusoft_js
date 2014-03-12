
define(["angular", "js/models"], function(angular, models) {

    models.factory('Cliente', function() {

        function Cliente(nombre, direccion, tipo_id, id, telefono) {
            this.nombre_cliente = nombre || null;
            this.direccion_cliente = direccion || null;
            this.tipo_id_cliente = tipo_id || null;
            this.identificacion_cliente = id || null;
            this.telefono_cliente = telefono || null;
        };

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new Cliente(nombre, direccion, tipo_id, id, telefono);
        };

        this.getClass = function(){
            return Cliente;
        };

        return this;

    });
});