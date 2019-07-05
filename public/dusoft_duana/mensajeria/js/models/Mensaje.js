define(["angular", "js/models"], function (angular, models) {

    models.factory('Mensaje', [function () {

            function Mensaje(id, usuario_id, asunto, descripcion, fecha_registro,fecha_validez) {
                this.id = id || 0;
                this.usuario_id = usuario_id;
                this.asunto = asunto;
                this.descripcion = descripcion;
                this.fecha_registro = fecha_registro;
                this.fecha_validez = fecha_validez;
                this.cantidad_lectores = 0;
                this.perfiles;
            }

            this.get = function (id, usuario_id, asunto, descripcion, fecha_registro,fecha_validez) {
                return new Mensaje(id, usuario_id, asunto, descripcion, fecha_registro,fecha_validez);
            };

            Mensaje.prototype.setAsunto = function (asunto) {
                this.asunto = asunto;
            };

            Mensaje.prototype.getAsunto = function () {
                return this.asunto;
            };

            Mensaje.prototype.setId = function (id) {
                this.id = id;
            };

            Mensaje.prototype.getId = function () {
                return this.id;
            };

            Mensaje.prototype.setPerfiles = function (perfiles) {
                this.perfiles = perfiles;
            };

            Mensaje.prototype.getPerfiles = function () {
                return this.perfiles;
            };

            Mensaje.prototype.setCantidadLectores = function (cantidad_lectores) {
                this.cantidad_lectores = cantidad_lectores;
            };

            Mensaje.prototype.getCantidadLectores = function () {
                return this.cantidad_lectores;
            };

            Mensaje.prototype.setUsuarioId = function (usuario_id) {
                this.usuario_id = usuario_id;
            };

            Mensaje.prototype.getUsuarioId = function () {
                return this.usuario_id;
            };
            
            Mensaje.prototype.setDescripcion = function (descripcion) {
                this.descripcion = descripcion;
            };

            Mensaje.prototype.getDescripcion = function () {
                return this.descripcion;
            };

            Mensaje.prototype.setFechaRegistro = function (fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            Mensaje.prototype.getFechaRegistro = function () {
                return this.fecha_registro;
            };

            Mensaje.prototype.setFechaValidez = function (fecha_validez) {
                this.fecha_validez = fecha_validez;
            };

            Mensaje.prototype.getFechaValidez = function () {
                return this.fecha_validez;
            };

            return this;
        }]);
});