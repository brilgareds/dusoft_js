//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/Logincontroller", "controllers/ControlPanelController", "includes/classes/Usuario", "bootstrapjs", "js/directive",
  "directive/focus","js/services", "url",
  "loader","storage", "includes/http/Request"
  
  ], function(angular){
  /* App Module and its dependencies */
      var loginapp = angular.module('loginapp', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap',
          'directive',
          'LocalStorageModule',
          'services',
          'Url'
      ]);

      loginapp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/autenticar");
          
          $stateProvider
            .state('autenticar', {
                url: "/autenticar",
                templateUrl: "views/login.html",
                controller:"Logincontroller"
            }).state('ControlPanel', {
                url: "/ControlPanel",
                templateUrl: "views/controlPanel.html",
                controller:"ControlPanelController"
                
            }).state('ControlPanel.inicializarModulos', {
                url: "/InicializarModulos",
                templateUrl: "views/inicializarModulos.html",
                controller:"SetupController"
            });
            
            

    }]).run(["$rootScope", "localStorageService", "Usuario","$state","$location", function($rootScope,localStorageService, Usuario) {
        
       
        var session = localStorageService.get("session");
        if(session){
            
            var usuario = Usuario.get(session.usuario_id);
            usuario.setToken(session.auth_token);
            Usuario.setUsuarioActual(usuario);
        }
        
    }]);

    angular.bootstrap(document, ['loginapp']);
    return loginapp;
});