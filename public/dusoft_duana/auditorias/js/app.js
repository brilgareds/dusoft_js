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
    "includes/validation/ValidacionNumero",
    "includes/validation/ValidacionNumeroEntero",
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
    "models/ProductoContrato",
    "controllers/auditoriaContratos/ListarProductosContratoController",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    //Service notificaciones
    "webNotification"
], function(angular) {

    /* App Module and its dependencies */

    var auditoria_contratos = angular.module('auditoria_contratos', [
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

    auditoria_contratos.urlRouterProvider;
    auditoria_contratos.stateProvider;

    auditoria_contratos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            auditoria_contratos.urlRouterProvider = $urlRouterProvider;
            auditoria_contratos.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Administración Auditorias";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "Auditorias";

                auditoria_contratos.urlRouterProvider.otherwise(vista_predeterminada);

                auditoria_contratos.stateProvider.state('AuditoriaContratos', {
                    url: "/AuditoriaContratos",
                    text: "Auditoria Contratos",
                    templateUrl: "views/auditoriaContratos/listarProductosContrato.html",
                    controller: "ListarProductosContratoController"
                }).state('CrearPlanilla', {
                    url: "/CrearPlanilla",
                    text: "Gestionar Planillas Despacho",
                    templateUrl: "views/auditoriaContratos/gestionarplanillas.html",
                    parent_name : "AuditoriaContratos"
                });
                
                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));

            });

        }]);

    angular.bootstrap(document, ['auditoria_contratos']);
    return auditoria_contratos;
});