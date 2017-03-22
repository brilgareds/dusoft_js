define(["angular", "js/models"], function(angular, models) {

    models.factory('Contacto', [function() {

        function Contacto(id, descripcion) {
            
            this.tiposContacto = [];
            this.tipoSeleccionado = null;
            this.nombre = "";
            this.telefono = "";
            this.email = "";
            this.descripcion = "";
           
        };
        
        Contacto.prototype.setTiposContacto = function(tiposContacto){
            this.tiposContacto = tiposContacto;
            return this;
        };
        
        Contacto.prototype.getTiposContacto = function(){
            return this.tiposContacto;
        };
        
        Contacto.prototype.agregarTipoContacto = function(tipo){
            this.tiposContacto.push(tipo);
        };

        this.get = function(id, descripcion) {

            return new Contacto(id, descripcion);
        };



        this.getClass = function(){
            return Contacto;
        };

        return this;

    }]);
});