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
    "models/Ciudad",
    "models/Documento",
    "models/Transportadora",
    "models/UsuarioPlanillaDespacho",
    "models/EmpresaPlanillaDespacho",
    "models/ClientePlanillaDespacho",
    "models/FarmaciaPlanillaDespacho",
    "models/PlanillaDespacho",
    "controllers/generarplanilladespacho/ListarPlanillasController",
    "controllers/generarplanilladespacho/GestionarPlanillasController",
    "controllers/generarplanilladespacho/GestionarDocumentosBodegaController",
    "includes/helpersdirectives/visualizarReporte"
], function(angular) {

    /* App Module and its dependencies */

    var planillas_despachos = angular.module('planillas_despachos', [
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

    planillas_despachos.urlRouterProvider;
    planillas_despachos.stateProvider;

    planillas_despachos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            planillas_despachos.urlRouterProvider = $urlRouterProvider;
            planillas_despachos.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Administración Planillas Despacho";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "GestionarPlanillas";

                planillas_despachos.urlRouterProvider.otherwise(vista_predeterminada);

                planillas_despachos.stateProvider.state('GestionarPlanillas', {
                    url: "/GestionarPlanillas",
                    text: "Administración Planillas Despacho",
                    templateUrl: "views/generarplanilladespacho/listarplanillasdespacho.html"
                }).state('CrearPlanilla', {
                    url: "/CrearPlanilla",
                    text: "Gestionar Planillas Despacho",
                    templateUrl: "views/generarplanilladespacho/gestionarplanillas.html"
                }).state('ModificarPlanilla', {
                    url: "/ModificarPlanilla",
                    text: "Gestionar Planillas Despacho",
                    templateUrl: "views/generarplanilladespacho/gestionarplanillas.html"
                });

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));

            });

        }]);

    angular.bootstrap(document, ['planillas_despachos']);
    return planillas_despachos;
});