//main app module
define(["angular",
    "route",
    "bootstrap",
    "js/controllers",
    "js/services",
    "js/models",
    "nggrid",
    "js/directive",
    "controllers/productosPedidos/ProductosPedidosController",
    "includes/menu/menucontroller",
    "url",
    "includes/header/HeaderController",
    "loader",
    "includes/alert/Alert",
    "i18n",
    "httpinterceptor",
    "storage",
    "includes/classes/Pedido",
    "includes/classes/Bodega",
    "models/Autorizacion",
    "models/PedidoAutorizacion",
    "models/ProductoAutorizacion",
    "models/TerceroAutorizacion",
    "controllers/productosPedidos/AutorizacionDetalleController",
    "includes/classes/Usuario",
    "socketservice",
    "includes/http/Request",
    "uiselect2",
    "includes/classes/CentroUtilidad",
    "services/AutorizacionPedidosService"
], function(angular, Agencia) {
    /* App Module and its dependencies */
    var autorizaciones = angular.module('autorizaciones', [
        'ui.router',
        'controllers',
        'models',
        'directive',
        'ui.bootstrap',
        'ngGrid',
        'Url',
        'services',
        'LocalStorageModule',
        'ui.select2',
    ]);

    autorizaciones.urlRouterProvider;
    autorizaciones.stateProvider;

    autorizaciones.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            autorizaciones.urlRouterProvider = $urlRouterProvider;
            autorizaciones.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "autorizaciones";
            var vistaDefecto = "ListarProductos";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {


                autorizaciones.urlRouterProvider.otherwise(vistaDefecto);

                autorizaciones.stateProvider
                        .state('AutorizacionesProductos', {
                    url: "/AutorizacionesProductos",
                    text: "Autorizaciones Productos",
                    templateUrl: "views/productosPedidos/listarPedidos.html",
                    controller: "ProductosPedidosController"
                }).
                        state('AutorizacionesDetalle', {
                    url: "/AutorizacionesDetalle",
                    text: "Autorizaciones Detalle",
                    templateUrl: "views/productosPedidos/listarPedidoDetalle.html",
                    parent_name: "AutorizacionesProductos",
                    controller: "AutorizacionDetalleController"
                }).
                        state('DetalleVerificacion', {
                    url: "/DetalleVerificacion",
                    text: "Detalle de Verificacion",
                    templateUrl: "views/productosPedidos/listarDetalleVerificacion.html",
                    parent_name: "AutorizacionesProductos",
                    controller: "AutorizacionDetalleController"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['autorizaciones']);
    return autorizaciones;
});