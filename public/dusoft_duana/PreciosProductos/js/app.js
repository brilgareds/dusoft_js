//main app module
define(["angular",
    "route",
    "socketservice",
    "bootstrap",
    "bootstrapLib",
    "js/controllers",
    "js/services",
    "js/models",
    "models/ErrorLog",
    "models/Version",
    "nggrid",
    'storage',
    "httpinterceptor",
    "dragndropfile",
    "js/directive",
    "controllers/PreciosProductosController",
    "includes/validation/ValidacionNumeroDecimal",
    "includes/menu/menucontroller",
    "url",
    "includes/header/HeaderController",
    "loader",
    "dragndropfile",
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
    var preciosProductos = angular.module('preciosProductos', [
        'ui.router',
        'controllers',
        'models',
        'directive',
        'ui.bootstrap',
        'ngGrid',
        'Url',
        'flow',
        'services',
        'LocalStorageModule',
        'ui.select',
        'nvd3ChartDirectives',
        'angular-web-notification'
    ]);

    preciosProductos.urlRouterProvider;
    preciosProductos.stateProvider;

    preciosProductos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            preciosProductos.urlRouterProvider = $urlRouterProvider;
            preciosProductos.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "preciosProductos";
            var vistaDefecto = "preciosProductos";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                preciosProductos.urlRouterProvider.otherwise(vistaDefecto);

                preciosProductos.stateProvider
                .state('PreciosProductos', {
                    url: "/PreciosProductos",
                    text: "Precios Productos",
                    templateUrl: "views/preciosProductos/radicacion.html",
                    controller: "PreciosProductosController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['preciosProductos']);
    return preciosProductos;
});