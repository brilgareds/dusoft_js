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
    "includes/menu/menucontroller",
    "url",
    "includes/header/HeaderController",
    "loader",
    "includes/alert/Alert",
    "i18n",
    "httpinterceptor",
    "storage",
    //"includes/classes/Pedido",
    //"includes/classes/Bodega",
    /*"models/Autorizacion",
     "models/PedidoAutorizacion",
     "models/ProductoAutorizacion",
     "models/TerceroAutorizacion",
     "controllers/productosPedidos/AutorizacionDetalleController",
     "controllers/productosPedidos/DetalleVerificacionController",*/
     "controllers/DevolucionesFarmaciaController",
    "includes/classes/Usuario",
    "socketservice",
    "includes/http/Request",
    "uiselect2",
    //"includes/classes/CentroUtilidad",
    "services/DevolucionesFarmaciaService",
    "webNotification"
], function (angular) {
    /* App Module and its dependencies */
    var devoluciones = angular.module('devolucionesFarmacia', [
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
        'angular-web-notification'
    ]);

    devoluciones.urlRouterProvider;
    devoluciones.stateProvider;

    devoluciones.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            devoluciones.urlRouterProvider = $urlRouterProvider;
            devoluciones.stateProvider = $stateProvider;


        }]).run(["$rootScope", "localStorageService", "$location", "$state", function ($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "devoluciones de farmacia";
            var vistaDefecto = "ListarDevoluciones";

            $rootScope.$on("parametrizacionUsuarioLista", function (e, parametrizacion) {


                devoluciones.urlRouterProvider.otherwise(vistaDefecto);

                devoluciones.stateProvider
                        .state('ListarDevoluciones', {
                            url: "/ListarDevoluciones",
                            text: "Listar Devoluciones",
                            templateUrl: "views/devolucionesFarmacia/index.html",
                            controller: "DevolucionesFarmaciaController"
                        }).
                        state('DetalleDevolucion', {
                            url: "/DetalleDevolucion",
                            text: "Detalle de devolucion",
                            templateUrl: "views/devolucionesFarmacia/validacionDevoluciones.html",
                            parent_name: "ListarDevoluciones",
                            controller: "DevolucionesFarmaciaController"
                        });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['devolucionesFarmacia']);
    return devoluciones;
});