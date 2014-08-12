
define(["angular","js/models"], function(angular, models){

     models.factory('Auditor', function() {

        function Auditor(nombre, id){
            this.nombre_operario = nombre;
            this.operario_id = id;
        }

        Separador.prototype.setOperarioId = function(id) {
            this.operario_id = id;
        };

        Separador.prototype.setNombre = function(nombre) {
            this.nombre_operario = nombre;
        };

        Separador.prototype.getPropiedades = function(id) {
            var obj = {};

            obj.operario_id = this.operario_id;
            obj.nombre      = this.nombre_operario;

            return obj;
        };


        this.get = function(nombre, id){
            return new Auditor(nombre, id);
        }

        return this;

    });
});
