define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('FacturaConsumoBarranquilla', ["Documento", function (Documento) {


            function FacturaConsumoBarranquilla(id, empresa_id, nombre, fecha_registro) {
                Documento.getClass().call(this, id, empresa_id, nombre, fecha_registro);
                this.id = id || 0;
                this.empresaId = empresa_id;
                this.fechaRegistro = fecha_registro || '';
                this.observaciones ='';
                this.nombre = nombre || '';
                this.estadoFacturacion;
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

            this.get = function (id, empresa_id, nombre, fecha_registro,  observaciones) {
                return new FacturaConsumoBarranquilla(id, empresa_id, nombre, fecha_registro, observaciones);
            };

            return this;

        }]);

});