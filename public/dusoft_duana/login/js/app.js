//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/logincontroller", "models/User", "bootstrapjs",
  
  ], function(angular){
  /* App Module and its dependencies */
      var loginapp = angular.module('loginapp', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap'
      ]);

      loginapp.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/autenticar")
          
          $stateProvider
            .state('autenticar', {
                url: "/autenticar",
                templateUrl: "views/login.html",
                controller:"logincontroller"
            })

    });

    angular.bootstrap(document, ['loginapp']);
    return loginapp;
});