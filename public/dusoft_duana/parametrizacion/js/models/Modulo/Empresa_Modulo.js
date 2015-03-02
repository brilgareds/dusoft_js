define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa_Modulo', [function() {

            function Empresa_Modulo(empresa, modulo) {
                this.empresa = empresa;
                this.modulo = modulo;
            }
            
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
             
            this.get = function(empresa, modulo) {
                return new Empresa_Modulo(empresa, modulo);
            };

            return this;
        }]);
});