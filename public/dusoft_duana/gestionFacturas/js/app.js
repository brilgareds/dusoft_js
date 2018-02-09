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
    "controllers/gestionFacturas/radicacionController",
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
    "includes/helpersdirectives/visualizarReporte",
    "webNotification",
    "chart",
], function(angular, Agencia) {
    /* App Module and its dependencies */
    var gestionFacturas = angular.module('gestionFacturas', [
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

    gestionFacturas.urlRouterProvider;
    gestionFacturas.stateProvider;

    gestionFacturas.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            gestionFacturas.urlRouterProvider = $urlRouterProvider;
            gestionFacturas.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "gestionFacturas";
            var vistaDefecto = "gestionFacturas";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                gestionFacturas.urlRouterProvider.otherwise(vistaDefecto);

                gestionFacturas.stateProvider
                .state('Gestionfacturas', {
                    url: "/Gestionfacturas",
                    text: "radicacion",
                    templateUrl: "views/gestionFacturas/radicacion.html",
                    controller: "radicacionController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['gestionFacturas']);
    return gestionFacturas;
});