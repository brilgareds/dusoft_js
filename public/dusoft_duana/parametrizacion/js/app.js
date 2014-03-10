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
    "includes/alert/Alert"
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
        'ui.select2'
    ]);



    Parametrizacion.config(function($stateProvider, $urlRouterProvider) {

        // For any unmatched url, send to /route1

        $urlRouterProvider.otherwise("/parametrizacion");

        $stateProvider
            .state('OperariosBodega', {
            url: "/OperariosBodega",
            templateUrl: "views/OperariosBodega/listaOperarios.html",
            controller: "OperariosBodegaController"
        });

    }).run(function($rootScope) {
        $rootScope.name = "parametrizacion";
    });

    angular.bootstrap(document, ['parametrizacion']);
    return Parametrizacion;
});