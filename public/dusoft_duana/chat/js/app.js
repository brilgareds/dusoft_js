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
    "controllers/Admin/AdminController",
    "controllers/Grupos/GuardarGruposController",
    "includes/classes/Chat/GrupoChat",
    "webNotification"
    
    
], function(angular) {
    /* App Module and its dependencies */

    var chat = angular.module('chat', [
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

    // se debe declarar estas propiedades para tener la referencia del urlProvider
    chat.urlRouterProvider;
    chat.stateProvider;

    chat.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
          
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            //se pasa la referencia del urlRouterProvider y del stateProvider, ya no debe declararse los routers en esta parte
            chat.urlRouterProvider = $urlRouterProvider;
            chat.stateProvider = $stateProvider;

        }]).run(["$rootScope", "$location", "$state", function($rootScope, $location, $state) {
            //$rootScope.titulo_modulo = "chat";
            $rootScope.name = "chat";
            var vistaDefecto = "ChatDusoft";

            //este evento se dispara cuando los permisos del usuario esta listos
            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                chat.urlRouterProvider.otherwise(vistaDefecto);

                chat.stateProvider
                .state('ChatDusoft', {
                    url: "/ChatDusoft",
                    text: "Configuracion",
                    templateUrl: "views/Admin/TabAdministracion.html",
                    controller:"AdminController"
                })
                .state('GuardarGrupo', {
                    url: "/GuardarGrupo",
                    text: "Guardar Grupo",
                    templateUrl: "views/Grupos/GuardarGrupo.html",
                    parent_name: "ChatDusoft",
                    controller:"GuardarGruposController"
                })  

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['chat']);
    return chat;
});