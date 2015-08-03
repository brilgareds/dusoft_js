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
    "models/Ciudad",
    "models/Documento",
    "models/Transportadora",
    "models/UsuarioPlanillaDespacho",
    "models/EmpresaPlanillaDespacho",
    "models/ClientePlanillaDespacho",
    "models/FarmaciaPlanillaDespacho",
    "models/PlanillaDespacho",
    "models/modelsPlanillaFarmacia/EmpresaPlanillaFarmacia",
    "models/modelsPlanillaFarmacia/DocumentoPlanillaFarmacia",
    "controllers/generarplanilladespacho/PlanillasController",
    "controllers/generarplanilladespacho/ListarPlanillasController",
    "controllers/generarplanilladespacho/GestionarPlanillasController",
    "controllers/generarplanilladespacho/GestionarDocumentosBodegaController",
    
    /**
     * 
     * @param {type} angular
     * @returns {unresolved}
     * @author Cristian Ardila
     * +Descripcion: Controladores Farmacia
     */
    "controllers/generarplanillafarmacia/ListarPlanillasFarmaciaController",
    "controllers/generarplanillafarmacia/GestionarPlanillasFarmaciasController",
    "controllers/generarplanillafarmacia/GestionarDocumentosFarmaciaController",
    "controllers/generarplanillafarmacia/PlanillasFarmaciaController",
    
    
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents"
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
                    templateUrl: "views/generarplanilladespacho/gestionarplanillas.html",
                    parent_name : "GestionarPlanillas"
                }).state('ModificarPlanilla', {
                    url: "/ModificarPlanilla",
                    text: "Gestionar Planillas Despacho",
                    templateUrl: "views/generarplanilladespacho/gestionarplanillas.html",
                    parent_name : "GestionarPlanillas"
                });
                
                /**
                 * @Author: Cristian Manuel Ardila
                 * +Descripcion: rutas para visualizar las vistas de plantilla farmacia
                 */
                 planillas_despachos.stateProvider.state('GestionarPlanillasFarmacias', {
                    url: "/GestionarPlanillasFarmacias",
                    text: "Administración Planillas Farmacias",
                    templateUrl: "views/generarplanillafarmacia/listarplanillasfarmacia.html"
                }).state('CrearPlanillaFarmacia', {
                    url: "/CrearPlanillaFarmacia",
                    text: "Gestionar Planillas Farmacia",
                    templateUrl: "views/generarplanillafarmacia/gestionarplanillasfarmacia.html",
                    parent_name : "GestionarPlanillasFarmacias"
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