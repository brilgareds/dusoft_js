define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa_Modulo', [function() {

            function Empresa_Modulo(empresa, modulo, estado, id) {
                this.empresa = empresa;
                this.modulo = modulo;
                this.estado = estado;
                this.id = id || 0;
            }
            
            Empresa_Modulo.prototype.setId = function(id){
                 this.id = id;
            };
            
            Empresa_Modulo.prototype.getId = function(){
                 return this.id ;
            };
            
            Empresa_Modulo.prototype.setEmpresa = function(empresa){
                 this.empresa = empresa;
            };
            
            Empresa_Modulo.prototype.getEmpresa = function(){
                 return this.empresa ;
            };

            Empresa_Modulo.prototype.setModulo = function(modulo){
                 this.modulo = modulo;
            };
            
            Empresa_Modulo.prototype.getModulo = function(){
                 return this.modulo ;
            };
            
            Empresa_Modulo.prototype.setEstado = function(estado) {
                this.estado = estado;
            };
             
            this.get = function(empresa, modulo, estado, id) {
                return new Empresa_Modulo(empresa, modulo, estado, id);
            };

            return this;
        }]);
});