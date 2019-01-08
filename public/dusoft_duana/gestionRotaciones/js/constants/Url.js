define(["angular"], function (angular){
    var Url=angular.module('Url', []);
    var BASE_URL="/api";
    var data={
        'API':{
            'BASE_URL':BASE_URL,
            'ROTACION':{
             
                'LISTAR_ROTACION': BASE_URL + "/Rotacion/listarRotacion",
             
                'MODIFICAR_ROTACION': BASE_URL + "/Rotacion/modificarRotacion",
             
                'GUARDAR_ROTACION': BASE_URL + "/Rotacion/guardarRotacion",
             
                'LISTAR_EMPRESAS': BASE_URL + "/Rotacion/listarEmpresas",
             
                'LISTAR_ZONAS': BASE_URL + "/Rotacion/listarZonas",
                
                'LISTAR_FARMACIAS': BASE_URL + "/Rotacion/listarFarmacias",
                
                'BUSCAR': BASE_URL + "/Rotacion/Buscar",
                
                'ELIMINAR_ROTACION': BASE_URL + "/Rotacion/eliminarRotacion"
               

            }
        }
    };
      angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });
    return Url;
});





