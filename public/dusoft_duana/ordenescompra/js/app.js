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
    "includes/validation/ValidacionNumero",
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
    "dragndropfile",
    "controllers/genererarordenes/ListarOrdenesController",
    "controllers/genererarordenes/GestionarOrdenesController",
    "controllers/novedadesordenes/GestionarNovedadesController",
    "includes/helpersdirectives/visualizarReporte"
], function(angular) {
    /* App Module and its dependencies */

    var ordenes_compras = angular.module('ordenes_compras', [
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
        'flow'
    ]);

    ordenes_compras.urlRouterProvider;
    ordenes_compras.stateProvider;

    ordenes_compras.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            ordenes_compras.urlRouterProvider = $urlRouterProvider;
            ordenes_compras.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {
            $rootScope.name = "Administración Ordenes de Compra";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "ListarOrdenes";

                ordenes_compras.urlRouterProvider.otherwise(vista_predeterminada);

                ordenes_compras.stateProvider.state('ListarOrdenes', {
                    url: "/ListarOrdenes",
                    text: "Administración Ordenes de Compra",
                    templateUrl: "views/genererarordenes/listarordenes.html"
                }).state('OrdenCompra', {
                    url: "/OrdenCompra",
                    text: "Administración Ordenes de Compra",
                    templateUrl: "views/genererarordenes/gestionarordenes.html",
                    parent_name:"ListarOrdenes"
                }).state('Novedades', {
                    url: "/Novedades",
                    text: "Administración Novedades Ordenes de Compra",
                    templateUrl: "views/novedadesordenes/gestionarnovedades.html",
                    parent_name:"ListarOrdenes"
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['ordenes_compras']);
    return ordenes_compras;
});