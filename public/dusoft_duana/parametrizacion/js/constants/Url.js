   define(["angular"], function(angular){
	
    var Url = angular.module('Url', []);

    var BASE_URL = "/api"; 
       
    var BASE_URL_IMG = "/images";

    var data = {
	  'API': {
	    'TERCEROS':{
	    	'LISTAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/listar",
	    	'CREAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/crear",
	    	'MODIFICAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/modificar"
	    },
	    'USUARIOS':{
	    	'LISTAR_USUARIOS':BASE_URL+"/Usuarios/listar",
                'GUARDAR_USUARIO':BASE_URL+"/Usuarios/guardarUsuario",
                'OBTENER_USUARIO_POR_ID':BASE_URL+"/Usuarios/obtenerUsuarioPorId",
                'SUBIR_AVATAR_USUARIO':BASE_URL+"/Usuarios/subirAvatarUsuario",
                'OBTENER_AVATAR_USUARIO':BASE_URL+"/Usuarios/obtenerAvatarUsuario",
                'ASIGNAR_ROL_USUARIO':BASE_URL+"/Usuarios/asignarRolUsuario",
                'OBTENER_MODULOS_USUARIO':BASE_URL+"/Usuarios/obtenerModulosPorUsuario",
                'LISTAR_USUARIO_OPCIONES':BASE_URL+"/Usuarios/listarUsuariosModulosOpciones"
	    },
            'MODULOS':{
                'LISTAR_MODULOS': BASE_URL+"/Modulos/listarModulos",
                'GUARDAR_MODULO': BASE_URL+"/Modulos/guardarModulo",
                'OBTENER_MODULOS_POR_ID' : BASE_URL+"/Modulos/obtenerModulosPorId",
                'LISTAR_OPCIONES' : BASE_URL+"/Modulos/listarOpcionesPorModulo",
                'GUARDAR_OPCION' : BASE_URL+"/Modulos/guardarOpcion",
                'ELIMINAR_OPCION' : BASE_URL+"/Modulos/eliminarOpcion",
                'LISTAR_EMPRESAS_MODULOS' : BASE_URL+"/Empresas/listarEmpresasModulos",
                'LISTAR_EMPRESAS' : BASE_URL+"/Empresas/listarEmpresas",
                'HABILITAR_MODULO_EMPRESAS' : BASE_URL +"/Modulos/habilitarModuloEnEmpresas",
                'LISTAR_MODULOS_POR_EMPRESA' : BASE_URL +"/Modulos/listarModulosPorEmpresa",
                'LISTAR_ROLES_POR_MODULO' : BASE_URL+"/Modulos/listarRolesPorModulo"
            },
            'PERFILES':{
                'LISTAR_ROLES': BASE_URL+"/Roles/listarRoles",
                'GUARDAR_ROL': BASE_URL+"/Roles/guardarRol",
                'OBTENER_ROLES_POR_ID' : BASE_URL+"/Roles/obtenerRolesPorId",
                'HABILITAR_MODULOS_ROLES' : BASE_URL +"/Roles/habilitarModulosEnRoles",
                'OBTENER_MODULOS_POR_ROL' : BASE_URL +"/Roles/obtenerModulosPorRol",
                'GUARDAR_OPCION' : BASE_URL +"/Roles/guardarOpcion",
                'LISTAR_ROLES_MODULOS_OPCIONES' : BASE_URL +"/Roles/listarRolesModulosOpciones"
                
                
            }
	  },
          'STATIC' :{
              'BASE_IMG' : BASE_URL_IMG,
              'RUTA_AVATAR' : BASE_URL_IMG+"/Usuarios/Avatars/"
          }
	};

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
