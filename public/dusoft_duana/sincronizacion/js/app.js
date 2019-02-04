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
    "controllers/asignacionCuentas/AsignacionCuentasController",
    "controllers/sincronizacionDocumentos/SincronizacionDocumentosController",
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
    "socketservice",
    "includes/http/Request",
    "uiselect2",
    "includes/classes/CentroUtilidad",
    "services/serverService",
    "includes/helpersdirectives/visualizarReporte",
    "webNotification"
], function(angular, Agencia) {
    /* App Module and its dependencies */
    var sincronizacion = angular.module('sincronizacion', [
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

    sincronizacion.urlRouterProvider;
    sincronizacion.stateProvider;

    sincronizacion.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            sincronizacion.urlRouterProvider = $urlRouterProvider;
            sincronizacion.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "sincronizacion";
            var vistaDefecto = "SincronizacionDocumentos";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                sincronizacion.urlRouterProvider.otherwise(vistaDefecto);

                sincronizacion.stateProvider
                .state('SincronizacionDocumentos', {
                    url: "/SincronizacionDocumentos",
                    text: "Sincronizacion Documentos",
                    templateUrl: "views/sincronizacionDocumentos/sincronizacionDocumentos.html",
                    controller: "SincronizacionDocumentosController"
                }).state('AsignacionCuentas', {
                    url: "/AsignacionCuentas",
                    text: "Asignacion de Cuentas",
                    templateUrl: "views/asignacionCuentas/asignacionCuentas.html",
                    controller: "AsignacionCuentasController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['sincronizacion']);
    return sincronizacion;
});