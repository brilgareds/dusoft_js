
define(["angular", "js/models", "includes/classes/Tutorial"], function (angular, models) {

    models.factory('TutorialH', ["Tutorial", function (Tutorial) {

        function TutorialH(id,tag,tipo,titulo,descripcion, path, fecha) {
            this.usuarioId = 0;
            Tutorial.getClass().call(this,id, tag,tipo,titulo,descripcion, path, fecha);
        };
        
        TutorialH.prototype = Object.create(Tutorial.getClass().prototype);
        
        TutorialH.prototype.setUsuarioId = function(usuarioId){
           this.usuarioId = usuarioId;
           return this;
        };
        
        TutorialH.prototype.getUsuarioId = function(){
            return this.usuarioId;
        };

        this.get = function (id, tag,tipo,titulo,descripcion, path, fecha) {
            return new TutorialH(id, tag,tipo,titulo,descripcion, path, fecha);
        };

        return this;

    }]);

});