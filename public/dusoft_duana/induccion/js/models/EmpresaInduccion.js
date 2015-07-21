
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaInduccion', ["Empresa", function(Empresa) {
            
       
       function EmpresaInduccion(nombre, codigo) {
            Empresa.getClass().call(this, nombre, codigo);
            this.centrosUtilidad = [];
            this.centroUtilidadSeleccionado = null;
        };

         EmpresaInduccion.prototype =  Object.create(Empresa.getClass().prototype);
         
         EmpresaInduccion.prototype.agregarCentroUtilidad = function(centro){
              this.centrosUtilidad.push(centro);
         };
         
         
         EmpresaInduccion.prototype.getCentrosUtilidad = function(){
             return this.centrosUtilidad;
         };
         
        EmpresaInduccion.prototype.getCentroUtilidadSeleccionado = function(){
            
            return this.centroUtilidadSeleccionado;
        }
        EmpresaInduccion.prototype.seleccionarCentroUtilidad= function(centrosUtilidad){
            
             for (var i = 0; i < this.centrosUtilidad.length; i++) {

                    if (this.centrosUtilidad[i].getNombre() === centrosUtilidad) {
                        this.centroUtilidadSeleccionado = this.centrosUtilidad[i];
                        break;
                    }
                }
                
              return this;  
        }
        
        
        this.get = function(nombre, codigo) {
            return new EmpresaInduccion(nombre, codigo);
        };

        return this;

    }]);

});