
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tercero', function() {

        function Tercero(nombre, tipo_id_tercero, id) {
            this.nombre_tercero = nombre || "";
            this.tipo_id_tercero = tipo_id_tercero || "";
            this.id = id || "";
        };

        this.get = function(nombre, tipo_id_tercero, id) {
            return new Tercero(nombre, tipo_id_tercero, id);
        };

        this.getClass = function(){
            return Tercero;
        };

        return this;

    });
});