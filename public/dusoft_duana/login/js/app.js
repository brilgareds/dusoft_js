//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/Logincontroller", "models/User", "bootstrapjs", "js/directive","directive/focus","js/services",
   "loader","storage", "includes/http/Request", "httpinterceptor","includes/classes/Usuario", "jqueryEasing", "animate",
   "includes/alert/Alert", "directive/loginDirective", "nggrid"
  
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
          'ngGrid'
      ]);

      loginapp.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider){

          // For any unmatched url, send to /route1
          $httpProvider.interceptors.push('HttpInterceptor');
          $urlRouterProvider.otherwise("/autenticar");
          
          $stateProvider
            .state('autenticar', {
                url: "/autenticar",
                templateUrl: "views/login.html",
                controller:"Logincontroller"
            })
            
            .state('recuperarContrasenia', {
                url: "/recuperarContrasenia",
                templateUrl: "views/recuperar_contrasenia.html",
                controller:"Logincontroller"
            });

    }]);

    angular.bootstrap(document, ['loginapp']);
    return loginapp;
});