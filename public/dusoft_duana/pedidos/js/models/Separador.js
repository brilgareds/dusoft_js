
define(["angular", "js/models"], function(angular, models) {

    models.factory('Separador', function() {

        function Separador(nombre, id, total_pedidos_asignados) {
            this.nombre_operario = nombre;
            this.operario_id = id;
            this.total_pedidos_asignados = total_pedidos_asignados;
        }

        Separador.prototype.setOperarioId = function(id) {
            this.operario_id = id;
        };

        Separador.prototype.setNombre = function(nombre) {
            this.nombre_operario = nombre;
        };

        Separador.prototype.setUsuarioId = function(id) {
            this.usuario_id = id;
        };

        Separador.prototype.setUsuarioId = function(id) {
            this.usuario_id = id;
        };

        Separador.prototype.getPropiedades = function(id) {
            var obj = {};

            obj.operario_id = this.operario_id;
            obj.nombre = this.nombre_operario;
            obj.total_pedidos_asignados = this.total_pedidos_asignados;
            return obj;
        };


        this.get = function(nombre, id, total_pedidos_asignados) {
            return new Separador(nombre, id, total_pedidos_asignados);
        };

        return this;

    });
});



