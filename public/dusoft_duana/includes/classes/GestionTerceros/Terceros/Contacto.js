define(["angular", "js/models"], function(angular, models) {

    models.factory('Contacto', [function() {

        function Contacto(id, descripcion) {
            this.tiposContacto = [];
            this.inicializar();
        };
        
        Contacto.prototype.setId = function(id){
            this.id = id;
            return this;
        };
        
        Contacto.prototype.getId = function(){
            return this.id;
        };
        
        Contacto.prototype.setNombre = function(nombre){
            this.nombre = nombre;
            return this;
        };
        
        Contacto.prototype.getNombre = function(){
            return this.nombre;
        };
        
        Contacto.prototype.setTelefono = function(telefono){
            this.telefono = telefono;
            return this;
        };
        
        Contacto.prototype.getTelefono = function(){
            return this.telefono;
        };
        
        Contacto.prototype.setEmail = function(email){
            this.email = email;
            return this;
        };
        
        Contacto.prototype.getEmail = function(){
            return this.email;
        };
        
        Contacto.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };
        
        Contacto.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        Contacto.prototype.setTiposContacto = function(tiposContacto){
            this.tiposContacto = tiposContacto;
            return this;
        };
        
        Contacto.prototype.getTiposContacto = function(){
            return this.tiposContacto;
        };
        
        Contacto.prototype.setTipoContacto = function(tipoSeleccionado){
            this.tipoSeleccionado = tipoSeleccionado;
            return this;
        };
        
        Contacto.prototype.getTipoContacto = function(){
            return this.tipoSeleccionado;
        };
        
        Contacto.prototype.agregarTipoContacto = function(tipo){
            this.tiposContacto.push(tipo);
        };
        
        Contacto.prototype.inicializar = function(contacto){
            this.id = (contacto) ? contacto.getId() : 0;
            this.nombre = (contacto) ?  contacto.getNombre() : "";
            this.telefono = (contacto) ?  contacto.getTelefono() : "";
            this.email = (contacto) ? contacto.getEmail() : "";
            this.descripcion = (contacto) ?  contacto.getDescripcion() : "";
            this.tipoSeleccionado = null;
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