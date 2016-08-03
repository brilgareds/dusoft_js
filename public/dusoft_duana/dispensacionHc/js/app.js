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
    "includes/widgets/InputCheck",
    "uiselect2",
    "loader",
    "includes/menu/menucontroller",
    "url",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/validation/ValidacionNumeroEntero",
    'storage',
    "httpinterceptor",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    "chart",
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
    "services/dispensacionHcService"
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
        'nvd3ChartDirectives'
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