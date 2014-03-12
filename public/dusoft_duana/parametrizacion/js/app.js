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
    "config",
    "controllers/OperariosBodega/OperariosBodegaController",
    "models/OperariosBodegaModel/Operario",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/http/Request",
    "includes/http/HttpInterceptor",
    "storage",
    "includes/classes/Usuario"
], function(angular) {
    /* App Module and its dependencies */

    var Parametrizacion = angular.module('parametrizacion', [
        'ui.router',
        'controllers',
        'models',
        'ui.bootstrap',
        'ngGrid',
        'directive',
        'Config',
        'services',
        'ui.select2',
        'LocalStorageModule'
    ]);



    Parametrizacion.config(function($stateProvider, $urlRouterProvider,$httpProvider) {

        // For any unmatched url, send to /route1

        $httpProvider.responseInterceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise("/parametrizacion");

        $stateProvider
            .state('OperariosBodega', {
            url: "/OperariosBodega",
            templateUrl: "views/OperariosBodega/listaOperarios.html",
            controller: "OperariosBodegaController"
        });

    }).run(function($rootScope,localStorageService, Usuario) {
        $rootScope.name = "parametrizacion";
        var obj = localStorageService.get("session");
        if(!obj) return;
        Usuario.setToken(obj.auth_token);
        Usuario.setUsuarioId(obj.usuario_id);
    });

    angular.bootstrap(document, ['parametrizacion']);
    return Parametrizacion;
});