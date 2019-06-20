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
    "controllers/ParametrizacionProductosClientes/ParametrizacionProductosClientesController",
    "services/ParametrizacionProductosClientesService",
    "webNotification",
], function (angular) {

    /* App Module and its dependencies */

    var ParametrizacionProductosClientes = angular.module('ParametrizacionProductosClientes', [
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

    ParametrizacionProductosClientes.urlRouterProvider;
    ParametrizacionProductosClientes.stateProvider;

    ParametrizacionProductosClientes.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            ParametrizacionProductosClientes.urlRouterProvider = $urlRouterProvider;
            ParametrizacionProductosClientes.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function ($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Parametrizacion Productos Clientes";

            $rootScope.$on("parametrizacionUsuarioLista", function (e, parametrizacion) {

                var vista_predeterminada = "ParametrizacionProductosClientes";

                ParametrizacionProductosClientes.urlRouterProvider.otherwise(vista_predeterminada);

                ParametrizacionProductosClientes.stateProvider.state('ParametrizacionProductosClientes', {
                    url: "/ParametrizacionProductosClientes",
                    text: "Parametrizacion Productos Clientes",
                    templateUrl: "views/index.html",
                    controller: "ParametrizacionProductosClientesController"
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });
        }]);

    angular.bootstrap(document, ['ParametrizacionProductosClientes']);
    return ParametrizacionProductosClientes;
});
