define(["angular", "js/models"], function(angular, models) {

    models.factory('OpcionModulo', [function() {

            function OpcionModulo(id, nombre, alias, modulo_id) {
                this.id = id || 0;
                this.nombre = nombre || "";
                this.modulo_id = modulo_id || 0;
                this.observacion = "";
                this.alias = alias || "";
                this.estado = false;
                
            }
            
            OpcionModulo.prototype.setId = function(id){
                 this.id = id;
            };
            
            OpcionModulo.prototype.getId = function(){
                 return this.id ;
            };

            OpcionModulo.prototype.setNombre = function(nombre){
                 this.nombre = nombre;
            };
            
            OpcionModulo.prototype.getNombre = function(){
                 return this.nombre ;
            };
            
            OpcionModulo.prototype.setObservacion = function(observacion){
                this.observacion = observacion;
            };
            
            OpcionModulo.prototype.getObservacion = function(){
                return this.observacion;
            };
            
            OpcionModulo.prototype.setEstado = function(estado){
                this.estado = Boolean(estado);
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