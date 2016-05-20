
define(["angular", "js/models"], function(angular, models) {

    models.factory('EpsAfiliados', function() {

        function EpsAfiliados(afiliadoTipoId,
                        afiliadoId,planAtencion
                        ) {
            
            this.afiliadoTipoId = afiliadoTipoId || "";
            this.afiliadoId = afiliadoId || "";
            this.planAtencion = planAtencion || "";
           
        };
        
        EpsAfiliados.prototype.getAfiliadoTipoId = function(){
            return this.afiliadoTipoId;
        };
        
        EpsAfiliados.prototype.getAfiliadoId = function(){
            return this.afiliadoId;
        };
        
        EpsAfiliados.prototype.getPlanAtencion = function(){
            return this.planAtencion;
        };
        
        
       
        this.get = function(afiliadoTipoId,
                        afiliadoId,planAtencion) {
            return new EpsAfiliados(afiliadoTipoId,
                        afiliadoId,planAtencion);
        };

        this.getClass = function() {
            return EpsAfiliados;
        };

        return this;

    });
});