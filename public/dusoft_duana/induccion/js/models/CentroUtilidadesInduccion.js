
define(["angular", "js/models", "includes/classes/CentroUtilidad"], function(angular, models) {

    models.factory('CentroUtilidadesInduccion', ["CentroUtilidad", function(CentroUtilidad) {
            
       
       function CentroUtilidadesInduccion(nombre, codigo) {
            CentroUtilidad.getClass().call(this, nombre, codigo);
             this.bodegas = [];
             this.bodegaSeleccionada = null;
        };

         CentroUtilidadesInduccion.prototype =  Object.create(CentroUtilidad.getClass().prototype);
        
         CentroUtilidadesInduccion.prototype.agregarBodega = function(centro){
              this.bodegas.push(centro);
         };
         
         
         CentroUtilidadesInduccion.prototype.getBodega = function(){
             return this.bodegas;
         };
       
        CentroUtilidadesInduccion.prototype.getBodegaSeleccionado = function(){
            
            return this.bodegaSeleccionada;
        }
        
       
         CentroUtilidadesInduccion.prototype.vaciarBodegas = function(){
            this.bodegas = [];
        }
        this.get = function(nombre, codigo) {
            return new CentroUtilidadesInduccion(nombre, codigo);
        };

        return this;

    }]);
});