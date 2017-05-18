
define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaDespacho', ["Empresa", function (Empresa) {


            function EmpresaDespacho(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.centrosUtilidad = [];
                this.centroUtilidadSeleccionado;
                this.tipoIdEmpresa;
                this.id;
                this.digitoVerificacion;
                this.facturasDespachadas = [];
            }
            ;
            
            
            EmpresaDespacho.prototype = Object.create(Empresa.getClass().prototype);
            
            EmpresaDespacho.prototype.setTipoIdEmpresa = function (tipoIdEmpresa) {
                this.tipoIdEmpresa = tipoIdEmpresa;
            };
            
            EmpresaDespacho.prototype.getTipoIdEmpresa = function () {
                return this.tipoIdEmpresa;
            };
            
            EmpresaDespacho.prototype.setId = function (id) {
                this.id = id;
            };
            
            EmpresaDespacho.prototype.getId = function () {
                return this.id;
            };
            
            EmpresaDespacho.prototype.setDigitoVerificacion = function (digitoVerificacion) {
                this.digitoVerificacion = digitoVerificacion;
            };
            
            EmpresaDespacho.prototype.getDigitoVerificacion = function () {
                return this.digitoVerificacion;
            };
            
            

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
            
            
            EmpresaDespacho.prototype.vaciarCentroUtilidad = function () {
                this.centrosUtilidad = [];
            }
            
            
            
            EmpresaDespacho.prototype.agregarFacturasDespachadas = function (facturasDespachadas) {
                this.facturasDespachadas.push(facturasDespachadas);
            };

            EmpresaDespacho.prototype.mostrarFacturasDespachadas = function () {
                return this.facturasDespachadas;
            };
            
            
            EmpresaDespacho.prototype.vaciarFacturasDespachadas = function () {
                this.facturasDespachadas = [];
            }
            
            this.get = function (nombre, codigo) {
                return new EmpresaDespacho(nombre, codigo);
            };

            return this;

        }]);

});