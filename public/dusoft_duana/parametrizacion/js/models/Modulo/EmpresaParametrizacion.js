
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaParametrizacion', ['Empresa', function(Empresa) {

            function EmpresaParametrizacion(nombre, codigo, estado) {
                Empresa.getClass().call(this, nombre, codigo);
                this.empreasModulos = [];
                this.seleccionado = false;
                this.estado = Boolean(parseInt(estado));
                this.roles = [];
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
            
            EmpresaParametrizacion.prototype.getRoles = function(){
                return this.roles;
            };
            
            EmpresaParametrizacion.prototype.vaciarRoles = function(){
                this.roles = [];
            };

            EmpresaParametrizacion.prototype.agregarRol = function(_rol) {
                for (var i in this.roles) {
                    var rol = this.roles[i];
                    if (rol.getId() === _rol.getId()) {
                        return;
                    }
                }

                this.roles.push(_rol);
            };

            this.get = function(nombre, codigo, estado) {
                return new EmpresaParametrizacion(nombre, codigo, estado);
            };


            return this;

        }]);
});