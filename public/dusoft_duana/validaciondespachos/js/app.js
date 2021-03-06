//main app module 
define([
    "angular",
    "socketservice",
    "route",
    "bootstrap",
    "bootstrapLib",
    "js/controllers",
    "js/models",
    "js/services",
    "js/directive",
    "nggrid",
    "includes/widgets/InputCheck",
    "uiselect2",
    "loader",
    "includes/menu/menucontroller",
    "url",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/validation/ValidacionNumeroEntero",
    'storage',
    "httpinterceptor",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    "chart",
    "models/EmpresaAprobacionDespacho",
    "models/CentroUtilidadInduccion",
    "models/ImagenAprobacion",
    "models/BodegaInduccion",
    "models/ProductoInduccion",
    "models/AprobacionDespacho",
    "models/DocumentoDespacho",
    "models/FarmaciaPlanillaDespacho",
    "models/ClienteDocumento",
    "controllers/ValidacionDespachosController",
    "controllers/EntradaSalidaController",
    "controllers/SalidaController",
    "controllers/ValidacionDespachoDetalleController",
    "controllers/VentanaValidarEgresosController",
    "services/ValidacionDespachosService",
    "webNotification"
], function(angular) {

        /* App Module and its dependencies */
    var validaciondespachos = angular.module('validaciondespachos', [
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
        'nvd3ChartDirectives',
        'angular-web-notification'
    ]);

    validaciondespachos.urlRouterProvider;
    validaciondespachos.stateProvider;

    validaciondespachos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            validaciondespachos.urlRouterProvider = $urlRouterProvider;
            validaciondespachos.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Bienvenido";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "ValidacionEgresos";

                validaciondespachos.urlRouterProvider.otherwise(vista_predeterminada);

                validaciondespachos.stateProvider.state('ValidacionEgresos', {
                    url: "/ValidacionEgresos",
                    text: "ValidacionEgresos",
                    templateUrl: "views/validaciondespachos/index.html",
                    controller: "ValidacionDespachosController"
                }).state('ValidacionEgresosDetalle', {
                    url: "/ValidacionEgresosDetalle",
                    text: "Detalle de despacho aprobado",
                    templateUrl: "views/validaciondespachos/validaciondespachos.html",
                    parent_name : "ValidacionEgresos"
                }).state('EntradaSalida', {
                    url: "/EntradaSalida",
                    text: "Entrada - Salida ",
                    controller: "EntradaSalidaController",
                    templateUrl: "views/validaciondespachos/entrada_salida.html",
                    parent_name : "EntradaSalida"
                }).state('Salida', {
                    url: "/Salida",
                    text: "Salida ",
                    controller: "SalidaController",
                    templateUrl: "views/validaciondespachos/salida.html",
                    parent_name : "Salida"
                });
                    

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['validaciondespachos']);
    return validaciondespachos;
});