
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tutorial', function() {

        function Tutorial(tag,tipo,titulo,descripcion, path, fecha) {
            
            this.tag = tag || "";
            this.tipo = tipo || "";
            this.titulo = titulo || "";
            this.descripcion = descripcion || "";
            this.path = path || "";
            this.fecha = fecha || "";
           
        };
        
        Tutorial.prototype.getTag = function(){
            return this.tag;
        };
        
        Tutorial.prototype.getTipo = function(){
            return this.tipo;
        };
        
        Tutorial.prototype.getTitulo = function(){
            return this.titulo;
        };

        Tutorial.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        Tutorial.prototype.getPath = function(){
            return this.path;
        };
        
        Tutorial.prototype.getFecha = function(){
            return this.fecha;
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