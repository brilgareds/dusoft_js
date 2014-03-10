//main app module
 define(["angular", "socketservice", "route", "bootstrap","js/controllers", "js/models", "js/services",  "js/directive", "nggrid",
  "controllers/PedidosClientesController", "controllers/PedidosFarmaciasController",  "uiselect2", "loader",  "models/Empresa", "includes/menu/menucontroller", "config",
  "includes/alert/Alert",
  ], function(angular){
  /* App Module and its dependencies */

      var Pedidos = angular.module('pedidos', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap',
          'ngGrid',
          'directive',
          'Config',
          'services',
          'ui.select2'
      ]);

      

      Pedidos.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/AsignarPedidos");
          
          $stateProvider
            .state('AsignarPedidos', {
                url: "/AsignarPedidos",
                templateUrl: "views/AsignarPedidos.html"
                //controller:"pedidoscontroller"
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