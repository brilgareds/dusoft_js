define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('FacturaConsumoBarranquilla', ["Documento", function (Documento) {


            function FacturaConsumoBarranquilla(id, empresa_id, nombre, fecha_registro) {
                Documento.getClass().call(this, id, empresa_id, nombre, fecha_registro);
                this.id = id || 0;
                this.empresaId = empresa_id;
                this.fechaRegistro = fecha_registro || '';
                this.observaciones = '';
                this.nombre = nombre || '';
                this.estadoFacturacion;
                this.descripcionEstadoFacturacion;
            }

            FacturaConsumoBarranquilla.prototype = Object.create(Documento.getClass().prototype);

            FacturaConsumoBarranquilla.prototype.setId = function (id) {
                this.id = id;
            };

            FacturaConsumoBarranquilla.prototype.getId = function () {
                return this.id;
            };

            FacturaConsumoBarranquilla.prototype.setEmpresaId = function (empresaId) {
                this.empresaId = empresaId;
            };

            FacturaConsumoBarranquilla.prototype.getEmpresaId = function () {
                return this.empresaId;
            };

            FacturaConsumoBarranquilla.prototype.setFechaRegistro = function (fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
            };

            FacturaConsumoBarranquilla.prototype.getFechaRegistro = function () {
                return this.fechaRegistro;
            };

            FacturaConsumoBarranquilla.prototype.setObservaciones = function (observaciones) {
                this.observaciones = observaciones;
            };

            FacturaConsumoBarranquilla.prototype.getObservaciones = function () {
                return this.observaciones;
            };

            FacturaConsumoBarranquilla.prototype.setEstadoFacturacion = function (estadoFacturacion) {
                this.estadoFacturacion = estadoFacturacion;
            };

            FacturaConsumoBarranquilla.prototype.getEstadoFacturacion = function () {
                return this.estadoFacturacion;
            };

            FacturaConsumoBarranquilla.prototype.setDescripcionEstadoFacturacion = function (descripcionEstadoFacturacion) {
                this.descripcionEstadoFacturacion = descripcionEstadoFacturacion;
            };

            FacturaConsumoBarranquilla.prototype.getDescripcionEstadoFacturacion = function () {
                return this.descripcionEstadoFacturacion;
            };

            FacturaConsumoBarranquilla.prototype.setFactura = function (factura) {
                this.factura = factura;
            };

            FacturaConsumoBarranquilla.prototype.getFactura = function () {
                return this.factura;
            };

            FacturaConsumoBarranquilla.prototype.setTerceroId = function (tercero_id) {
                this.tercero_id = tercero_id;
            };

            FacturaConsumoBarranquilla.prototype.getTerceroId = function () {
                return this.tercero_id;
            };

            FacturaConsumoBarranquilla.prototype.setTipoIdTercero = function (tipo_id_tercero) {
                this.tipo_id_tercero = tipo_id_tercero;
            };

            FacturaConsumoBarranquilla.prototype.getTipoIdTercero = function () {
                return this.tipo_id_tercero;
            };

            this.get = function (id, empresa_id, nombre, fecha_registro, observaciones, estadoFacturacion, descripcionEstadoFacturacion) {
                return new FacturaConsumoBarranquilla(id, empresa_id, nombre, fecha_registro, observaciones, estadoFacturacion, descripcionEstadoFacturacion);
            };

            return this;

        }]);

});