//main app module
define(["angular",
    "url",
    "chart",
    "route",
    "loader",
    "nggrid",
    "storage",
    "uiselect2",
    "bootstrap",
    "bootstrapLib",
    "httpinterceptor",
    "socketservice",
    "webNotification",
    "js/controllers",
    "js/services",
    "js/models",
    "js/directive",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/ValidacionNumeroEntero",
    "includes/classes/CentroUtilidad",
    "includes/menu/menucontroller",
    "includes/header/HeaderController",
    "includes/alert/Alert",
    "includes/http/Request",
    "models/PlanesRangosEsm",
    "models/EpsAfiliadosEsm",
    "controllers/formulacionExterna/FormulacionExternaController",
    "controllers/formulacionExterna/FormulacionExternaPendientesController",
    "controllers/formulacionExterna/FormulaController",
    "services/formulaExternaService",
],
function(angular, Agencia) {
    /* App Module and its dependencies */
    var formulacionExterna = angular.module('formulacionExterna', [
        'ui.router',
        'controllers',
        'models',
        'directive',
        'ui.bootstrap',
        'ngGrid',
        'Url',
        'services',
        'LocalStorageModule',
        'ui.select',
        'nvd3ChartDirectives',
        'angular-web-notification'
    ]);

    formulacionExterna.urlRouterProvider;
    formulacionExterna.stateProvider;

    formulacionExterna.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            formulacionExterna.urlRouterProvider = $urlRouterProvider;
            formulacionExterna.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "$location", "$state", function($rootScope, localStorageService, $location, $state) {
            //se inicializa el usuario y la empresa para el modulo
            $rootScope.name = "formulacionExterna";
            var vistaDefecto = "FormulacionExterna";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                formulacionExterna.urlRouterProvider.otherwise(vistaDefecto);

                formulacionExterna.stateProvider
                .state('FormulacionExterna', {
                    url: "/FormulacionExterna",
                    text: "Formulacion Externa",
                    templateUrl: "views/formulacionExterna/index.html",
                    controller: "FormulacionExternaController",
                }).state('Formula', {
                    url: "/Formula",
                    text: "Nueva Formula",
                    templateUrl: "views/formulacionExterna/formula.html",
                    controller: "FormulaController",
                    parent_name : "FormulacionExterna"
                }).state('FormulaExternaPendientes', {
                    url: "/FormulaExternaPendientes",
                    text: "Formula externa pendientes",
                    templateUrl: "views/formulacionExterna/formulaExternaPendientes.html",
                    controller: "FormulacionExternaPendientesController",
                    parent_name : "FormulacionExterna"
                });

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }
            });
        }]);

    angular.bootstrap(document, ['formulacionExterna']);
    return formulacionExterna;
});