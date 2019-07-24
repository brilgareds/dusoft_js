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
    "models/Mensaje",
    //"controllers/PlanillasController",
    //"controllers/ListarPlanillasController",
    "controllers/mensajeriaController",
    
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    //Service notificaciones
    "webNotification"
], function(angular) {

    /* App Module and its dependencies */

    var mensajeria = angular.module('mensajeria', [
        'ui.router',
        'ui.tinymce',
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

    mensajeria.urlRouterProvider;
    mensajeria.stateProvider;

    mensajeria.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            mensajeria.urlRouterProvider = $urlRouterProvider;
            mensajeria.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Administración de Mensajes";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "GestionarMensajes";

                mensajeria.urlRouterProvider.otherwise(vista_predeterminada);

                mensajeria.stateProvider.state('GestionarMensajes', {
                    url: "/GestionarMensajes",
                    text: "Listar Mensajes",
                    templateUrl: "views/listarmensajes.html",
                    controller: "mensajeriaController"
                }).state('CrearMensaje', {
                    url: "/CrearMensaje",
                    text: "Crear Mensajes",
                    templateUrl: "views/gestionarmensajes.html",
                    parent_name : "GestionarMensajes",
                    controller: "mensajeriaController"
                });
                
                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));

            });

        }]);

    angular.bootstrap(document, ['mensajeria']);
    return mensajeria;
});