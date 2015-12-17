define(["angular", "js/services"], function(angular, services) {

    var Constants = services.factory('String', [function() {

        this.CONSTANTS = {
              'ALERTA_TITULO': "Mensaje del sistema."
        };


        return this;
    }]);


});
