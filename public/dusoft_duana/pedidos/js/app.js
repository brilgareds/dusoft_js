//main app module
 define([
  "angular", "socketservice", "route", 
  "bootstrap","js/controllers", "js/models",
   "js/services",  "js/directive", "nggrid",
  "controllers/PedidosController","controllers/PedidosClientesController", "controllers/PedidosFarmaciasController",  "uiselect2", 
  "controllers/AuditoriaPedidosClientesController", "controllers/AuditoriaPedidosFarmaciasController",  "controllers/DetallepedidoSeparadoClienteController",
  "controllers/DetallepedidoSeparadoFarmaciaController", "loader",  "models/Empresa",
  "includes/menu/menucontroller", "config", "includes/alert/Alert",
  "includes/header/HeaderController", 'storage', "httpinterceptor",
  "includes/classes/Usuario", "includes/http/Request"

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
          'ui.select2',
          'LocalStorageModule'
      ]);

      

      Pedidos.config(function($stateProvider, $urlRouterProvider, $httpProvider){

          // For any unmatched url, send to /route1
          $httpProvider.responseInterceptors.push('HttpInterceptor');

          $urlRouterProvider.otherwise("/AsignarPedidos");
          
          $stateProvider
            .state('AsignarPedidos', {
                url: "/AsignarPedidos",
                text:"Asignar Pedidos",
                templateUrl: "views/AsignarPedidos.html"
                //controller:"pedidoscontroller"
            })
            .state('AuditarPedidos', {
                  url: "/AuditarPedidos",
                  text:"Auditar Pedidos",
                  templateUrl: "views/AuditoriaPedidos.html"
              })
            .state('PedidosClientes', {
                  url: "/PedidosClientes",
                  text:"Pedidos Clientes",
                  templateUrl: "views/pedidosclientes.html"
              })

    }).run(function($rootScope,Usuario,localStorageService){
        $rootScope.titulo_modulo = "pedidos";   
        console.log(Usuario) 
        var obj = localStorageService.get("session");
        if(!obj) return;
        Usuario.setToken(obj.auth_token);
        Usuario.setUsuarioId(obj.usuario_id);    
    });

    angular.bootstrap(document, ['pedidos']);
    return Pedidos;
});