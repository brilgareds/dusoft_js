//main app module
define(["angular",
    "route",
    "bootstrap",
    "bootstrapLib",
    "js/controllers",
    "js/services",
    "js/models",
    "models/ErrorLog",
    "models/Version",
    "nggrid",
    "js/directive",
    "controllers/Sistema/SistemaController",
    "controllers/Sistema/LogsController",
    "includes/menu/menucontroller",
    "url",
    "includes/header/HeaderController",
    "loader",
    "includes/alert/Alert",
    "httpinterceptor",
    "storage",
    "socketservice",
    "includes/http/Request",
    "uiselect2",
    "includes/classes/CentroUtilidad",
    "services/Version/ParametrosBusquedaService",
    "includes/helpersdirectives/visualizarReporte",
    "webNotification",
    "chart",
], function(angular, Agencia) {
    /* App Module and its dependencies */
    var sistema = angular.module('sistema', [
        'ui.router',
        'controllers',
        'models',
        'directive',
        'ui.bootstrap',
        'ngGrid',
        'Url',
        'services',
        'LocalStorageModule',
        'ui.select',
        'nvd3ChartDirectives',
        'angular-web-notification'
    ]);

    sistema.urlRouterProvider;
    sistema.stateProvider;

    sistema.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            sistema.urlRouterProvider = $urlRouterProvider;
            sistema.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "sistema";
            var vistaDefecto = "Sistema";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                sistema.urlRouterProvider.otherwise(vistaDefecto);

                sistema.stateProvider
                .state('Sistema', {
                    url: "/Sistema",
                    text: "Auditoria del Sistema",
                    templateUrl: "views/sistema/dashboard.html",
                    controller: "SistemaController"
                }).state('Logs', {
                    url: "/Logs",
                    text: "Logs",
                    templateUrl: "views/sistema/logs.html",
                    controller: "LogsController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['sistema']);
    return sistema;
});