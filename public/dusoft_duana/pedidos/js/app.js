//main app module
 define([
  "angular", "socketservice", "route",
  "bootstrap","js/controllers", "js/models",
   "js/services",  "js/directive", "nggrid", "includes/validation/ValidacionNumero", "includes/widgets/InputCheck",
  "controllers/asignarpedidos/PedidosController","controllers/asignarpedidos/PedidosClientesController", "controllers/asignarpedidos/PedidosFarmaciasController",  "uiselect2", 
  "controllers/auditoriapedidos/AuditoriaPedidosController",  "controllers/auditoriapedidos/DetallepedidoSeparadoClienteController", "controllers/generarpedidos/CotizacionesController",
  "controllers/auditoriapedidos/DetallepedidoSeparadoFarmaciaController", "controllers/generarpedidos/CreaCotizacionesController","controllers/generarpedidos/SeleccionClienteController",
  "controllers/generarpedidos/SeleccionProductoClienteController", "controllers/generarpedidos/SeleccionProductoFarmaciaController", "controllers/generarpedidos/CreaPedidoFarmaciaController",
  "controllers/generarpedidos/VerPedidosFarmaciasController", "loader",  "models/EmpresaPedido",
  "includes/menu/menucontroller", "url", "includes/alert/Alert",
  "includes/header/HeaderController", 'storage', "httpinterceptor",
  "includes/classes/Usuario", "includes/http/Request", "dragndropfile", "includes/helpersdirectives/visualizarReporte","includes/classes/Pedido"

  ], function(angular){
  /* App Module and its dependencies */

      var pedidos = angular.module('pedidos', [
          'ui.router',
          'controllers',
          'models',
          'ui.bootstrap',
          'ngGrid',
          'directive',
          'Url',
          'services',
          'ui.select2',
          'LocalStorageModule',
          'flow'
      ]);

      

      pedidos.config( ["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider){

          // For any unmatched url, send to /route1
          console.log($httpProvider, "http provider");
          $httpProvider.interceptors.push('HttpInterceptor');

          $urlRouterProvider.otherwise("/AsignarPedidos");
          
          $stateProvider
            .state('AsignarPedidos', {
                url: "/AsignarPedidos",
                text:"Asignar Pedidos",
                templateUrl: "views/asignarpedidos/AsignarPedidos.html"
                //controller:"pedidoscontroller"
            })
            .state('AuditarPedidos', {
                url: "/AuditarPedidos",
                text:"Auditar Pedidos",
                templateUrl: "views/auditoriapedidos/AuditoriaPedidos.html"
              })
            .state('PedidosClientes', {
                url: "/PedidosClientes",
                text:"Pedidos Clientes",
                templateUrl: "views/generarpedidos/pedidosclientes.html"
              })
            .state('CotizacionCliente', {
                url: "/CotizacionCliente",
                text:"Cotización Clientes",
                templateUrl: "views/generarpedidos/cotizacioncliente.html"
              })
            .state('VerPedidosFarmacias', {
                url: "/VerPedidosFarmacias",
                text:"Pedidos Farmacias",
                templateUrl: "views/generarpedidos/verpedidosfarmacias.html"
              })
            .state('CreaPedidosFarmacias', {
                url: "/CreaPedidosFarmacias",
                text:"Crear/Editar Pedidos Farmacias",
                templateUrl: "views/generarpedidos/creapedidosfarmacias.html"
              });


    }]).run( ["$rootScope", "Usuario", "localStorageService", function($rootScope,Usuario,localStorageService){
        $rootScope.titulo_modulo = "pedidos";   
        console.log(Usuario) 
        var obj = localStorageService.get("session");
        if(!obj) return;
        Usuario.setToken(obj.auth_token);
        Usuario.setUsuarioId(obj.usuario_id);    
    }]);

    angular.bootstrap(document, ['pedidos']);
    return pedidos;
});