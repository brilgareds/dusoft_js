define(["angular", "js/models"], function (angular, models) {

    models.factory('ImagenAprobacion', [function () {


        function ImagenAprobacion(id, path) {
            this.id = id;
            this.path = path;
        };

        ImagenAprobacion.prototype.setId = function (id) {
           this.id = id;
        };

        ImagenAprobacion.prototype.getId = function () {
            return this.id;
        };

        ImagenAprobacion.prototype.getPath = function () {
            return this.path;
        };

        ImagenAprobacion.prototype.setPath = function (path) {
            this.path = path;
        };


        this.get = function (id, path) {
            return new ImagenAprobacion(id, path);
        };

        return this;

    }]);

});

