define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('Departamento', ["BaseParametrizacion", function(BaseParametrizacion) {

        function Departamento(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
            this.ciudades = [];
            this.ciudadSeleccionada = null;
           
        };
        
        Departamento.prototype = Object.create(BaseParametrizacion.getClass().prototype);
        
        Departamento.prototype.setCiudades = function(ciudades){
            this.ciudades = ciudades;
            return this;
        };
        
        Departamento.prototype.getCiudades = function(){
            return this.ciudades;
        };
        
        Departamento.prototype.agregarCiudad = function(ciudad){
            this.ciudades.push(ciudad);
        };
        
        Departamento.prototype.setCiudadSeleccionada = function(ciudadSeleccionada){
            this.ciudadSeleccionada = ciudadSeleccionada;
            return this;
        };
        
        Departamento.prototype.getCiudadSeleccionada = function(){
            return this.ciudadSeleccionada;
        };
       
        this.get = function(id, descripcion) {

            return new Departamento(id, descripcion);
        };

        this.getClass = function(){
            return Departamento;
        };

        return this;

    }]);
});