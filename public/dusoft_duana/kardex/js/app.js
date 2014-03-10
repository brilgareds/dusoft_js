//main app module
 define(["angular", "route", "bootstrap","js/controllers",
  "js/services", "js/models", "nggrid",
  "js/directive", "controllers/productoscontroller","controllers/empresacontroller", 
  "models/Empresa", "includes/menu/menucontroller",  "config", 
  "loader","i18n","models/ProductoMovimiento",  "includes/alert/Alert",
  ], function(angular,Agencia){
  /* App Module and its dependencies */
      var Kardex = angular.module('Kardex', [
          'ui.router',
          'controllers',
          'models',
          'directive',
          'ui.bootstrap',
          'ngGrid',
          'Config',
          "services"
      ]); 

      Kardex.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/listarproductos")
          
          $stateProvider
            .state('listarproductos', {
                url: "/listarproductos",
                templateUrl: "views/listarproductos.html",
                controller:"productoscontroller"
            }).
            state('listarproductos.verkardex', {
                url: "/listarproductos.verkardex",
                templateUrl: "views/route1.item.html"
            });

    });

    angular.bootstrap(document, ['Kardex']);
    return Kardex;
});