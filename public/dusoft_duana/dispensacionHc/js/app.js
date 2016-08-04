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
    "includes/validation/ValidacionNumero",
    "includes/validation/ValidacionNumeroEntero",
    "includes/validation/ValidacionNumeroDecimal",
    "includes/widgets/InputCheck",     
    "includes/menu/menucontroller",   
    "includes/alert/Alert",
    "includes/header/HeaderController",           
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/helpersdirectives/selectOnClick",
    "includes/validation/NgValidateEvents",
    "models/EmpresaDispensacionHc",
    "models/FormulaHc",
    "models/PacienteHc",
    "models/EpsAfiliadosHc",
    "models/PlanesRangosHc",
    "models/PlanesHc",
    "models/TipoDocumentoHc",
    "models/ProductosFOFO",
    "models/LoteHc",
    "models/ProductosHc",
    "controllers/dispensacionHcController",
    "controllers/dispensacionHcDetalleController",
    "controllers/dispensacionRealizarEntregaController",
    "controllers/dispensacionAutorizarDispensacion",
    "controllers/dispensacionRegistrarEventoController",
    "services/dispensacionHcService",
    "webNotification"
], function(angular) { 

        /* App Module and its dependencies */
    var dispensacionHc = angular.module('dispensacionHc', [
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

    dispensacionHc.urlRouterProvider;
    dispensacionHc.stateProvider;

    dispensacionHc.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            dispensacionHc.urlRouterProvider = $urlRouterProvider;
            dispensacionHc.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Bienvenido";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "DispensacionHc";

                dispensacionHc.urlRouterProvider.otherwise(vista_predeterminada);

                dispensacionHc.stateProvider.state('DispensacionHc', {
                    url: "/DispensacionHc",
                    text: "DispensacionHc", 
                    templateUrl: "views/dispensacionHc/index.html",
                    controller: "dispensacionHcController"
                }).state('DispensarFormulaDetalle', {
                    url: "/DispensarFormulaDetalle",
                    text: "Detalle de formula para dispensar",
                    templateUrl: "views/dispensacionHc/dispensarFormulaDetalle.html",
                    parent_name : "DispensacionHc"
                }).state('DispensarFormulaPendientes',{
                    url: "/DispensarFormulaPendientes",
                    text: "Productos pendientes para dispensar",
                    templateUrl: "views/dispensacionHc/dispensarFormulaPendiente.html",
                    parent_name : "DispensacionHc"
                });
                    

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['dispensacionHc']);
    return dispensacionHc;
});