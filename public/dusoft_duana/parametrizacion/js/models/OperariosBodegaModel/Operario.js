
define(["angular", "js/models"], function(angular, models) {

    models.factory('Operario', function() {

        function Operario(id, nombre, estado, descripcion_estado, usuario_id, descripcion_usuario) {
            this.operario_id = id;
            this.nombre_operario = nombre;
            this.estado = estado;
            this.descripcion_estado = descripcion_estado;
            this.usuario_id = usuario_id;
            this.descripcion_usuario = descripcion_usuario;
        }

        this.get = function(id, nombre, estado, descripcion_estado, usuario_id, descripcion_usuario) {
            return new Operario(id, nombre, estado, descripcion_estado, usuario_id, descripcion_usuario);
        };

        return this;

    });
});



