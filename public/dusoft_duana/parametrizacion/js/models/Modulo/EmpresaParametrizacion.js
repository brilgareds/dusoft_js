
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaParametrizacion', ['Empresa', function(Empresa) {

            function EmpresaParametrizacion(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
                this.empreasModulos = [];
                this.seleccionado = false;
            }

            EmpresaParametrizacion.prototype = Object.create(Empresa.getClass().prototype);


            EmpresaParametrizacion.prototype.vaciarListaEmpresas = function(opcion) {
                this.empreasModulos = [];
            };

            EmpresaParametrizacion.prototype.getListaEmpresas = function() {
                return this.empreasModulos;
            };

            this.get = function(nombre, codigo) {
                return new EmpresaParametrizacion(nombre, codigo);
            };


            return this;

        }]);
});