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
    //Nuevas dependencias
    "sanitize",
    "videogular",
    "vgcontrols",
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
    "webNotification",
    "models/TutorialH",
    "controllers/tutorialesController",
    "services/tutorialesService",
], function(angular) { 

        /* App Module and its dependencies */
    var tutoriales = angular.module('tutoriales', [
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

    tutoriales.urlRouterProvider;
    tutoriales.stateProvider;

    tutoriales.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            tutoriales.urlRouterProvider = $urlRouterProvider;
            tutoriales.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Bienvenido";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "Tutoriales";

                tutoriales.urlRouterProvider.otherwise(vista_predeterminada);

                tutoriales.stateProvider.state('Tutoriales', {
                    url: "/Tutoriales",
                    text: "Tutoriales", 
                    templateUrl: "views/tutoriales/index.html",
                    controller: "tutorialesController"
                }).state('TutorialesDetalle', {
                    url: "/TutorialesDetalle",
                    text: "lista de los tutoriales",
                    templateUrl: "views/tutoriales/listarvideos.html",
                    parent_name : "Tutoriales"
                });
                    

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['tutoriales']);
    return tutoriales;
});