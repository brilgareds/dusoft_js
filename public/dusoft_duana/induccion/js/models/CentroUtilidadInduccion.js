
define(["angular", "js/models", "includes/classes/CentroUtilidad"], function (angular, models) {

    models.factory('CentroUtilidadInduccion', ["CentroUtilidad", function (CentroUtilidad) {


            function CentroUtilidadInduccion(nombre, codigo) {
                CentroUtilidad.getClass().call(this, nombre, codigo);
                this.bodegas = [];
                this.bodegaSeleccionado;

            }
            ;
            CentroUtilidadInduccion.prototype = Object.create(CentroUtilidad.getClass().prototype);

            CentroUtilidadInduccion.prototype.setBodegaSeleccionado = function (bodegaSeleccionado) {
                this.bodegaSeleccionado = bodegaSeleccionado;
            };

            CentroUtilidadInduccion.prototype.getBodegaSeleccionado = function () {
                return this.bodegaSeleccionado;
            };

            CentroUtilidadInduccion.prototype.agregarBodega = function (bodega) {
                this.bodegas.push(bodega);
            };

            CentroUtilidadInduccion.prototype.getCentrosBodega = function () {
                return this.bodegas;
            };

            CentroUtilidadInduccion.prototype.vaciarBodega = function () {
                this.bodegas = [];
            }


            this.get = function (nombre, codigo) {
                return new CentroUtilidadInduccion(nombre, codigo);
            };

            return this;

        }]);

});