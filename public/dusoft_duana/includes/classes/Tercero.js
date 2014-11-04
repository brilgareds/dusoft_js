
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tercero', function() {

        function Tercero(nombre, tipo_id_tercero, id, direccion, telefono) {

            this.nombre_tercero = nombre || "";
            this.tipo_id_tercero = tipo_id_tercero || "";
            this.id = id || "";
            this.direccion = direccion || "";
            this.telefono = telefono || "";
        }
        ;

        this.get = function(nombre, tipo_id_tercero, id, direccion, telefono) {
            return new Tercero(nombre, tipo_id_tercero, id, direccion, telefono);
        };

        this.getClass = function() {
            return Tercero;
        };

        return this;

    });
});