//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", "nggrid", "js/directive",
  "controllers/productoscontroller","controllers/empresacontroller",  "models/Empresa", "includes/menucontroller", "facturacion/AgenciaFacturacion",
  "models/Producto",
  ], function(angular,Agencia){
  /* App Module and its dependencies */
      var Kardex = angular.module('Kardex', [
          'ui.router',
          'controllers',
          'models',
          'directive',
          'ui.bootstrap',
          'ngGrid'
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
            state('crearcliente', {
                url: "/crearcliente",
                templateUrl: "views/route1.item.html",
                controller:"clientecontroller"
            })
             /* .state('route1.item', {
                  url: "/item",
                  templateUrl: "views/route1.item.html",
                  controller: "controller"
              })
              
            .state('crearcliente', {
                url: "/crearcliente",
                templateUrl: "views/crearcliente.html",
                controller:"clientecontroller"
            })
              .state('route2.list', {
                  url: "/list",
                  templateUrl: "route2.list.html",
                  controller: function($scope){
                    $scope.things = ["A", "Set", "Of", "Things"];
                  }
              });*/

    });

    angular.bootstrap(document, ['Kardex']);
    return Kardex;
});