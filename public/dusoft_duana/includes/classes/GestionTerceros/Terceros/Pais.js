define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('Pais', ["BaseParametrizacion", function(BaseParametrizacion) {

        function Pais(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
            this.departamentos = [];
            this.departamentoSeleccionado = null;
           
        };
        
        Pais.prototype = Object.create(BaseParametrizacion.getClass().prototype);
        
        Pais.prototype.setDepartamentos = function(departamentos){
            this.departamentos = departamentos;
            return this;
        };
        
        Pais.prototype.getDepartamentos = function(){
            return this.departamentos;
        };
        
        Pais.prototype.agregarDepartamento = function(departamento){
            this.departamentos.push(departamento);
        };
        
        Pais.prototype.getDepartamentoSeleccionado = function(){
            return this.departamentoSeleccionado;
        };
        

        this.get = function(id, descripcion) {

            return new Pais(id, descripcion);
        };


        

        this.getClass = function(){
            return Pais;
        };

        return this;

    }]);
});