define(["angular", "js/models"], function(angular, models) {

    models.factory('OpcionModulo', [function() {

            function OpcionModulo(id, nombre, alias, modulo_id) {
                this.id = id || 0;
                this.nombre = nombre || "";
                this.modulo_id = modulo_id || 0;
                this.observacion = "";
                this.alias = alias || "";
                this.estado = true;
                this.seleccionado = false;
                this.estado_opcion_rol = 0;
                
            }
            
            OpcionModulo.prototype.setId = function(id){
                 this.id = id;
            };
            
            OpcionModulo.prototype.getId = function(){
                 return this.id ;
            };
            
            OpcionModulo.prototype.setEstado_opcion_rol = function(id){
                this.estado_opcion_rol = Boolean(Number(id));
            };

            OpcionModulo.prototype.setNombre = function(nombre){
                 this.nombre = nombre;
            };
            
            OpcionModulo.prototype.getNombre = function(){
                 return this.nombre ;
            };
            
            OpcionModulo.prototype.setAlias = function(alias){
                 this.alias = alias;
            };
            
            OpcionModulo.prototype.getAlias = function(){
                 return this.alias ;
            };
            
            OpcionModulo.prototype.setObservacion = function(observacion){
                this.observacion = observacion;
            };
            
            OpcionModulo.prototype.getObservacion = function(){
                return this.observacion;
            };
            
            OpcionModulo.prototype.setEstado = function(estado){
                this.estado = Boolean(Number(estado));
            };
            
            OpcionModulo.prototype.getEstado = function(){
                return this.estado;
            };
            
            this.get = function(id, parent, text, url) {
                return new OpcionModulo(id, parent, text, url);
            };

            return this;
        }]);
});