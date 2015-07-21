
define(["angular", "js/models", "includes/classes/CentroUtilidad"], function(angular, models) {

    models.factory('CentroUtilidadesInduccion', ["CentroUtilidad", function(CentroUtilidad) {
            
       
       function CentroUtilidadesInduccion(nombre, codigo) {
            CentroUtilidad.getClass().call(this, nombre, codigo);
             this.bodegasInduccion = [];
        };

         CentroUtilidadesInduccion.prototype =  Object.create(CentroUtilidad.getClass().prototype);
        
         CentroUtilidadesInduccion.prototype.agregarBodega = function(centro){
              this.bodegasInduccion.push(centro);
         };
         
         
         CentroUtilidadesInduccion.prototype.getBodega = function(){
             return this.bodegasInduccion;
         };
        /*EmpresaInduccion.farmacias = [];
        EmpresaInduccion.farmaciaSeleccionada;

        //Agregar farmacia
        EmpresaInduccion.agregarFarmacias = function(farmacia){
            this.farmacias.push(farmacia);
        };
        
        EmpresaInduccion.getFarmacias = function(){
            return this.farmacias;
        };
        
        EmpresaInduccion.vaciarFarmacias = function() {
            this.farmacias = [];
        };

        EmpresaInduccion.setFarmaciaSeleccionada = function(farmaciaSeleccionada) {
            this.farmaciaSeleccionada = farmaciaSeleccionada;
        };
        
        EmpresaInduccion.getFarmaciaSeleccionada = function() {
            return this.farmaciaSeleccionada;
        };*/
       
       
       
        
        
        this.get = function(nombre, codigo) {
            return new CentroUtilidadesInduccion(nombre, codigo);
        };

        return this;

    }]);
});