define(["angular", "js/models"], function(angular, models) {

    models.factory('Rol', [function() {

            function Rol(id, nombre, observacion, empresa_id) {
                this.id = id || 0;
                this.nombre = nombre;
                this.observacion = "";
                this.estado = false;
                this.empresa_id = empresa_id || "";

                //representa n:m roles y modulos
                this.rolesModulos = [];

            }

            Rol.prototype.setId = function(id) {
                this.id = id;
            };

            Rol.prototype.getId = function() {
                return  this.id;
            };

            Rol.prototype.getNombre = function() {
                return  this.nombre;
            };
            
            Rol.prototype.getNombre = function(){
                return this.nombre;
            };

            Rol.prototype.setObservacion = function(observacion) {
                this.observacion = observacion;
            };

            Rol.prototype.getObservacion = function() {
                return this.observacion;
            };

            Rol.prototype.setEstado = function(estado) {
                this.estado = Boolean(estado);
            };

            Rol.prototype.setEmpresaId = function(empresa_id) {
                this.empresa_id = empresa_id;
            };

            Rol.prototype.getEmpresaId = function() {
                return this.observacion;
            };

            Rol.prototype.setRolesModulos = function(rolesModulos) {
                this.rolesModulos = rolesModulos;
            };

            Rol.prototype.getRolesModulos = function() {
                return this.rolesModulos;
            };
            
            Rol.prototype.agregarModulo = function(rolModulo) {
                for (var i in this.rolesModulos) {
                    var modulo = this.rolesModulos[i];
                    if (modulo.getRol().getId() === rolModulo.getRol().getId()
                        && modulo.getRol().getEmpresaId() === rolModulo.getRol().getEmpresaId()
                        && modulo.getModulo().getId() === rolModulo.getModulo().getId()) {
                    
                        return false;
                    }
                }

                this.rolesModulos.push(rolModulo);
            };


            this.get = function(id, nombre, observacion, empresa_id) {
                return new Rol(id, nombre, observacion, empresa_id);
            };

            return this;
        }]);
});