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
    "controllers/AdministracionPerfiles/Usuarios/AdministracionUsuariosController",
    "models/OperariosBodegaModel/Operario",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/http/Request",
    "includes/http/HttpInterceptor",
    "storage",
    "includes/classes/Usuario",
    "includes/widgets/InputCheck"
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
        'ui.select2',
        'LocalStorageModule'
    ]);



    Parametrizacion.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider) {

        // For any unmatched url, send to /route1

        $httpProvider.interceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise("/OperariosBodega");

        $stateProvider
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
            templateUrl: "views/AdministracionPerfiles/Roles/listarRoles.html",
            controller: "AdministracionRolesController"
        })
        .state('AdministracionUsuarios', {
            url: "/AdministracionUsuarios",
            text:"Administracion Usuarios",
            templateUrl: "views/AdministracionPerfiles/Usuarios/listarUsuarios.html",
            controller: "AdministracionUsuariosController"
        });
        
        
        

    }]).run(["$rootScope", "localStorageService", "Usuario", function($rootScope,localStorageService, Usuario) {
        $rootScope.name = "parametrizacion";
        var obj = localStorageService.get("session");
        if(!obj) return;
        Usuario.setToken(obj.auth_token);
        Usuario.setUsuarioId(obj.usuario_id);
    }]);

    angular.bootstrap(document, ['parametrizacion']);
    return Parametrizacion;
});