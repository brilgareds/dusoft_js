define(["angular", "js/models"], function(angular, models) {

    models.factory('VariableModulo', [function() {

            function VariableModulo(id, nombre, valor, observacion) {
                this.id = id || 0;
                this.nombre = nombre || "";
                this.valor = valor || "";
                this.observacion = observacion || "";
                this.estado = true;
            }
            
            VariableModulo.prototype.setId = function(id){
                 this.id = id;
            };
            
            VariableModulo.prototype.getId = function(){
                 return this.id ;
            };
            

            VariableModulo.prototype.setNombre = function(nombre){
                 this.nombre = nombre;
            };
            
            VariableModulo.prototype.getNombre = function(){
                 return this.nombre ;
            };
            
            VariableModulo.prototype.setValor = function(valor){
                 this.valor = valor;
            };
            
            VariableModulo.prototype.getValor = function(){
                 return this.valor ;
            };
            
            VariableModulo.prototype.setObservacion = function(observacion){
                this.observacion = observacion;
            };
            
            VariableModulo.prototype.getObservacion = function(){
                return this.observacion;
            };
            
            VariableModulo.prototype.setEstado = function(estado){
                this.estado = Boolean(Number(estado));
            };
            
            VariableModulo.prototype.getEstado = function(){
                return this.estado;
            };
            
            this.get = function(id, nombre, valor, observacion) {
                return new VariableModulo(id, nombre, valor, observacion);
            };

            return this;
        }]);
});