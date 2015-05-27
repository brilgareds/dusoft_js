define(["angular", "js/models"], function(angular, models) {

    models.factory('Rol', [function() {

            function Rol(id, nombre, observacion, empresa_id) {
                this.id = id || 0;
                this.nombre = nombre;
                this.observacion = observacion ||  "";
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

            Rol.prototype.setObservacion = function(observacion) {
                this.observacion = observacion;
            };

            Rol.prototype.getObservacion = function() {
                return this.observacion;
            };

            Rol.prototype.setEstado = function(estado) {
                
                this.estado = Boolean(Number(estado));
            };
            
            Rol.prototype.getEstado = function() {
                return this.estado;
            };

            Rol.prototype.setEmpresaId = function(empresa_id) {
                this.empresa_id = empresa_id;
            };

            Rol.prototype.getEmpresaId = function() {
                return this.empresa_id;
            };

            Rol.prototype.setRolesModulos = function(rolesModulos) {
                this.rolesModulos = rolesModulos;
            };
            
            Rol.prototype.vaciarModulos = function() {
                this.rolesModulos = [];
            };
            
            Rol.prototype.getModulos = function() {
                return this.rolesModulos;
            };
            
            Rol.prototype.agregarModulo = function(rolModulo) {
                for (var i in this.rolesModulos) {
                    var modulo = this.rolesModulos[i];
                    if (modulo.getRol().getId() === rolModulo.getRol().getId()
                        && modulo.getRol().getEmpresaId() === rolModulo.getRol().getEmpresaId()
                        && modulo.getModulo().getId() === rolModulo.getModulo().getId()) {
                    
                        //se modifica el objeto en la posicion
                        this.rolesModulos[i].setEstado(rolModulo.getEstado());
                        this.rolesModulos[i].getModulo().setListasEmpresas(rolModulo.getModulo().getListaEmpresas());
                        this.rolesModulos[i].getModulo().setEstado(rolModulo.getModulo().getEstado());
                        
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