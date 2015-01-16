
define(["angular","js/models"], function(angular, models){

     models.factory('Auditor', function() {

        function Auditor(){
            this.nombre_responsable = "";
            this.operario_id = 0;
            this.usuario_id = 0;
        }

        Auditor.prototype.setDatos = function(datos) {
            
            for(var i in datos){
                if(parseInt(datos[i].estado) === 7){
                    //console.log("set datos auditor ",datos);
                    this.nombre_responsable = datos[i].nombre_responsable;
                    this.operario_id     = datos[i].operario_id;
                    this.estado          = datos[i].estado;
                    this.usuario_id      = datos[i].usuario_id;
                    break;
                }
            }
        };

        this.get = function(){
            return new Auditor();
        };

        return this;

    });
});
