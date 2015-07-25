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
    "includes/widgets/InputCheck",
    "uiselect2",
    "loader",
    "includes/menu/menucontroller",
    "url",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    'storage',
    "httpinterceptor",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    "chart",
    "controllers/InduccionController",
    "controllers/InduccionDetalleController"
], function(angular) {

    /* App Module and its dependencies */
    var induccion = angular.module('induccion', [
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
        'nvd3ChartDirectives'
    ]);

    induccion.urlRouterProvider;
    induccion.stateProvider;

    induccion.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            induccion.urlRouterProvider = $urlRouterProvider;
            induccion.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Bienvenido";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "ListarProductos";

                induccion.urlRouterProvider.otherwise(vista_predeterminada);

                induccion.stateProvider.state('ListarProductos', {
                    url: "/ListarProductos",
                    text: "Induccion",
                    templateUrl: "views/induccion/index.html",
                    controller: "InduccionController"
                }).state('DetalleProductos', {
                    url: "/DetalleProductos",
                    text: "Induccion",
                    parent_name: "ListarProductos",
                    templateUrl: "views/induccion/detalleProducto.html",
                    controller: "InduccionDetalleController",
                    /*controller: function($stateParams){
                        console.log($stateParams)
                   
                 },*/
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['induccion']);
    return induccion;
});