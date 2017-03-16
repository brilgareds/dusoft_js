define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";
    var PATH_URL_VIDEO = "http://localhost:3000/Tutoriales/Videos/";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'PATH_URL_VIDEO': PATH_URL_VIDEO,
            'TUTORIALES':{
                
                "LISTAR_VIDEOS": BASE_URL + "/Tutoriales/listarVideos"
                
            }
        },
         

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
