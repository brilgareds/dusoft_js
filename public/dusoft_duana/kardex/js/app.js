//main app module
 define(["angular", "route", "bootstrap","js/controllers",
  "js/services", "js/models", "nggrid",
  "js/directive", "controllers/productoscontroller","controllers/empresacontroller", 
  "models/Empresa", "includes/menu/menucontroller",  "url", "includes/header/HeaderController",
  "loader","models/ProductoMovimiento",  "includes/alert/Alert", "i18n", "httpinterceptor", "storage",
  "includes/classes/Usuario", "socketservice", "includes/http/Request"
  ], function(angular,Agencia){
  /* App Module and its dependencies */
      var Kardex = angular.module('Kardex', [
          'ui.router',
          'controllers',
          'models',
          'directive',
          'ui.bootstrap',
          'ngGrid',
          'Url',
          "services",
          'LocalStorageModule'
      ]); 

      Kardex.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider){

          // For any unmatched url, send to /route1
          //intercepta los http para validar el usuario
          $httpProvider.interceptors.push('HttpInterceptor');

          $urlRouterProvider.otherwise("/listarproductos")
          
          $stateProvider
            .state('listarproductos', {
                url: "/listarproductos",
                text:"Listado de Productos",
                templateUrl: "views/listarproductos.html",
                controller:"productoscontroller"
            }).
            state('listarproductos.verkardex', {
                url: "/listarproductos.verkardex",
                text:"Kardex",
                templateUrl: "views/route1.item.html"
            });

    }]).run(["$rootScope", "localStorageService", "Usuario", function($rootScope, localStorageService, Usuario){
        //se inicializa el usuario y la empresa para el modulo
         $rootScope.name = "Kardex";
        var obj = localStorageService.get("session");
        if(!obj) return;
        Usuario.setToken(obj.auth_token);
        Usuario.setUsuarioId(obj.usuario_id);
    }]);

    angular.bootstrap(document, ['Kardex']);
    return Kardex;
});