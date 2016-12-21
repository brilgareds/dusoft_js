
define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaDispensacionHc', ["Empresa", function (Empresa) {


            function EmpresaDispensacionHc(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.centrosUtilidad = [];
                this.centroUtilidadSeleccionado;
            }
            ;

            EmpresaDispensacionHc.prototype = Object.create(Empresa.getClass().prototype);

            EmpresaDispensacionHc.prototype.setCentroUtilidadSeleccionado = function (centroUtilidadSeleccionado) {
                this.centroUtilidadSeleccionado = centroUtilidadSeleccionado;
            };

            EmpresaDispensacionHc.prototype.getCentroUtilidadSeleccionado = function () {
                return this.centroUtilidadSeleccionado;
            };

            EmpresaDispensacionHc.prototype.agregarCentroUtilidad = function (centro) {
                this.centrosUtilidad.push(centro);
            };

            EmpresaDispensacionHc.prototype.getCentrosUtilidad = function () {
                return this.centrosUtilidad;
            };

//            EmpresaDispensacionHc.prototype.vaciarEmpresa= function () {
//                this.centrosUtilidad = [];
//            }
            
            EmpresaDispensacionHc.prototype.vaciarCentroUtilidad = function () {
                this.centrosUtilidad = [];
            }
            this.get = function (nombre, codigo) {
                return new EmpresaDispensacionHc(nombre, codigo);
            };

            return this;

        }]);

});