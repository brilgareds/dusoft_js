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
    "controllers/gestionRotacion/RotacionController",
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
    var gestionRotacion = angular.module('GestionRotaciones', [
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

    gestionRotacion.urlRouterProvider;
    gestionRotacion.stateProvider;

    gestionRotacion.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            gestionRotacion.urlRouterProvider = $urlRouterProvider;
            gestionRotacion.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "rotaciones";
            var vistaDefecto = "rotaciones";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                gestionRotacion.urlRouterProvider.otherwise(vistaDefecto);

                gestionRotacion.stateProvider
                .state('GestionRotaciones', {
                    url: "/GestionRotaciones",
                    text: "Gestion Rotaciones",
                    templateUrl: "views/gestionRotacion/rotacion.html",
                    controller: "RotacionController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['GestionRotaciones']);
    return gestionRotacion;
});


