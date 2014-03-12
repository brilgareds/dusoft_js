//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/Logincontroller", "models/User", "bootstrapjs", "js/directive","directive/focus","js/services",
   "loader","storage", "includes/http/Request", 
  
  ], function(angular){
  /* App Module and its dependencies */
      var loginapp = angular.module('loginapp', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap',
          'directive',
          'LocalStorageModule',
          'services'
      ]);

      loginapp.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/autenticar")
          
          $stateProvider
            .state('autenticar', {
                url: "/autenticar",
                templateUrl: "views/login.html",
                controller:"Logincontroller"
            })

    });

    angular.bootstrap(document, ['loginapp']);
    return loginapp;
});