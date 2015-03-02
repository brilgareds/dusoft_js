
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaParametrizacion', ['Empresa', function(Empresa) {

            function EmpresaParametrizacion(nombre, codigo, estado) {
                Empresa.getClass().call(this, nombre, codigo);
                this.empreasModulos = [];
                this.seleccionado = false;
                this.estado = Boolean(parseInt(estado));
            }

            EmpresaParametrizacion.prototype = Object.create(Empresa.getClass().prototype);


            EmpresaParametrizacion.prototype.vaciarListaEmpresas = function(opcion) {
                this.empreasModulos = [];
            };

            EmpresaParametrizacion.prototype.getListaEmpresas = function() {
                return this.empreasModulos;
            };
            
            EmpresaParametrizacion.prototype.getEstado = function() {
                return this.estado;
            };

            this.get = function(nombre, codigo, estado) {
                return new EmpresaParametrizacion(nombre, codigo, estado);
            };


            return this;

        }]);
});