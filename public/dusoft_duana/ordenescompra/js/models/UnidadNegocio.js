define(["angular", "js/models"], function(angular, models) {

    models.factory('UnidadNegocio', [function() {

            function UnidadNegocio(codigo, descripcion, imagen) {
                this.codigo = codigo;
                this.descripcion = descripcion;
                this.imagen = imagen;
            }

            this.get = function(codigo, descripcion, imagen) {
                return new UnidadNegocio(codigo, descripcion, imagen);
            };

            UnidadNegocio.prototype.get_nombre = function() {

                var descripcion = this.codigo + ' - ' + this.descripcion;

                return descripcion;
            };

            return this;
        }]);
});