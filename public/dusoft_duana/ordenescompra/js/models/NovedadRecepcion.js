define(["angular", "js/models"], function(angular, models) {

    models.factory('NovedadRecepcion', [function() {

            function NovedadRecepcion(id, codigo, descripcion, estado) {
                this.id = id;
                this.codigo = codigo;
                this.descripcion = descripcion;
                this.estado = estado;
            }

            this.get = function(id, codigo, descripcion, estado) {
                return new NovedadRecepcion(id, codigo, descripcion, estado);
            };

            NovedadRecepcion.prototype.get_id = function() {
                return this.id;
            };

            NovedadRecepcion.prototype.get_codigo = function() {
                return this.codigo;
            };

            NovedadRecepcion.prototype.get_descripcion = function() {               
                    return this.descripcion;
            };
            
            NovedadRecepcion.prototype.get_codigo_descripcion = function() {               
                    return this.codigo + ' - ' + this.descripcion;
            };

            NovedadRecepcion.prototype.get_estado = function() {
                return this.estado;
            };

            return this;
        }]);
});