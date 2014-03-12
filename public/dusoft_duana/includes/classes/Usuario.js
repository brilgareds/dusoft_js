
define(["angular","js/models"], function(angular, models) {

    models.factory('Usuario', function() {

        this.token = "";
        this.usuario_id = "";

        this.setToken = function(token){
            this.token = token;
        };

        this.setUsuarioId = function(usuario_id){
            this.usuario_id = usuario_id;
        };

        return this;

    });
});