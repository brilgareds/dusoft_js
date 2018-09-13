//main app module
define(["angular",
    "route",
    "bootstrap",
    "bootstrapLib",
    "js/controllers",
    "js/services",
    "js/models",
    "nggrid",
    "js/directive",
    "controllers/drArias/DrAriasController",
    "controllers/rotaciones/RotacionesController",
    "includes/menu/menucontroller",
    "url",
    "includes/header/HeaderController",
    "loader",
    "includes/alert/Alert",
    "httpinterceptor",
    "storage",
    "includes/classes/Pedido",
    "includes/classes/Bodega",
    "includes/classes/Usuario",
    "models/Zona",
    "models/ReportesGenerados",
    "socketservice",
    "includes/http/Request",
    "uiselect2",
    "includes/classes/CentroUtilidad",
    "services/drArias/ParametrosBusquedaService",
    "includes/helpersdirectives/visualizarReporte",
    "webNotification"
], function(angular, Agencia) {
    /* App Module and its dependencies */
    var reportes = angular.module('reportes', [
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
        'angular-web-notification'
    ]);

    reportes.urlRouterProvider;
    reportes.stateProvider;

    reportes.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            reportes.urlRouterProvider = $urlRouterProvider;
            reportes.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "reportes";
            var vistaDefecto = "DrArias";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                reportes.urlRouterProvider.otherwise(vistaDefecto);

                reportes.stateProvider
                .state('DrArias', {
                    url: "/DrArias",
                    text: "Dr Arias",
                    templateUrl: "views/drArias/listarDrArias.html",
                    controller: "DrAriasController"
                }).state('Rotaciones', {
                    url: "/Rotaciones",
                    text: "Rotaciones",
                    templateUrl: "views/rotaciones/listarRotaciones.html",
                    controller: "RotacionesController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['reportes']);
    return reportes;
});