
define(["angular", "js/models", "includes/classes/Tutorial"], function (angular, models) {

    models.factory('TutorialH', ["Tutorial", function (Tutorial) {

        function TutorialH(tag,tipo,titulo,descripcion, path, fecha) {

            Tutorial.getClass().call(this,tag,tipo,titulo,descripcion, path, fecha);

             
        }

        TutorialH.prototype = Object.create(Tutorial.getClass().prototype);

        this.get = function (tag,tipo,titulo,descripcion, path, fecha) {
            return new TutorialH(tag,tipo,titulo,descripcion, path, fecha);
        };

        return this;

    }]);

});