define(["angular", "js/models"], function(angular, models) {

    models.factory('RolModulo', [function() {

            function RolModulo(id, rol, modulo, estado) {
                this.id = id;
                this.rol = rol;
                this.modulo = modulo;
                this.estado = (estado === undefined) ? false : Boolean(Number(estado));
                this.login_modulos_empresas_id = 0;
            }

            RolModulo.prototype.setId = function(id) {
                this.id = id;
            };

            RolModulo.prototype.getId = function() {
                return this.id;
            };
            
            
            RolModulo.prototype.setUsuarioEmpresaId = function(login_modulos_empresas_id) {
                this.login_modulos_empresas_id = login_modulos_empresas_id;
            };

            RolModulo.prototype.getUsuarioEmpresaId = function() {
                return this.login_modulos_empresas_id; 
            };

            RolModulo.prototype.setEstado = function(estado) {
                this.estado = Boolean(Number(estado));
            };

            RolModulo.prototype.getEstado = function() {
                return this.estado;
            };


            RolModulo.prototype.setRol = function(rol) {
                this.rol = rol;
            };

            RolModulo.prototype.getRol = function() {
                return  this.rol;
            };

            RolModulo.prototype.setModulo = function(modulo) {
                this.modulo = modulo;
            };

            RolModulo.prototype.getModulo = function() {
                return  this.modulo;
            };

            this.get = function(id, rol, modulo, estado) {
                return new RolModulo(id, rol, modulo, estado);
            };

            return this;
        }]);
});