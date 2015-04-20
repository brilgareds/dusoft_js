//main app module
define([
    "angular",
    "socketservice",
    "route",
    "bootstrap",
    "js/controllers",
    "js/models",
    "js/services",
    "js/directive",
    "nggrid",
    "uiselect2",
    "loader",
    "includes/menu/menucontroller",
    "url",
    "controllers/OperariosBodega/OperariosBodegaController",
    "controllers/AdministracionModulos/Modulos/AdministracionModulosController",
    "controllers/AdministracionPerfiles/Roles/AdministracionRolesController",
    "controllers/AdministracionPerfiles/Roles/ListarRolesController",
    "controllers/AdministracionPerfiles/Usuarios/ListarUsuariosController",
    "controllers/AdministracionPerfiles/Usuarios/AdministracionUsuariosController",
    "models/OperariosBodegaModel/Operario",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/http/Request",
    "includes/http/HttpInterceptor",
    "storage",
    "includes/classes/Usuario",
    "includes/widgets/InputCheck",
    "directive/Modulos/ArbolModulos",
    "directive/Modulos/DirectivaGeneralModulos",
    "models/Modulo/Empresa_Modulo",
    "models/Modulo/EmpresaParametrizacion",
    "services/ParametrizacionService",
    "dragndropfile"
], function(angular) {
    /* App Module and its dependencies */

    var Parametrizacion = angular.module('parametrizacion', [
        'ui.router',
        'controllers',
        'models',
        'ui.bootstrap',
        'ngGrid',
        'directive',
        'Url',
        'services',
        'ui.select',
        'LocalStorageModule',
        'flow'
    ]);

    Parametrizacion.urlRouterProvider;
    Parametrizacion.stateProvider;

    Parametrizacion.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider) {

        // For any unmatched url, send to /route1
        $httpProvider.interceptors.push('HttpInterceptor');
        Parametrizacion.urlRouterProvider = $urlRouterProvider;
        Parametrizacion.stateProvider = $stateProvider;
        
    }]).run(["$rootScope", "localStorageService", "Usuario","$state","$location", function($rootScope,localStorageService, Usuario, $state,$location) {
        
        $rootScope.name = "parametrizacion";
        
        //este evento indica que la parametrizacion del usuario esta lista (modulos, opciones)
        $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion){
            Parametrizacion.urlRouterProvider.otherwise("/OperariosBodega");

            Parametrizacion.stateProvider
                .state('OperariosBodega', {
                url: "/OperariosBodega",
                text:"Operarios Bodega",
                templateUrl: "views/OperariosBodega/listaOperarios.html",
                controller: "OperariosBodegaController"
            })
            .state('AdministracionModulos', {
                url: "/AdministracionModulos",
                text:"Administracion Modulos",
                templateUrl: "views/AdministracionModulos/Modulos/administracionModulos.html",
                controller: "AdministracionModulosController"
            })
            .state('AdministracionRoles', {
                url: "/AdministracionRoles",
                text:"Administracion Roles",
                templateUrl: "views/AdministracionPerfiles/Roles/administrarRoles.html",
                controller: "AdministracionRolesController"
            })
            .state('ListarRoles', {
                url: "/ListarRoles",
                text:"Listar Roles",
                templateUrl: "views/AdministracionPerfiles/Roles/listarRoles.html",
                controller: "ListarRolesController"
            })
            .state('AdministracionUsuarios', {
                url: "/AdministracionUsuarios",
                text:"Administracion Usuarios",
                templateUrl: "views/AdministracionPerfiles/Usuarios/administracionUsuarios.html",
                controller: "AdministracionUsuariosController"
            })
            .state('ListarUsuarios', {
                url: "/ListarUsuarios",
                text:"Listar Usuarios",
                templateUrl: "views/AdministracionPerfiles/Usuarios/listarUsuarios.html",
                controller: "ListarUsuariosController"
            });
            
            console.log("path ", $location.path().replace("/", ""));
            //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
            $state.go($location.path().replace("/", ""));
        
        });
        
    }]);

    angular.bootstrap(document, ['parametrizacion']);
    return Parametrizacion;
});