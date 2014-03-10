//main app module
 define(["angular", "route", "bootstrap","js/controllers", "js/models", 
  "controllers/agenciacontroller","controllers/clientecontroller", "models/AgenciaFacturacion", "models/Proveedor", "models/PaqueteTurismo",
  "models/ClienteFacturacion", "models/Hospedaje", "models/Venta","models/Transporte", "models/Excursion",
  ], function(angular,Agencia){
  /* App Module and its dependencies */
      var myapp = angular.module('myapp', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap'
      ]);




      myapp.config(function($stateProvider, $urlRouterProvider){

          // For any unmatched url, send to /route1

          $urlRouterProvider.otherwise("/crearproveedor")
          
          $stateProvider
            .state('crearproveedor', {
                url: "/crearproveedor",
                templateUrl: "views/crearproveedor.html",
                controller:"agenciacontroller"
            })
              .state('route1.item', {
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
              });

    }).run(function(){
        console.log("modulo facturacion");
    });

    angular.bootstrap(document, ['myapp']);
    return myapp;
});