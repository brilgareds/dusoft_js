
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tutorial', function() {

        function Tutorial(id, tag,tipo,titulo,descripcion, path, fecha) {
            this.id = id || null;
            this.tag = tag || "";
            this.tipo = tipo || null;
            this.titulo = titulo || "";
            this.descripcion = descripcion || "";
            this.path = path || "";
            this.fecha = fecha || "";
            
           
        };
        
        Tutorial.prototype.setId = function(id){
            this.id = id;
            return this;
        };
        
        Tutorial.prototype.getId = function(){
            return this.id;
        };
        
        Tutorial.prototype.setTag = function(tag){
            this.tag = tag;
            return this;
        };
        
        Tutorial.prototype.getTag = function(){
            return this.tag;
        };
        
        Tutorial.prototype.setTipo = function(tipo){
            this.tipo = tipo;
            return this;
        };
        
        Tutorial.prototype.getTipo = function(){
            return this.tipo;
        };
        
        Tutorial.prototype.setTitulo = function(titulo){
            this.titulo = titulo;
            return this;
        };
        
        Tutorial.prototype.getTitulo = function(){
            return this.titulo;
        };
               
        Tutorial.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };
        
        Tutorial.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        Tutorial.prototype.setPath = function(path){
            this.path = path;
        };
        
        Tutorial.prototype.getPath = function(){
            return this.path;
        };
        
        Tutorial.prototype.setFecha = function(fecha){
           this.fecha = fecha;
        };
        
        Tutorial.prototype.getFecha = function(){
            return this.fecha;
        };
        
        Tutorial.prototype.esTutorialValido = function(){
            
            if(!this.tipo || this.descripcion.length === 0 || this.titulo.length === 0 || this.tag.length === 0){
                return false;
            } else {
                return true;
            }
            
        };
        
        this.get = function(tag,tipo,titulo,descripcion, path, fecha){
            return new (tag,tipo,titulo,descripcion, path, fecha);
        };

        this.getClass = function() {
            return Tutorial;
        };

        return this;

    });
});