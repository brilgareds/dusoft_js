define(["angular", "js/models"], function (angular, models) {

    models.factory('ProductoContrato', [function () {

            function ProductoContrato(id, empresa_id, nombre_tercero, codigo, descripcion, precio_pactado, usuario, usuario_id, costo_ultima_compra, deficit, justificacion) {
                this.id = id || 0;
                this.empresa_id = empresa_id;
                this.nombre_tercero = nombre_tercero;
                this.codigo = codigo;
                this.descripcion = descripcion;
                this.precio_pactado = precio_pactado;
                this.usuario = usuario;
                this.usuario_id = usuario_id;
                this.costo_ultima_compra = costo_ultima_compra;
                this.deficit = deficit;
                this.justificacion = justificacion;
                this.seleccionado = false;
            }

            this.get = function (id, empresa_id, nombre_tercero, codigo, descripcion, precio_pactado, usuario, usuario_id, costo_ultima_compra, deficit, justificacion) {
                return new ProductoContrato(id, empresa_id, nombre_tercero, codigo, descripcion, precio_pactado, usuario, usuario_id, costo_ultima_compra, deficit, justificacion);
            };

            ProductoContrato.prototype.set_empresa_id = function (empresa_id) {
                this.empresa_id = empresa_id;
            };

            ProductoContrato.prototype.get_empresa_id = function () {
                return this.id;
            };

            ProductoContrato.prototype.set_id = function (id) {
                this.id = id;
            };

            ProductoContrato.prototype.get_id = function () {
                return this.id;
            };

            ProductoContrato.prototype.set_nombre_tercero = function (nombre_tercero) {
                this.nombre_tercero = nombre_tercero;
            };

            ProductoContrato.prototype.get_nombre_tercero = function () {
                return this.nombre_tercero;
            };

            ProductoContrato.prototype.set_codigo = function (codigo) {
                this.codigo = codigo;
            };

            ProductoContrato.prototype.get_codigo = function () {
                return this.codigo;
            };

            ProductoContrato.prototype.set_justificacion = function (justificacion) {
                this.justificacion = justificacion;
            };

            ProductoContrato.prototype.get_justificacion = function () {
                return this.justificacion;
            };

            ProductoContrato.prototype.set_descripcion = function (descripcion) {
                this.descripcion = descripcion;
            };

            ProductoContrato.prototype.get_descripcion = function () {
                return this.descripcion;
            };

            ProductoContrato.prototype.set_precio_pactado = function (precio_pactado) {
                this.precio_pactado = precio_pactado;
            };

            ProductoContrato.prototype.get_precio_pactado = function () {
                return this.precio_pactado;
            };

            ProductoContrato.prototype.set_usuario = function (usuario) {
                this.usuario = usuario;
            };

            ProductoContrato.prototype.get_usuario = function () {
                return this.usuario;
            };

            ProductoContrato.prototype.set_usuario_id = function (usuario_id) {
                this.usuario_id = usuario_id;
            };

            ProductoContrato.prototype.get_usuario_id = function () {
                return this.usuario_id;
            };

            ProductoContrato.prototype.set_costo_ultima_compra = function (costo_ultima_compra) {
                this.costo_ultima_compra = costo_ultima_compra;
            };

            ProductoContrato.prototype.get_costo_ultima_compra = function () {
                return this.costo_ultima_compra;
            };

            ProductoContrato.prototype.set_deficit = function (deficit) {
                this.deficit = deficit;
            };

            ProductoContrato.prototype.get_deficit = function () {
                return this.deficit;
            };

            ProductoContrato.prototype.getSeleccionado = function () {
                return this.seleccionado;
            };

            ProductoContrato.prototype.setSeleccionado = function (seleccionado) {
                this.seleccionado = seleccionado;
            };

            return this;
        }]);
});