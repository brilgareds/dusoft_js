define(["angular", "js/models"], function(angular, models) {

    models.factory('RolModulo', [function() {

            function RolModulo(id, rol, modulo) {
                this.id = id;
                this.rol = rol;
                this.modulo = modulo;
            }
            
            RolModulo.prototype.setId = function(id) {
                this.id = id;
            };
            
            RolModulo.prototype.getId = function() {
                return this.id;
            };

            RolModulo.prototype.setRol= function(rol) {
                this.rol = rol;
            };
            
            RolModulo.prototype.getRol = function() {
                return  this.rol ;
            };
            
            RolModulo.prototype.setModulo = function(modulo) {
                this.modulo = modulo;
            };
            
            RolModulo.prototype.getModulo = function() {
                return  this.modulo ;
            };

            this.get = function(id, rol, modulo) {
                return new RolModulo(id, rol, modulo);
            };

            return this;
        }]);
});