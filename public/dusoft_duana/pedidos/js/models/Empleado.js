define(["angular", "js/models"], function(angular, models) {
    models.factory('Empleado', function() {
        function Empleado(nombre) {
            this.nombre = "empleado duana";
        }

        Empleado.prototype.getNombre = function() {
            return this.nombre;
        }

        this.get = function(nombre) {
            return new Empleado(nombre);
        }

        return this;
    });
});