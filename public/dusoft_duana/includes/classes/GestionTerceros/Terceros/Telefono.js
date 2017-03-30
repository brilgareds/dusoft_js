define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('Telefono', ["BaseParametrizacion", function(BaseParametrizacion) {

        function Telefono(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
            this.tipoTelefono = null;
            this.tipoLineaTelefonica = null;
            this.numero = "";
            
           
        };
        
        Telefono.prototype = Object.create(BaseParametrizacion.getClass().prototype);
        
        Telefono.prototype.setNumero = function(numero){
            this.numero = numero;
            return this;
        };
        
        Telefono.prototype.getNumero = function(){
            return this.numero;
        };
        
        Telefono.prototype.setTipoTelefono = function(tipoTelefono){
            this.tipoTelefono = tipoTelefono;
            return this;
        };
        
        Telefono.prototype.getTipoTelefono = function(){
            return this.tipoTelefono;
        };
        
        Telefono.prototype.setTipoLineaTelefonica = function(tipoLineaTelefonica){
            this.tipoLineaTelefonica = tipoLineaTelefonica;
            return this;
        };
        
        Telefono.prototype.getTipoLineaTelefonica = function(){
            return this.tipoLineaTelefonica;
        };

        this.get = function(id, descripcion) {

            return new Telefono(id, descripcion);
        };

        this.getClass = function(){
            return Telefono;
        };

        return this;

    }]);
});