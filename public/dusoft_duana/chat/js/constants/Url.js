define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";

    var BASE_URL_IMG = "/images";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'CHAT':{
                'LISTAR_GRUPOS' : BASE_URL +"/Chat/listarGrupos",
                'CAMBIAR_ESTADO' : BASE_URL +"/Chat/cambiarEstado",
                'LISTAR_USUARIOS' : BASE_URL +"/Chat/listarUsuariosPorGrupo",
                'INSERTAR_USUARIO_GRUPO' : BASE_URL + "/Chat/insertarUsuariosEnGrupo",
                'GUARDAR_GRUPO' : BASE_URL + "/Chat/guardarGrupo",
                'OBTENER_GRUPO_POR_ID' : BASE_URL + "/Chat/obtenerGrupoPorId",
                'CAMBIAR_ESTADO_USUARIO_GRUPO' : BASE_URL + "/Chat/cambiarEstadoUsuarioGrupo"
                
            }
        },
        'STATIC': {
            'BASE_IMG': BASE_URL_IMG
        }
    };


    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
