define(["angular", "js/models"], function(angular, models) {

    models.factory('Separador', function() {

        function Separador() {
            this.nombre_operario = "";
            this.operario_id = 0;
            this.total_pedidos_asignados = 0;
        }

        Separador.prototype.setDatos = function(datos) {
            for(var i in datos){
                if(datos[i].estado == 1){
                    this.nombre_operario = datos[i].nombre_responsable;
                    this.operario_id     = datos[i].operario_id;
                    this.estado          = datos[i].estado;
                    break;
                }
            }
        };

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






