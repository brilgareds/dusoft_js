   define(["angular", "js/services"], function(angular, services){
	
    var Constants = services.factory('URL', [function(){
         var BASE_URL = "/api"; 
       
        var BASE_URL_IMG = "/images";

        this.CONSTANTS = {
              'API': {
                'TERCEROS':{
                    'LISTAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/listar",
                    'CREAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/crear",
                    'MODIFICAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/modificar"
                },
                'USUARIOS':{
                    'OBTENER_USUARIO_POR_ID':BASE_URL+"/Usuarios/obtenerUsuarioPorId",
                    'SUBIR_AVATAR_USUARIO':BASE_URL+"/Usuarios/subirAvatarUsuario",
                    'OBTENER_MODULOS_USUARIO':BASE_URL+"/Usuarios/obtenerModulosPorUsuario",
                    'LISTAR_USUARIO_OPCIONES':BASE_URL+"/Usuarios/listarUsuariosModulosOpciones",
                    'OBTENER_ROL_USUARIO':BASE_URL+"/Usuarios/obtenerRolUsuarioPorEmpresa",
                    'OBTENER_PARAMETRIZACION_USUARIO':BASE_URL+"/Usuarios/obtenerParametrizacionUsuario",
                    'OBTENER_EMPRESAS_USUARIO':BASE_URL+"/Usuarios/obtenerEmpresasUsuario"
                    

                },
                'MODULOS':{
                    'ES_MODULO_PADRE':BASE_URL+"/Modulos/esModuloPadre"
                },
                'PRODUCTOS':{
                    'CONSULTAR_EXISTENCIAS' : BASE_URL+"/Productos/consultarExistencias"
                }
              },
              'STATIC' :{
                  'RUTA_AVATAR' : BASE_URL_IMG+"/Usuarios/Avatars/"
              }
            };


            return this;
    }]);


});
