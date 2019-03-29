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
    "uiselect2",
    "loader",
    "url",
    'storage',
    "httpinterceptor",
    "dragndropfile",
    'includes/slide/slideContent',
    "includes/validation/ValidacionNumero",
    "includes/validation/ValidacionNumeroEntero",
    "includes/validation/ValidacionNumeroDecimal",
    "includes/validation/CambiarFoco",
    "includes/focus/NgFocus",
    "includes/widgets/InputCheck",
    "includes/menu/menucontroller",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/helpersdirectives/selectOnClick",
    "includes/validation/NgValidateEvents",
    "controllers/NotasProveedores/NotasProveedoresController",
    "services/NotasProveedoresService",
    "webNotification",
], function (angular) {

    /* App Module and its dependencies */

    var NotasProveedores = angular.module('NotasProveedores', [
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
        'flow',
        'angular-web-notification'
    ]);

    NotasProveedores.urlRouterProvider;
    NotasProveedores.stateProvider;

    NotasProveedores.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            NotasProveedores.urlRouterProvider = $urlRouterProvider;
            NotasProveedores.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function ($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Notas Proveedores";

            $rootScope.$on("parametrizacionUsuarioLista", function (e, parametrizacion) {

                var vista_predeterminada = "NotasProveedores";

                NotasProveedores.urlRouterProvider.otherwise(vista_predeterminada);

                NotasProveedores.stateProvider.state('NotasProveedores', {
                    url: "/NotasProveedores",
                    text: "Notas Proveedores",
                    templateUrl: "views/index.html",
                    controller: "NotasProveedoresController"
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });
        }]);

    angular.bootstrap(document, ['NotasProveedores']);
    return NotasProveedores;
});
