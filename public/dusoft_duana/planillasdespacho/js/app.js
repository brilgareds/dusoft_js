//main app module
define([
    "angular", "socketservice", "route",
    "bootstrap", "js/controllers", "js/models",
    "js/services", "js/directive", "nggrid", 
    "includes/validation/ValidacionNumero", "includes/widgets/InputCheck", "uiselect2",
    "loader",
    "includes/menu/menucontroller", "url", "includes/alert/Alert",
    "includes/header/HeaderController", 'storage', "httpinterceptor",
    "includes/classes/Usuario", "includes/http/Request", "dragndropfile",
    "models/Ciudad",
    "models/Documento",
    "models/Transportadora",
    "models/UsuarioPlanillaDespacho",
    "models/EmpresaPlanillaDespacho",
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



    planillas_despachos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {


            $httpProvider.interceptors.push('HttpInterceptor');

            $urlRouterProvider.otherwise("/GestionarPlanillas");

            $stateProvider.state('PlanillaDespachos', {
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


        }]).run(["$rootScope", "Usuario", "localStorageService", function($rootScope, Usuario, localStorageService) {
            $rootScope.titulo_modulo = "Administración Planillas Despacho";
            
            var obj = localStorageService.get("session");
            if (!obj)
                return;
            Usuario.setToken(obj.auth_token);
            Usuario.setUsuarioId(obj.usuario_id);
        }]);

    angular.bootstrap(document, ['planillas_despachos']);
    return planillas_despachos;
});