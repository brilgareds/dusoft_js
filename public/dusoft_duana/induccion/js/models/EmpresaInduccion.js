
define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaInduccion', ["Empresa", function (Empresa) {


            function EmpresaInduccion(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.centrosUtilidad = [];
                this.centroUtilidadSeleccionado;
            }
            ;

            EmpresaInduccion.prototype = Object.create(Empresa.getClass().prototype);

            EmpresaInduccion.prototype.setCentroUtilidadSeleccionado = function (centroUtilidadSeleccionado) {
                this.centroUtilidadSeleccionado = centroUtilidadSeleccionado;
            };

            EmpresaInduccion.prototype.getCentroUtilidadSeleccionado = function () {
                return this.centroUtilidadSeleccionado;
            };

            EmpresaInduccion.prototype.agregarCentroUtilidad = function (centro) {
                this.centrosUtilidad.push(centro);
            };

            EmpresaInduccion.prototype.getCentrosUtilidad = function () {
                return this.centrosUtilidad;
            };

            EmpresaInduccion.prototype.vaciarCentroUtilidad = function () {
                this.centrosUtilidad = [];
            }
            this.get = function (nombre, codigo) {
                return new EmpresaInduccion(nombre, codigo);
            };

            return this;

        }]);

});