
define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaDespacho', ["Empresa", function (Empresa) {


            function EmpresaDespacho(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.centrosUtilidad = [];
                this.centroUtilidadSeleccionado;
            }
            ;

            EmpresaDespacho.prototype = Object.create(Empresa.getClass().prototype);

            EmpresaDespacho.prototype.setCentroUtilidadSeleccionado = function (centroUtilidadSeleccionado) {
                this.centroUtilidadSeleccionado = centroUtilidadSeleccionado;
            };

            EmpresaDespacho.prototype.getCentroUtilidadSeleccionado = function () {
                return this.centroUtilidadSeleccionado;
            };

            EmpresaDespacho.prototype.agregarCentroUtilidad = function (centro) {
                this.centrosUtilidad.push(centro);
            };

            EmpresaDespacho.prototype.getCentrosUtilidad = function () {
                return this.centrosUtilidad;
            };

//            EmpresaDespacho.prototype.vaciarEmpresa= function () {
//                this.centrosUtilidad = [];
//            }
            
            EmpresaDespacho.prototype.vaciarCentroUtilidad = function () {
                this.centrosUtilidad = [];
            }
            this.get = function (nombre, codigo) {
                return new EmpresaDespacho(nombre, codigo);
            };

            return this;

        }]);

});