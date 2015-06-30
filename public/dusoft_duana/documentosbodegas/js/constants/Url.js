define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'I002': {
                'LISTAR_PLANILLAS': BASE_URL + '/PlanillasDespachos/listar',                
            },           
            'I003': {
                'LISTAR_PLANILLAS': BASE_URL + '/PlanillasDespachos/listar',                
            },           
            'E007': {
                'LISTAR_PLANILLAS': BASE_URL + '/PlanillasDespachos/listar',                
            },           
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
