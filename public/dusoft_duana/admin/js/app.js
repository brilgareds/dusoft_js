//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/Logincontroller", "controllers/ControlPanelController", "controllers/ReportesController", "includes/classes/Usuario", "bootstrapjs", "js/directive",
  "directive/focus","js/services", "url",
  "loader","storage", "includes/http/Request", "includes/alert/Alert"
  
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
                
            }).state('ControlPanel.monitoreoReporte', {
                url: "/MonitoreoReporte",
                templateUrl: "views/monitoreoReporte.html",
                controller:"ReportesController"
            });
            
            

    }]).run(["$rootScope", "localStorageService", "Usuario","$state","$location", function($rootScope,localStorageService, Usuario) {
        
        
    }]);

    angular.bootstrap(document, ['loginapp']);
    return loginapp;
});