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
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents"
], function(angular) {

    /* App Module and its dependencies */

    var documentos_bodegas = angular.module('documentos_bodegas', [
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

    documentos_bodegas.urlRouterProvider;
    documentos_bodegas.stateProvider;

    documentos_bodegas.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            documentos_bodegas.urlRouterProvider = $urlRouterProvider;
            documentos_bodegas.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Administración Documentos de Bodega";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "DocumentosBodegas";

                documentos_bodegas.urlRouterProvider.otherwise(vista_predeterminada);

                documentos_bodegas.stateProvider.state('DocumentosBodegas', {
                    url: "/DocumentosBodegas",
                    text: "Administración Documentos de Bodega",
                    templateUrl: "views/index.html",                    
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['documentos_bodegas']);
    return documentos_bodegas;
});