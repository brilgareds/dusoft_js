//main app module
define([
    "angular", "socketservice", "route",
    "bootstrap", "js/controllers", "js/models",
    "js/services", "js/directive", "nggrid", "includes/validation/ValidacionNumero", "includes/widgets/InputCheck", "uiselect2",
    "loader",
    "includes/menu/menucontroller", "url", "includes/alert/Alert",
    "includes/header/HeaderController", 'storage', "httpinterceptor",
    "includes/classes/Usuario", "includes/http/Request", "dragndropfile",
    "controllers/genererarordenes/ListarOrdenesController",
    "controllers/genererarordenes/GestionarOrdenesController",
    "controllers/novedadesordenes/GestionarNovedadesController"

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
        'ui.select2',
        'LocalStorageModule',
        'flow'
    ]);



    ordenes_compras.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {


            $httpProvider.interceptors.push('HttpInterceptor');

            $urlRouterProvider.otherwise("/ListarOrdenes");

            $stateProvider.state('ListarOrdenes', {
                url: "/ListarOrdenes",
                text: "Administración Ordenes de Compra",
                templateUrl: "views/genererarordenes/listarordenes.html"
            }).state('OrdenCompra', {
                url: "/OrdenCompra",
                text: "Administración Ordenes de Compra",
                templateUrl: "views/genererarordenes/gestionarordenes.html"
            }).state('Novedades', {
                url: "/Novedades",
                text: "Administración Novedades Ordenes de Compra",
                templateUrl: "views/novedadesordenes/gestionarnovedades.html"
            });


        }]).run(["$rootScope", "Usuario", "localStorageService", function($rootScope, Usuario, localStorageService) {
            $rootScope.titulo_modulo = "Administración Ordenes de Compra";
            console.log(Usuario)
            var obj = localStorageService.get("session");
            if (!obj)
                return;
            Usuario.setToken(obj.auth_token);
            Usuario.setUsuarioId(obj.usuario_id);
        }]);

    angular.bootstrap(document, ['ordenes_compras']);
    return ordenes_compras;
});