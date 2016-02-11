
define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaAprobacionDespacho', ["Empresa", function (Empresa) {


            function EmpresaAprobacionDespacho(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.centrosUtilidad = [];
                this.centroUtilidadSeleccionado;
            }
            ;

            EmpresaAprobacionDespacho.prototype = Object.create(Empresa.getClass().prototype);

            EmpresaAprobacionDespacho.prototype.setCentroUtilidadSeleccionado = function (centroUtilidadSeleccionado) {
                this.centroUtilidadSeleccionado = centroUtilidadSeleccionado;
            };

            EmpresaAprobacionDespacho.prototype.getCentroUtilidadSeleccionado = function () {
                return this.centroUtilidadSeleccionado;
            };

            EmpresaAprobacionDespacho.prototype.agregarCentroUtilidad = function (centro) {
                this.centrosUtilidad.push(centro);
            };

            EmpresaAprobacionDespacho.prototype.getCentrosUtilidad = function () {
                return this.centrosUtilidad;
            };

//            EmpresaAprobacionDespacho.prototype.vaciarEmpresa= function () {
//                this.centrosUtilidad = [];
//            }
            
            EmpresaAprobacionDespacho.prototype.vaciarCentroUtilidad = function () {
                this.centrosUtilidad = [];
            }
            this.get = function (nombre, codigo) {
                return new EmpresaAprobacionDespacho(nombre, codigo);
            };

            return this;

        }]);

});