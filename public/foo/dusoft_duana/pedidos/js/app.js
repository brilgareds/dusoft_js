//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models",  "js/directive", "nggrid",
  "controllers/pedidoscontroller",  "models/Empresa", "includes/menucontroller", 
  ], function(angular,Agencia){
  /* App Module and its dependencies */

      var Pedidos = angular.module('pedidos', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap',
          'ngGrid',
          'directive'
      ]);

      Pedidos.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/AsignarPedidos");
          
          $stateProvider
            .state('AsignarPedidos', {
                url: "/AsignarPedidos",
                templateUrl: "views/AsignarPedidos.html",
                controller:"pedidoscontroller"
            })
            .state('route1', {
                  url: "/route1",
                  templateUrl: "views/route1.item.html",
                  controller: function(){

                  }
              })

    }).run(function($rootScope){
        $rootScope.name = "pedidos";
    });

    angular.bootstrap(document, ['pedidos']);
    return Pedidos;
});